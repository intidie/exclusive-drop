import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PRICE, PRODUCTS, SIZES } from "@/lib/drop-data";

const CURRENCY = "COP";

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

        const productSlug = sanitize(body["productSlug"], 60);
        const size = sanitize(body["size"], 10);
        const name = sanitize(body["name"], 80);
        const phone = sanitize(body["phone"], 25);
        const city = sanitize(body["city"], 60);
        const address = sanitize(body["address"], 160);

        // El precio y el nombre del producto SIEMPRE salen del catálogo del
        // servidor. El cliente nunca puede influir en el monto que se cobra.
        const product = PRODUCTS.find((p) => p.slug === productSlug);
        if (!product) {
          return jsonResponse({ error: "Producto inválido." }, 400);
        }
        if (!SIZES.includes(size)) {
          return jsonResponse({ error: "Talla inválida." }, 400);
        }
        if (!name || !phone || !city || !address) {
          return jsonResponse({ error: "Faltan datos de envío." }, 400);
        }

        const amountInCents = PRICE * 100;

        const integritySecret = process.env["WOMPI_INTEGRITY_SECRET"]?.trim();
        const publicKey = (process.env["VITE_WOMPI_PUBLIC_KEY"] ?? process.env["WOMPI_PUBLIC_KEY"])?.trim();
        if (!integritySecret || !publicKey) {
          console.error("[checkout] Faltan WOMPI_INTEGRITY_SECRET o VITE_WOMPI_PUBLIC_KEY.");
          return jsonResponse({ error: "El pago no está disponible en este momento." }, 500);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: order, error: dbError } = await supabaseAdmin
          .from("orders")
          .insert({
            product_slug: product.slug,
            product_name: product.name,
            size,
            amount_in_cents: amountInCents,
            currency: CURRENCY,
            status: "pending",
            reference: crypto.randomUUID(),
            customer_name: name,
            customer_phone: phone,
            shipping_city: city,
            shipping_address: address,
          })
          .select("id, reference")
          .single();

        if (dbError || !order) {
          console.error("[checkout] Error creando el pedido:", dbError);
          return jsonResponse({ error: "No pudimos registrar tu pedido." }, 500);
        }

        const reference = order.reference as string;
        const signature = await sha256Hex(
          `${reference}${amountInCents}${CURRENCY}${integritySecret}`,
        );

        return jsonResponse({
          reference,
          amountInCents,
          currency: CURRENCY,
          publicKey,
          signature,
        });
      },
    },
  },
});
