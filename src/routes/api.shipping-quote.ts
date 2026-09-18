import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  getDomesticShippingQuote,
  getInternationalShippingQuotes,
} from "@/lib/envia.server";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitize(value: unknown, maxLength: number): string {
  return String(value ?? "").trim().slice(0, maxLength);
}

// Cotización EN VIVO de envío contra Envia.com, solo para mostrarle al
// cliente un estimado en el formulario de checkout. Es puramente
// informativo: nunca se conecta con Wompi ni cambia el monto que se cobra
// (ver src/routes/api.checkout.ts). Por eso, ante cualquier falla, esta
// ruta responde 200 con los campos en `null` en vez de un error — no es
// crítico para poder completar la compra.
export const Route = createFileRoute("/api/shipping-quote")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ domestic: null, premium: null, economica: null });
        }

        const country = sanitize(body["country"], 10).toUpperCase();
        const city = sanitize(body["city"], 60);
        const department = sanitize(body["department"], 60);
        const state = sanitize(body["state"], 60);
        const postalCode = sanitize(body["postalCode"], 20);
        const destinationCountry = sanitize(body["destinationCountry"], 60);

        const rawQty = Math.floor(Number(body["qty"]));
        const qty = Number.isFinite(rawQty) && rawQty > 0 ? Math.min(rawQty, 50) : 1;

        try {
          if (country === "CO") {
            if (!city || !department) {
              return jsonResponse({ domestic: null });
            }
            const domestic = await getDomesticShippingQuote({ city, department, qty });
            return jsonResponse({ domestic });
          }

          if (country === "INTL") {
            if (!city || !state || !postalCode || !destinationCountry) {
              return jsonResponse({ premium: null, economica: null });
            }
            const quotes = await getInternationalShippingQuotes({
              destinationCountry,
              city,
              state,
              postalCode,
              qty,
            });
            return jsonResponse(quotes);
          }

          return jsonResponse({ domestic: null, premium: null, economica: null });
        } catch (err) {
          // No debe pasar (las funciones de envia.server.ts ya atrapan sus
          // propios errores), pero por si acaso: nunca un 500 por esto.
          console.error("[shipping-quote] Error inesperado:", err);
          return jsonResponse({ domestic: null, premium: null, economica: null });
        }
      },
    },
  },
});
