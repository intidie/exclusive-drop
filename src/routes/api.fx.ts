import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getUsdCopRate } from "@/lib/fx.server";

// Devuelve la tasa de cambio real USD -> COP para mostrar precios en dólares
// a visitantes internacionales. No interviene en el cobro.
export const Route = createFileRoute("/api/fx")({
  server: {
    handlers: {
      GET: async () => {
        const { rate, live } = await getUsdCopRate();
        return new Response(JSON.stringify({ rate, live }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
