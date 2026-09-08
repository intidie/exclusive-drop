import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// TRM fija de negocio para pagos internacionales. NO es la tasa de mercado
// del día: es un valor fijo que la tienda decide, y solo cambia si se edita
// este archivo (queda versionado en git). Debe coincidir con USD_TRM en
// src/lib/drop-data.ts (que solo se usa para el ESTIMADO visual en el
// frontend; el monto real que se cobra siempre sale de aquí).
const USD_TRM = 4000;

const VALID_SIZES = ["S", "M", "L", "XL", "XXL"];
const VALID_COUNTRIES = ["CO", "INTL"] as const;
type CountryCode = (typeof VALID_COUNTRIES)[number];
const VALID_DOC_TYPES = ["CC", "NIT", "CE", "PASAPORTE", "OTRO"] as const;

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

// Verifica el token de Cloudflare Turnstile contra el endpoint oficial.
// SIEMPRE del lado del servidor — el widget del frontend por sí solo no
// bloquea nada, cualquiera podría llamar a este endpoint directo sin pasar
// por el navegador. El secret NUNCA debe exponerse al cliente (no usar
// prefijo VITE_).
async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  const secret = process.env["TURNSTILE_SECRET_KEY"]?.trim();
  if (!secret) {
    console.error("[checkout] Falta TURNSTILE_SECRET_KEY.");
    return false;
  }
  if (!token) return false;

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (remoteIp) form.set("remoteip", remoteIp);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const data = (await res.json()) as { success?: boolean; ["error-codes"]?: string[] };
    if (!data.success) {
      console.warn("[checkout] Turnstile rechazado:", data["error-codes"]);
    }
    return data.success === true;
  } catch (err) {
    console.error("[checkout] Error verificando Turnstile:", err);
    return false;
  }
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

        // Verificación anti-bot: PRIMERO Turnstile, antes de leer Supabase o
        // reservar stock. Así una petición automatizada sin token válido se
        // rechaza de inmediato, sin gastar ni una sola consulta a la base de
        // datos ni a Wompi.
        const turnstileToken = sanitize(body["turnstileToken"], 2000);
        const remoteIp =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          null;
        const turnstileOk = await verifyTurnstile(turnstileToken, remoteIp);
        if (!turnstileOk) {
          return jsonResponse(
            { error: "No pudimos verificar que eres una persona real. Intenta de nuevo." },
            403,
          );
        }

        const name = sanitize(body["name"], 80);
        const phone = sanitize(body["phone"], 30);
        const email = sanitize(body["email"], 120);
        const city = sanitize(body["city"], 60);
        const address = sanitize(body["address"], 200);

        // --- Campos obligatorios SOLO para pedidos nacionales (country=CO) ---
        const docType = sanitize(body["docType"], 15).toUpperCase();
        const docNumber = sanitize(body["docNumber"], 40);
        const department = sanitize(body["department"], 60);

        // --- Campos obligatorios SOLO para pedidos internacionales (country=INTL) ---
        const idNumber = sanitize(body["idNumber"], 40); // documento fiscal / DNI / pasaporte
        const postalCode = sanitize(body["postalCode"], 20);
        const state = sanitize(body["state"], 60);
        const destinationCountry = sanitize(body["destinationCountry"], 60);

        // Único dato de "categoría de precio" que decide el cliente: solo
        // hay dos casos válidos, nacional o internacional. Esto NO permite
        // manipular el monto — cada categoría tiene un precio 100% calculado
        // por el servidor más abajo. No hay valor por defecto silencioso: si
        // no llega "CO" o "INTL" exactos, se rechaza la solicitud completa.
        const rawCountry = sanitize(body["country"], 10).toUpperCase();
        if (!VALID_COUNTRIES.includes(rawCountry as CountryCode)) {
          return jsonResponse(
            { error: "Selecciona si tu compra es nacional (Colombia) o internacional." },
            400,
          );
        }
        const country = rawCountry as CountryCode;
        const isNational = country === "CO";
        const currency = isNational ? "COP" : "USD";

        if (cart.length === 0) {
          return jsonResponse({ error: "El carrito está vacío o es inválido." }, 400);
        }
        if (!name || !phone || !city || !address) {
          return jsonResponse({ error: "Faltan datos de envío." }, 400);
        }

        // Cada categoría tiene su propio conjunto de campos obligatorios,
        // exactamente los que pide el negocio — sin excepciones.
        if (isNational) {
          if (!VALID_DOC_TYPES.includes(docType as (typeof VALID_DOC_TYPES)[number]) || !docNumber || !department) {
            return jsonResponse(
              {
                error:
                  "Para compras nacionales faltan datos: tipo/número de documento de identidad o departamento.",
              },
              400,
            );
          }
        } else {
          if (!idNumber || !email || !postalCode || !state || !destinationCountry) {
            return jsonResponse(
              {
                error:
                  "Para compras internacionales faltan datos: documento de identificación, correo, código postal, estado/provincia o país de destino.",
              },
              400,
            );
          }
        }

        // Credenciales de Wompi. La pasarela internacional es LA MISMA
        // integración de Wompi (mismo widget, mismo esquema de firma
        // sha256(reference+amount+currency+secret)), cambiando currency a
        // USD. Si configuras llaves específicas para cobros internacionales
        // en el dashboard de Wompi, defínelas en WOMPI_INTL_PUBLIC_KEY /
        // WOMPI_INTL_INTEGRITY_SECRET; si no existen, se reutilizan las
        // llaves nacionales (útil mientras activas el producto internacional
        // en Wompi).
        const integritySecretCo = process.env["WOMPI_INTEGRITY_SECRET"]?.trim();
        const publicKeyCo = (process.env["VITE_WOMPI_PUBLIC_KEY"] ?? process.env["WOMPI_PUBLIC_KEY"])?.trim();
        const integritySecretIntl =
          (process.env["WOMPI_INTL_INTEGRITY_SECRET"] ?? process.env["WOMPI_INTEGRITY_SECRET"])?.trim();
        const publicKeyIntl =
          (process.env["VITE_WOMPI_INTL_PUBLIC_KEY"] ?? process.env["WOMPI_INTL_PUBLIC_KEY"] ?? publicKeyCo)?.trim();

        const integritySecret = isNational ? integritySecretCo : integritySecretIntl;
        const publicKey = isNational ? publicKeyCo : publicKeyIntl;
        if (!integritySecret || !publicKey) {
          console.error(
            `[checkout] Faltan credenciales de Wompi para country=${country} (currency=${currency}).`,
          );
          return jsonResponse({ error: "El pago no está disponible en este momento." }, 500);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Traer precio y stock REALES desde Supabase — nunca del cliente.
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

        // El envío NO se cobra por este sistema. El subtotal SIEMPRE nace en
        // COP desde `products.price_cop` / `product_sizes.extra_price_cop`
        // en Supabase — el cliente jamás envía ni puede alterar un precio.
        // Si es nacional se cobra ese subtotal en COP tal cual. Si es
        // internacional se convierte a USD con la TRM FIJA de negocio
        // (constante, no de mercado) y ESE es el precio fijo que se cobra.
        const subtotalCop = lines.reduce((sum, l) => sum + l.unitPriceCop * l.qty, 0);

        const fxRateUsed = isNational ? null : USD_TRM;
        const amountInCents = isNational
          ? subtotalCop * 100
          : Math.round((subtotalCop / USD_TRM) * 100); // subtotal en USD, redondeado a centavos
        const amountMajorUnits = isNational
          ? subtotalCop
          : Math.round((subtotalCop / USD_TRM) * 100) / 100;

        // Reservar stock de forma atómica (evita sobreventa por condición de
        // carrera): solo descuenta si todavía hay suficiente stock.
        for (const line of lines) {
          const { data: updated, error: stockError } = await supabaseAdmin.rpc(
            "decrement_stock_if_available",
            { p_size_id: line.sizeRowId, p_qty: line.qty },
          );
          if (stockError || updated !== true) {
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
            amount_in_cents: amountInCents,
            currency,
            country,
            fx_rate_used: fxRateUsed,
            status: "pending",
            customer_name: name,
            customer_phone: phone,
            customer_email: email || null,
            shipping_city: city,
            shipping_address: address,
            // Nacional: documento de identidad + departamento.
            doc_type: isNational ? docType : null,
            doc_number: isNational ? docNumber : null,
            shipping_department: isNational ? department : null,
            // Internacional: documento/pasaporte + dirección internacional.
            id_number: isNational ? null : idNumber,
            postal_code: isNational ? null : postalCode,
            state: isNational ? null : state,
            destination_country: isNational ? null : destinationCountry,
          })
          .select("id, reference")
          .single();

        if (dbError || !order) {
          console.error("[checkout] Error creando el pedido:", dbError);
          for (const line of lines) {
            await supabaseAdmin.rpc("increment_stock", { p_size_id: line.sizeRowId, p_qty: line.qty });
          }
          return jsonResponse({ error: "No pudimos registrar tu pedido." }, 500);
        }

        const signature = await sha256Hex(
          `${reference}${amountInCents}${currency}${integritySecret}`,
        );

        return jsonResponse({
          reference,
          amountInCents,
          currency,
          country,
          publicKey,
          signature,
          subtotal: amountMajorUnits,
          total: amountMajorUnits,
          fxRateUsed,
        });
      },
    },
  },
});
