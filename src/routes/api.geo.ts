import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Detecta el país del visitante por IP usando cabeceras que el hosting
// agrega solo — sin librería externa ni llamada a otro servicio. En Vercel
// "x-vercel-ip-country" viene lista sin configuración; si algún día corre
// detrás de Cloudflare, "cf-ipcountry" hace lo mismo. Es SOLO para
// preseleccionar "nacional" o "internacional" en el formulario (comodidad
// de UX): el monto cobrado y las validaciones del pedido nunca dependen de
// este valor, así que no afecta la seguridad del pago.
export const Route = createFileRoute("/api/geo")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const country =
          request.headers.get("x-vercel-ip-country") ??
          request.headers.get("cf-ipcountry") ??
          null;
        return jsonResponse({ country });
      },
    },
  },
});
