import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitize(value: unknown, maxLength: number): string {
  return String(value ?? "").trim().slice(0, maxLength);
}

// Registro de visitas por origen (ej. bio de Instagram) en la tabla
// public.site_visits (ver supabase/migrations/20260908151634_*.sql). Esto es
// analítica best-effort: NUNCA debe romper ni bloquear la navegación del
// visitante, así que cualquier error se registra en logs y responde 200
// igual. El insert usa supabaseAdmin (service role) porque site_visits no
// tiene políticas de escritura para el cliente anónimo — solo
// "service_role_full_access" (ver migración 20260908151651_*.sql).
export const Route = createFileRoute("/api/track-visit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ error: "JSON inválido." }, 400);
        }

        const source = sanitize(body["source"], 40) || "direct";
        const path = sanitize(body["path"], 300) || "/";
        const referrerRaw = sanitize(body["referrer"], 500);
        const referrer = referrerRaw || null;
        const userAgentRaw = sanitize(request.headers.get("user-agent"), 300);
        const userAgent = userAgentRaw || null;

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin.from("site_visits").insert({
            source,
            path,
            referrer,
            user_agent: userAgent,
          });
          if (error) {
            console.error("[track-visit] Error insertando visita:", error);
          }
        } catch (err) {
          console.error("[track-visit] Error registrando visita:", err);
        }

        // Siempre 200: es analítica, no debe hacer fallar nada en el cliente.
        return jsonResponse({ ok: true });
      },
    },
  },
});
