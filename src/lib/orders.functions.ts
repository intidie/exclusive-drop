import { createServerFn } from "@tanstack/react-start";
import {
  amountInCentsFor,
  integritySignature,
  newReference,
  PublicError,
  
  validateDraft,
} from "@/lib/wompi.server";
import { getProduct } from "@/lib/drop-data";

/**
 * Creates the order server-side (price resolved from the catalog, status forced to 'pending')
 * and returns the Wompi integrity signature. Secrets never leave the server.
 */
export const createWompiSignature = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => validateDraft(input))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const product = getProduct(data.productSlug)!;
      const amountInCents = amountInCentsFor(data.productSlug);
      const reference = newReference();
      const currency = "COP";

      // Explicit camelCase -> snake_case mapping. NOT NULL fields always present.
      const row = {
        reference,
        product_slug: product.slug,
        product_name: product.name,
        size: data.size,
        amount_in_cents: amountInCents,
        currency,
        status: "pending" as const,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        shipping_city: data.shippingCity,
        shipping_address: data.shippingAddress,
      };

      let orderId: string | undefined;
      let accessToken: string | undefined;

      const inserted = await supabaseAdmin
        .from("orders")
        .insert(row)
        .select("id, access_token")
        .single();

      if (inserted.error) {
        // Schemas without access_token: retry with the minimal projection.
        const retry = await supabaseAdmin.from("orders").insert(row).select("id").single();
        if (retry.error || !retry.data) throw new Error(retry.error?.message ?? "insert failed");
        orderId = retry.data.id as string;
      } else {
        orderId = inserted.data.id as string;
        accessToken = inserted.data.access_token as string;
      }

      // La firma de integridad solo se genera si el secreto está configurado.
      const integritySecret = process.env["WOMPI_INTEGRITY_SECRET"];
      const signature = integritySecret
        ? await integritySignature(reference, amountInCents, currency, integritySecret)
        : null;

      return {
        orderId,
        accessToken: accessToken ?? reference,
        reference,
        amountInCents,
        currency,
        signature,
        publicKey: process.env["WOMPI_PUBLIC_KEY"] ?? "",
      };

    } catch (err) {
      if (err instanceof PublicError) throw err;
      console.error("createWompiSignature", err);
      throw new Error("No pudimos iniciar el pago. Intenta de nuevo.");
    }
  });

/** Status polling for guests: requires the unguessable access token of the order. */
export const getOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const i = (input ?? {}) as Record<string, unknown>;
    const orderId = typeof i["orderId"] === "string" ? i["orderId"] : "";
    const accessToken = typeof i["accessToken"] === "string" ? i["accessToken"] : "";
    const uuid = /^[0-9a-f-]{36}$/i;
    if (!uuid.test(orderId) || accessToken.length < 8) throw new PublicError("Solicitud inválida.");
    return { orderId, accessToken };
  })
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("status, reference, access_token")
        .eq("id", data.orderId)
        .maybeSingle();

      const secret = (order as { access_token?: string } | null)?.access_token ?? order?.reference;
      if (!order || secret !== data.accessToken) throw new PublicError("Pedido no encontrado.");
      return { status: order.status as string, reference: order.reference as string };

    } catch (err) {
      if (err instanceof PublicError) throw err;
      console.error("getOrderStatus", err);
      throw new Error("No pudimos consultar tu pedido.");
    }
  });
