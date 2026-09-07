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

// "VENTA REALIZADA" es el estado que ve Inti en la tabla de Supabase cuando
// el pago quedó confirmado y verificado por la firma de Wompi.
const STATUS_MAP: Record<string, "VENTA REALIZADA" | "declined" | "error"> = {
  APPROVED: "VENTA REALIZADA",
  DECLINED: "declined",
  ERROR: "error",
  VOIDED: "declined",
};

export const Route = createFileRoute("/api/wompi-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const eventsSecret = process.env["WOMPI_EVENTS_SECRET"]?.trim();
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

        // 1) Verificar el checksum firmado por Wompi con nuestro secreto de
        //    eventos: así confirmamos que el evento vino realmente de Wompi.
        //    Este mismo secreto de eventos sirve tanto para transacciones
        //    nacionales (COP) como internacionales (USD): Wompi firma el
        //    evento completo, incluyendo currency, así que un evento
        //    reindexado a otra moneda no pasaría la verificación.
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
        const wompiCurrency = String(transaction["currency"] ?? "");

        const mappedStatus = STATUS_MAP[wompiStatus];
        if (!reference || !mappedStatus) {
          return jsonResponse({ ok: true, ignored: true });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // 2) Defensa adicional: el monto Y LA MONEDA reportados por Wompi
        //    deben coincidir exactamente con lo que nosotros calculamos y
        //    guardamos al crear el pedido (nacional=COP, internacional=USD
        //    con TRM fija). Si algo no coincide, no se aprueba el pedido.
        const { data: order, error: fetchError } = await supabaseAdmin
          .from("orders")
          .select("id, amount_in_cents, currency, status, items")
          .eq("reference", reference)
          .single();

        if (fetchError || !order) {
          console.error("[wompi-webhook] Pedido no encontrado para reference:", reference);
          return jsonResponse({ ok: true, ignored: true });
        }

        if (order.amount_in_cents !== wompiAmountInCents || order.currency !== wompiCurrency) {
          console.error(
            `[wompi-webhook] Monto/moneda no coinciden para ${reference}: esperado ${order.amount_in_cents} ${order.currency}, recibido ${wompiAmountInCents} ${wompiCurrency}.`,
          );
          return jsonResponse({ ok: true, ignored: true });
        }

        if (order.status !== "pending") {
          // Evento repetido (Wompi reintenta); ya fue procesado.
          return jsonResponse({ ok: true });
        }

        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({ status: mappedStatus, wompi_transaction_id: wompiTransactionId, updated_at: new Date().toISOString() })
          .eq("id", order.id)
          .eq("status", "pending");

        if (updateError) {
          console.error("[wompi-webhook] Error actualizando pedido:", updateError);
          return jsonResponse({ error: "Error interno." }, 500);
        }

        // 3) Si el pago NO se aprobó, devolver el stock que se había
        //    reservado al crear el pedido.
        if (mappedStatus !== "VENTA REALIZADA") {
          const items = Array.isArray(order.items) ? (order.items as Array<Record<string, unknown>>) : [];
          for (const item of items) {
            const { data: sizeRow } = await supabaseAdmin
              .from("product_sizes")
              .select("id, product_id, products!inner(slug)")
              .eq("size", String(item["size"]))
              .eq("products.slug", String(item["slug"]))
              .maybeSingle();
            if (sizeRow) {
              await supabaseAdmin.rpc("increment_stock", {
                p_size_id: sizeRow.id,
                p_qty: Number(item["qty"] ?? 0),
              });
            }
          }
        }

        return jsonResponse({ ok: true });
      },
    },
  },
});
