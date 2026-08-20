import { createFileRoute } from "@tanstack/react-router";
import { eventChecksum } from "@/lib/wompi.server";

type WompiEvent = {
  event?: string;
  timestamp?: number;
  signature?: { properties?: string[]; checksum?: string };
  data?: { transaction?: Record<string, unknown> };
};

const pick = (obj: unknown, path: string): string => {
  let cur: unknown = obj;
  for (const key of path.split(".")) {
    if (cur == null || typeof cur !== "object") return "";
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur == null ? "" : String(cur);
};

const STATUS_MAP: Record<string, "approved" | "declined" | "error" | "pending"> = {
  APPROVED: "approved",
  DECLINED: "declined",
  VOIDED: "declined",
  ERROR: "error",
  PENDING: "pending",
};

export const Route = createFileRoute("/api/public/wompi-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const raw = await request.text();
          if (raw.length > 20000) return new Response("Bad request", { status: 400 });

          const body = JSON.parse(raw) as WompiEvent;
          const secret = process.env["WOMPI_EVENTS_SECRET"];
          const props = body.signature?.properties;
          const checksum = body.signature?.checksum;

          if (!secret || !Array.isArray(props) || !checksum || !body.timestamp) {
            return new Response("Unauthorized", { status: 401 });
          }

          const values = props.map((p) => pick(body.data, p));
          const expected = await eventChecksum(values, body.timestamp, secret);
          if (expected.toLowerCase() !== checksum.toLowerCase()) {
            return new Response("Unauthorized", { status: 401 });
          }

          if (body.event !== "transaction.updated") return new Response("ok");

          const tx = body.data?.transaction ?? {};
          const reference = typeof tx["reference"] === "string" ? tx["reference"] : "";
          const wompiStatus = typeof tx["status"] === "string" ? tx["status"] : "";
          const txId = typeof tx["id"] === "string" ? tx["id"] : null;
          const amount = Number(tx["amount_in_cents"] ?? 0);
          const status = STATUS_MAP[wompiStatus];
          if (!reference || !status) return new Response("ok");

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("id, amount_in_cents, status")
            .eq("wompi_reference", reference)
            .maybeSingle();

          if (!order) return new Response("ok");

          // Anti-fraud: the paid amount must match the amount stored at order creation.
          const finalStatus =
            status === "approved" && Number(order.amount_in_cents) !== amount ? "error" : status;

          if (order.status !== "approved") {
            await supabaseAdmin
              .from("orders")
              .update({ status: finalStatus, wompi_transaction_id: txId })
              .eq("id", order.id);
          }

          return new Response("ok");
        } catch (err) {
          console.error("wompi-webhook", err);
          return new Response("Server error", { status: 500 });
        }
      },
    },
  },
});
