import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Endpoint público de solo lectura: le da al frontend la TRM oficial del
// día (Banco de la República) para mostrar el precio en dólares. NO se usa
// para cobrar nada — el monto real que cobra Wompi siempre es en COP y
// nunca depende de este valor (ver src/routes/api.checkout.ts).
export const Route = createFileRoute("/api/trm")({
  server: {
    handlers: {
      GET: async () => {
        const { getTrm } = await import("@/lib/trm");
        const { trm, source } = await getTrm();
        return new Response(JSON.stringify({ trm, source }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            // El valor no cambia más de una vez al día; se puede cachear
            // en el borde/CDN un rato sin problema.
            "Cache-Control": "public, max-age=1800",
          },
        });
      },
    },
  },
});
