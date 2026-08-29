import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

type WompiEvent = {
  event: string;
  data: { transaction?: Record<string, unknown> };
  timestamp: number;
  signature: { properties: string[]; checksum: string };
};

const STATUS_MAP: Record<string, "approved" | "declined" | "error"> = {
  APPROVED: "approved",
  DECLINED: "declined",
  ERROR: "error",
  VOIDED: "declined",
};

export const Route = createFileRoute("/api/wompi-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const eventsSecret = process.env["WOMPI_EVENTS_SECRET"];
        if (!eventsSecret) {
          console.error("[wompi-webhook] Falta WOMPI_EVENTS_SECRET.");
          return jsonResponse({ error: "No configurado." }, 500);
        }

        let payload: WompiEvent;
        try {
          payload = await request.json();
        } catch {
          return jsonResponse({ error: "JSON inválido." }, 400);
        }

        const { data, timestamp, signature } = payload;
        if (!data?.transaction || !signature?.properties || !signature?.checksum || !timestamp) {
          return jsonResponse({ error: "Payload incompleto." }, 400);
        }

        // 1) Verificar el checksum firmado por Wompi con nuestro secreto de eventos.
        //    Esto garantiza que el evento vino realmente de Wompi y no fue
        //    falsificado ni alterado en tránsito.
        const concatenated =
          signature.properties.map((p) => String(getByPath(payload, p) ?? "")).join("") +
          String(timestamp) +
          eventsSecret;
        const expectedChecksum = await sha256Hex(concatenated);

        if (expectedChecksum.toUpperCase() !== signature.checksum.toUpperCase()) {
          console.error("[wompi-webhook] Checksum inválido, evento rechazado.");
          return jsonResponse({ error: "Firma inválida." }, 401);
        }

        const transaction = data.transaction;
        const reference = String(transaction["reference"] ?? "");
        const wompiStatus = String(transaction["status"] ?? "");
        const wompiTransactionId = String(transaction["id"] ?? "");
        const wompiAmountInCents = Number(transaction["amount_in_cents"] ?? -1);

        const mappedStatus = STATUS_MAP[wompiStatus];
        if (!reference || !mappedStatus) {
          return jsonResponse({ ok: true, ignored: true });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // 2) Defensa adicional: el monto reportado por Wompi debe coincidir
        //    con el que nosotros calculamos y guardamos al crear el pedido.
        const { data: order, error: fetchError } = await supabaseAdmin
          .from("orders")
          .select("id, amount_in_cents, status")
          .eq("reference", reference)
          .single();

        if (fetchError || !order) {
          console.error("[wompi-webhook] Pedido no encontrado para reference:", reference);
          return jsonResponse({ ok: true, ignored: true });
        }

        if (order.amount_in_cents !== wompiAmountInCents) {
          console.error(
            `[wompi-webhook] Monto no coincide para ${reference}: esperado ${order.amount_in_cents}, recibido ${wompiAmountInCents}.`,
          );
          return jsonResponse({ ok: true, ignored: true });
        }

        if (order.status !== "pending") {
          // Evento repetido (Wompi reintenta); ya fue procesado.
          return jsonResponse({ ok: true });
        }

        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({ status: mappedStatus, wompi_transaction_id: wompiTransactionId })
          .eq("id", order.id)
          .eq("status", "pending");

        if (updateError) {
          console.error("[wompi-webhook] Error actualizando pedido:", updateError);
          return jsonResponse({ error: "Error interno." }, 500);
        }

        return jsonResponse({ ok: true });
      },
    },
  },
});
