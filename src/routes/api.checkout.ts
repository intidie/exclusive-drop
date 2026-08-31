import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const CURRENCY = "COP";
const FREE_SHIPPING_THRESHOLD_COP = 250000;
const DEFAULT_SHIPPING_COP = 17000; // fallback si el departamento no está en shipping_zones
const VALID_SIZES = ["S", "M", "L", "XL", "XXL"];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitize(value: unknown, maxLength: number): string {
  return String(value ?? "").trim().slice(0, maxLength);
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type CartLine = { slug: string; size: string; qty: number };

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ error: "JSON inválido." }, 400);
        }

        const rawItems = Array.isArray(body["items"]) ? (body["items"] as unknown[]) : [];
        const cart: CartLine[] = rawItems
          .map((it) => {
            const o = it as Record<string, unknown>;
            const qty = Math.floor(Number(o["qty"] ?? 1));
            return {
              slug: sanitize(o["slug"], 60),
              size: sanitize(o["size"], 10).toUpperCase(),
              qty: Number.isFinite(qty) && qty > 0 ? Math.min(qty, 10) : 1,
            };
          })
          .filter((it) => it.slug && VALID_SIZES.includes(it.size));

        const name = sanitize(body["name"], 80);
        const phone = sanitize(body["phone"], 25);
        const email = sanitize(body["email"], 120);
        const department = sanitize(body["department"], 60);
        const city = sanitize(body["city"], 60);
        const address = sanitize(body["address"], 160);

        if (cart.length === 0) {
          return jsonResponse({ error: "El carrito está vacío o es inválido." }, 400);
        }
        if (!name || !phone || !department || !city || !address) {
          return jsonResponse({ error: "Faltan datos de envío." }, 400);
        }

        const integritySecret = process.env["WOMPI_INTEGRITY_SECRET"]?.trim();
        const publicKey = (process.env["VITE_WOMPI_PUBLIC_KEY"] ?? process.env["WOMPI_PUBLIC_KEY"])?.trim();
        if (!integritySecret || !publicKey) {
          console.error("[checkout] Faltan WOMPI_INTEGRITY_SECRET o VITE_WOMPI_PUBLIC_KEY.");
          return jsonResponse({ error: "El pago no está disponible en este momento." }, 500);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // 1) Traer precio y stock REALES desde Supabase — nunca del cliente.
        const slugs = [...new Set(cart.map((c) => c.slug))];
        const { data: products, error: prodError } = await supabaseAdmin
          .from("products")
          .select("id, slug, name, price_cop, active")
          .in("slug", slugs)
          .eq("active", true);

        if (prodError || !products || products.length === 0) {
          return jsonResponse({ error: "Uno o más productos no existen." }, 400);
        }

        const { data: sizeRows, error: sizeError } = await supabaseAdmin
          .from("product_sizes")
          .select("id, product_id, size, stock, extra_price_cop")
          .in(
            "product_id",
            products.map((p) => p.id),
          );

        if (sizeError || !sizeRows) {
          return jsonResponse({ error: "No pudimos validar el inventario." }, 500);
        }

        type Line = {
          slug: string;
          name: string;
          size: string;
          qty: number;
          unitPriceCop: number;
          sizeRowId: string;
        };
        const lines: Line[] = [];

        for (const item of cart) {
          const product = products.find((p) => p.slug === item.slug);
          if (!product) {
            return jsonResponse({ error: `Producto inválido: ${item.slug}` }, 400);
          }
          const sizeRow = sizeRows.find((s) => s.product_id === product.id && s.size === item.size);
          if (!sizeRow) {
            return jsonResponse({ error: `Talla inválida para ${item.slug}.` }, 400);
          }
          if (sizeRow.stock < item.qty) {
            return jsonResponse(
              { error: `Sin stock suficiente de ${product.name} talla ${item.size}.` },
              409,
            );
          }
          lines.push({
            slug: product.slug,
            name: product.name,
            size: item.size,
            qty: item.qty,
            unitPriceCop: product.price_cop + sizeRow.extra_price_cop,
            sizeRowId: sizeRow.id,
          });
        }

        const subtotalCop = lines.reduce((sum, l) => sum + l.unitPriceCop * l.qty, 0);

        // 2) Envío: solo nacional, por departamento, gratis sobre el umbral.
        let shippingCop = 0;
        if (subtotalCop < FREE_SHIPPING_THRESHOLD_COP) {
          const { data: zone } = await supabaseAdmin
            .from("shipping_zones")
            .select("shipping_cop")
            .eq("department", department)
            .maybeSingle();
          shippingCop = zone?.shipping_cop ?? DEFAULT_SHIPPING_COP;
        }

        const totalCop = subtotalCop + shippingCop;
        const amountInCents = totalCop * 100;

        // 3) Reservar stock de forma atómica (evita sobreventa por condición
        //    de carrera): solo descuenta si todavía hay suficiente stock.
        for (const line of lines) {
          const { data: updated, error: stockError } = await supabaseAdmin.rpc(
            "decrement_stock_if_available",
            { p_size_id: line.sizeRowId, p_qty: line.qty },
          );
          if (stockError || updated !== true) {
            // Revertir lo ya descontado en este mismo intento antes de fallar.
            const idx = lines.indexOf(line);
            for (const done of lines.slice(0, idx)) {
              await supabaseAdmin.rpc("increment_stock", {
                p_size_id: done.sizeRowId,
                p_qty: done.qty,
              });
            }
            return jsonResponse({ error: `Se agotó el stock de ${line.name} talla ${line.size}.` }, 409);
          }
        }

        const reference = crypto.randomUUID();
        const itemsSnapshot = lines.map((l) => ({
          slug: l.slug,
          name: l.name,
          size: l.size,
          qty: l.qty,
          unit_price_cop: l.unitPriceCop,
          line_total_cop: l.unitPriceCop * l.qty,
        }));

        const { data: order, error: dbError } = await supabaseAdmin
          .from("orders")
          .insert({
            reference,
            items: itemsSnapshot,
            subtotal_cop: subtotalCop,
            shipping_cop: shippingCop,
            amount_in_cents: amountInCents,
            currency: CURRENCY,
            status: "pending",
            customer_name: name,
            customer_phone: phone,
            customer_email: email || null,
            shipping_department: department,
            shipping_city: city,
            shipping_address: address,
          })
          .select("id, reference")
          .single();

        if (dbError || !order) {
          console.error("[checkout] Error creando el pedido:", dbError);
          // Devolver el stock reservado si el pedido no se pudo crear.
          for (const line of lines) {
            await supabaseAdmin.rpc("increment_stock", { p_size_id: line.sizeRowId, p_qty: line.qty });
          }
          return jsonResponse({ error: "No pudimos registrar tu pedido." }, 500);
        }

        const signature = await sha256Hex(
          `${reference}${amountInCents}${CURRENCY}${integritySecret}`,
        );

        return jsonResponse({
          reference,
          amountInCents,
          currency: CURRENCY,
          publicKey,
          signature,
          subtotalCop,
          shippingCop,
          totalCop,
        });
      },
    },
  },
});
