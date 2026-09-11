import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Link para poner en la bio de Instagram: https://www.inti-net.com/ig
//
// Por qué existe esta ruta: en la bio no queremos un link largo ni con
// parámetros (?utm_source=instagram&...) — eso se ve feo y poco confiable.
// En vez de eso, la bio apunta a este path corto, que:
//   1) registra la visita como originada en Instagram (tabla site_visits),
//   2) redirige (302) de inmediato a "/".
// Como es un redirect del lado del servidor, el navegador nunca muestra
// "/ig" de forma persistente: la barra de direcciones termina en
// "www.inti-net.com" limpio, sin importar qué llevaba el link original.
export const Route = createFileRoute("/ig")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const url = new URL(request.url);
          await supabaseAdmin.from("site_visits").insert({
            source: "instagram_bio",
            referrer: request.headers.get("referer") ?? null,
            user_agent: request.headers.get("user-agent") ?? null,
            path: url.pathname,
          });
        } catch (err) {
          // Nunca bloquear al visitante por un fallo de analítica.
          console.error("[ig] No se pudo registrar la visita:", err);
        }

        return new Response(null, {
          status: 302,
          headers: { Location: "/" },
        });
      },
    },
  },
});
