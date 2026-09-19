import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { MEXICO_ULTRA_ECONOMICA_SHIPPING, isMexicoDestination } from "@/lib/drop-data";

const VALID_SIZES = ["S", "M", "L", "XL", "XXL"];
const VALID_COUNTRIES = ["CO", "INTL"] as const;
type CountryCode = (typeof VALID_COUNTRIES)[number];
const VALID_DOC_TYPES = ["CC", "NIT", "CE", "PASAPORTE", "OTRO"] as const;
// Opciones de envío que el checkout puede registrar en `orders.shipping_method`.
// - domestic / domestic_unquoted: nacional (con o sin cotización de Envia).
// - intl_express / intl_economica: cotizadas con Envia, solo informativas.
// - intl_ultra_mx: 4-72, SOLO México, ÚNICA que se suma al cobro de Wompi.
// - intl_unquoted: internacional sin cotización disponible (Envia caído).
const VALID_SHIPPING_METHODS = [
  "domestic",
  "domestic_unquoted",
  "intl_express",
  "intl_economica",
  "intl_ultra_mx",
  "intl_unquoted",
] as const;
type ShippingMethod = (typeof VALID_SHIPPING_METHODS)[number];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitize(value: unknown, maxLength: number): string {
  return String(value ?? "").trim().slice(0, maxLength);
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Verifica el token de Cloudflare Turnstile contra el endpoint oficial.
// SIEMPRE del lado del servidor — el widget del frontend por sí solo no
// bloquea nada, cualquiera podría llamar a este endpoint directo sin pasar
// por el navegador. El secret NUNCA debe exponerse al cliente (no usar
// prefijo VITE_).
async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  const secret = process.env["TURNSTILE_SECRET_KEY"]?.trim();
  if (!secret) {
    console.error("[checkout] Falta TURNSTILE_SECRET_KEY.");
    return false;
  }
  if (!token) return false;

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (remoteIp) form.set("remoteip", remoteIp);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const data = (await res.json()) as { success?: boolean; ["error-codes"]?: string[] };
    if (!data.success) {
      console.warn("[checkout] Turnstile rechazado:", data["error-codes"]);
    }
    return data.success === true;
  } catch (err) {
    console.error("[checkout] Error verificando Turnstile:", err);
    return false;
  }
}

type CartLine = { slug: string; size: string; qty: number };

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ error: "JSON inválido." }, 400);
        }

        const rawItems = Array.isArray(body["items"]) ? (body["items"] as unknown[]) : [];
        const cart: CartLine[] = rawItems
          .map((it) => {
            const o = it as Record<string, unknown>;
            const qty = Math.floor(Number(o["qty"] ?? 1));
            return {
              slug: sanitize(o["slug"], 60),
              size: sanitize(o["size"], 10).toUpperCase(),
              qty: Number.isFinite(qty) && qty > 0 ? Math.min(qty, 10) : 1,
            };
          })
          .filter((it) => it.slug && VALID_SIZES.includes(it.size));

        // Verificación anti-bot: PRIMERO Turnstile, antes de leer Supabase o
        // reservar stock. Así una petición automatizada sin token válido se
        // rechaza de inmediato, sin gastar ni una sola consulta a la base de
        // datos ni a Wompi.
        const turnstileToken = sanitize(body["turnstileToken"], 2000);
        const remoteIp =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          null;
        const turnstileOk = await verifyTurnstile(turnstileToken, remoteIp);
        if (!turnstileOk) {
          return jsonResponse(
            { error: "No pudimos verificar que eres una persona real. Intenta de nuevo." },
            403,
          );
        }

        const name = sanitize(body["name"], 80);
        const phone = sanitize(body["phone"], 30);
        const email = sanitize(body["email"], 120);
        const city = sanitize(body["city"], 60);
        const address = sanitize(body["address"], 200);

        // --- Campos obligatorios SOLO para pedidos nacionales (country=CO) ---
        const docType = sanitize(body["docType"], 15).toUpperCase();
        const docNumber = sanitize(body["docNumber"], 40);
        const department = sanitize(body["department"], 60);

        // --- Campos obligatorios SOLO para pedidos internacionales (country=INTL) ---
        const idNumber = sanitize(body["idNumber"], 40); // documento fiscal / DNI / pasaporte
        const postalCode = sanitize(body["postalCode"], 20);
        const state = sanitize(body["state"], 60);
        const destinationCountry = sanitize(body["destinationCountry"], 60);

        // --- Opción de envío elegida por el cliente (informativa, salvo
        // "intl_ultra_mx" — ver más abajo). `shippingCarrier`,
        // `shippingService` y `shippingEstimateCop` solo se guardan como
        // registro de lo que el cliente vio; NUNCA se usan para calcular
        // el monto que se cobra, excepto el recargo fijo de México que
        // calcula el propio servidor (MEXICO_ULTRA_ECONOMICA_SHIPMENT),
        // nunca el valor que mande el cliente. ---
        const rawShippingMethod = sanitize(body["shippingMethod"], 20);
        const shippingMethod: ShippingMethod | null = VALID_SHIPPING_METHODS.includes(
          rawShippingMethod as ShippingMethod,
        )
          ? (rawShippingMethod as ShippingMethod)
          : null;
        let shippingCarrier = sanitize(body["shippingCarrier"], 80);
        let shippingService = sanitize(body["shippingService"], 80);
        const rawShippingEstimateCop = Number(body["shippingEstimateCop"]);
        let shippingEstimateCop: number | null =
          body["shippingEstimateCop"] != null &&
          Number.isFinite(rawShippingEstimateCop) &&
          rawShippingEstimateCop >= 0
            ? Math.round(Math.min(rawShippingEstimateCop, 5_000_000))
            : null;
        // El cliente debe haber marcado la casilla de confirmación del envío
        // (el botón de Wompi ya está deshabilitado sin ella, pero acá se
        // exige del lado del servidor por si alguien llama al endpoint
        // directo).
        const shippingConfirmed = body["shippingConfirmed"] === true;

        // Único dato de "categoría de envío" que decide el cliente: solo hay
        // dos casos válidos, nacional o internacional. Esto NO cambia la
        // moneda ni permite manipular el monto — ambos casos se cobran en
        // COP, calculado 100% por el servidor más abajo. No hay valor por
        // defecto silencioso: si no llega "CO" o "INTL" exactos, se rechaza
        // la solicitud completa.
        const rawCountry = sanitize(body["country"], 10).toUpperCase();
        if (!VALID_COUNTRIES.includes(rawCountry as CountryCode)) {
          return jsonResponse(
            { error: "Selecciona si tu compra es nacional (Colombia) o internacional." },
            400,
          );
        }
        const country = rawCountry as CountryCode;
        const isNational = country === "CO";

        if (cart.length === 0) {
          return jsonResponse({ error: "El carrito está vacío o es inválido." }, 400);
        }
        if (!name || !phone || !city || !address) {
          return jsonResponse({ error: "Faltan datos de envío." }, 400);
        }

        // Cada categoría tiene su propio conjunto de campos obligatorios,
        // exactamente los que pide el negocio — sin excepciones.
        if (isNational) {
          if (!VALID_DOC_TYPES.includes(docType as (typeof VALID_DOC_TYPES)[number]) || !docNumber || !department) {
            return jsonResponse(
              {
                error:
                  "Para compras nacionales faltan datos: tipo/número de documento de identidad o departamento.",
              },
              400,
            );
          }
          if (shippingMethod !== "domestic" && shippingMethod !== "domestic_unquoted") {
            return jsonResponse({ error: "Confirma la información de envío nacional." }, 400);
          }
        } else {
          if (!idNumber || !email || !postalCode || !state || !destinationCountry) {
            return jsonResponse(
              {
                error:
                  "Para compras internacionales faltan datos: documento de identificación, correo, código postal, estado/provincia o país de destino.",
              },
              400,
            );
          }
          // El checkbox de confirmación en el formulario ya obliga a elegir
          // una de las tres tarjetas antes de poder pagar — esta es la
          // misma validación, del lado del servidor, por si alguien llama
          // a este endpoint directo sin pasar por el formulario.
          const validIntlMethods: ShippingMethod[] = [
            "intl_express",
            "intl_economica",
            "intl_ultra_mx",
            "intl_unquoted",
          ];
          if (!shippingMethod || !validIntlMethods.includes(shippingMethod)) {
            return jsonResponse({ error: "Selecciona una opción de envío." }, 400);
          }
          // "intl_ultra_mx" (4-72) es EXCLUSIVA de México — es la única
          // opción de envío que se suma al cobro de Wompi. Si el destino
          // no es México, se rechaza para que el monto cobrado nunca
          // dependa de lo que el cliente mande, solo de lo que el
          // servidor puede verificar.
          if (shippingMethod === "intl_ultra_mx" && !isMexicoDestination(destinationCountry)) {
            return jsonResponse(
              {
                error:
                  "La opción de envío ultra-económica (4-72) solo está disponible para destinos en México.",
              },
              400,
            );
          }
        }

        if (!shippingConfirmed) {
          return jsonResponse(
            { error: "Debes confirmar que leíste la información del envío antes de pagar." },
            400,
          );
        }

        // Para la única opción que sí se cobra (México 4-72), el registro de
        // transportadora/servicio/valor lo fija el servidor, no el cliente.
        if (shippingMethod === "intl_ultra_mx") {
          shippingCarrier = MEXICO_ULTRA_ECONOMICA_SHIPPING.carrier;
          shippingService = "Ultra-económica";
          shippingEstimateCop = MEXICO_ULTRA_ECONOMICA_SHIPPING.surchargeCop;
        }
        // Sin cotización no hay valor que registrar.
        if (shippingMethod === "domestic_unquoted" || shippingMethod === "intl_unquoted") {
          shippingCarrier = "";
          shippingService = "";
          shippingEstimateCop = null;
        }

        // Credenciales de Wompi: una sola cuenta, una sola moneda (COP) para
        // todos los pedidos, nacionales e internacionales.
        const integritySecret = process.env["WOMPI_INTEGRITY_SECRET"]?.trim();
        const publicKey = (process.env["VITE_WOMPI_PUBLIC_KEY"] ?? process.env["WOMPI_PUBLIC_KEY"])?.trim();
        if (!integritySecret || !publicKey) {
          console.error("[checkout] Faltan credenciales de Wompi.");
          return jsonResponse({ error: "El pago no está disponible en este momento." }, 500);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Traer precio y stock REALES desde Supabase — nunca del cliente.
        const slugs = [...new Set(cart.map((c) => c.slug))];
        const { data: products, error: prodError } = await supabaseAdmin
          .from("products")
          .select("id, slug, name, price_cop, active")
          .in("slug", slugs)
          .eq("active", true);

        if (prodError || !products || products.length === 0) {
          return jsonResponse({ error: "Uno o más productos no existen." }, 400);
        }

        const { data: sizeRows, error: sizeError } = await supabaseAdmin
          .from("product_sizes")
          .select("id, product_id, size, stock, extra_price_cop")
          .in(
            "product_id",
            products.map((p) => p.id),
          );

        if (sizeError || !sizeRows) {
          return jsonResponse({ error: "No pudimos validar el inventario." }, 500);
        }

        type Line = {
          slug: string;
          name: string;
          size: string;
          qty: number;
          unitPriceCop: number;
          sizeRowId: string;
        };
        const lines: Line[] = [];

        for (const item of cart) {
          const product = products.find((p) => p.slug === item.slug);
          if (!product) {
            return jsonResponse({ error: `Producto inválido: ${item.slug}` }, 400);
          }
          const sizeRow = sizeRows.find((s) => s.product_id === product.id && s.size === item.size);
          if (!sizeRow) {
            return jsonResponse({ error: `Talla inválida para ${item.slug}.` }, 400);
          }
          if (sizeRow.stock < item.qty) {
            return jsonResponse(
              { error: `Sin stock suficiente de ${product.name} talla ${item.size}.` },
              409,
            );
          }
          lines.push({
            slug: product.slug,
            name: product.name,
            size: item.size,
            qty: item.qty,
            unitPriceCop: product.price_cop + sizeRow.extra_price_cop,
            sizeRowId: sizeRow.id,
          });
        }

        // El envío NO se cobra por este sistema en ningún caso, CON UNA
        // SOLA EXCEPCIÓN: el envío ultra-económico internacional (4-72)
        // cuando el destino es México — ese sí se suma, con un valor FIJO
        // que decide el servidor (MEXICO_ULTRA_ECONOMICA_SHIPPING), nunca
        // el que mande el cliente. Todo lo demás (nacional, premium,
        // económica, ultra-económica fuera de México) sigue siendo
        // puramente informativo. El subtotal de productos SIEMPRE nace en
        // COP desde `products.price_cop` / `product_sizes.extra_price_cop`
        // en Supabase — el cliente jamás envía ni puede alterar un precio.
        const subtotalCop = lines.reduce((sum, l) => sum + l.unitPriceCop * l.qty, 0);
        const shippingExtraCop =
          !isNational && shippingMethod === "intl_ultra_mx" && isMexicoDestination(destinationCountry)
            ? MEXICO_ULTRA_ECONOMICA_SHIPPING.surchargeCop
            : 0;
        const totalCop = subtotalCop + shippingExtraCop;
        const currency = "COP" as const;
        const amountInCents = totalCop * 100;

        // Solo informativo: registra qué estimado en USD vio el cliente al
        // pagar (con la TRM real de mercado del momento), para tener
        // trazabilidad histórica. No afecta el monto cobrado.
        const fxRateUsed = isNational
          ? null
          : (await (await import("@/lib/fx.server")).getUsdCopRate()).rate;

        // Reservar stock de forma atómica (evita sobreventa por condición de
        // carrera): solo descuenta si todavía hay suficiente stock.
        for (const line of lines) {
          const { data: updated, error: stockError } = await supabaseAdmin.rpc(
            "decrement_stock_if_available",
            { p_size_id: line.sizeRowId, p_qty: line.qty },
          );
          if (stockError || updated !== true) {
            const idx = lines.indexOf(line);
            for (const done of lines.slice(0, idx)) {
              await supabaseAdmin.rpc("increment_stock", {
                p_size_id: done.sizeRowId,
                p_qty: done.qty,
              });
            }
            return jsonResponse({ error: `Se agotó el stock de ${line.name} talla ${line.size}.` }, 409);
          }
        }

        const reference = crypto.randomUUID();
        const itemsSnapshot = lines.map((l) => ({
          slug: l.slug,
          name: l.name,
          size: l.size,
          qty: l.qty,
          unit_price_cop: l.unitPriceCop,
          line_total_cop: l.unitPriceCop * l.qty,
        }));

        const { data: order, error: dbError } = await supabaseAdmin
          .from("orders")
          .insert({
            reference,
            items: itemsSnapshot,
            subtotal_cop: subtotalCop,
            amount_in_cents: amountInCents,
            currency,
            country,
            fx_rate_used: fxRateUsed,
            status: "pending",
            customer_name: name,
            customer_phone: phone,
            customer_email: email || null,
            shipping_city: city,
            shipping_address: address,
            // Opción de envío elegida (ver validación arriba). shipping_cop
            // es el ÚNICO monto de envío que de verdad se sumó al cobro de
            // Wompi (siempre 0 salvo intl_ultra_mx); shipping_estimate_cop
            // es solo lo que el cliente vio en pantalla, sin efecto en el
            // cobro.
            shipping_method: shippingMethod,
            shipping_carrier: shippingCarrier || null,
            shipping_service: shippingService || null,
            shipping_estimate_cop: shippingEstimateCop,
            shipping_cop: shippingExtraCop,
            shipping_confirmed_at: new Date().toISOString(),
            // Nacional: documento de identidad + departamento.
            doc_type: isNational ? docType : null,
            doc_number: isNational ? docNumber : null,
            shipping_department: isNational ? department : null,
            // Internacional: documento/pasaporte + dirección internacional.
            id_number: isNational ? null : idNumber,
            postal_code: isNational ? null : postalCode,
            state: isNational ? null : state,
            destination_country: isNational ? null : destinationCountry,
          })
          .select("id, reference")
          .single();

        if (dbError || !order) {
          console.error("[checkout] Error creando el pedido:", dbError);
          for (const line of lines) {
            await supabaseAdmin.rpc("increment_stock", { p_size_id: line.sizeRowId, p_qty: line.qty });
          }
          return jsonResponse({ error: "No pudimos registrar tu pedido." }, 500);
        }

        const signature = await sha256Hex(
          `${reference}${amountInCents}${currency}${integritySecret}`,
        );

        return jsonResponse({
          reference,
          amountInCents,
          currency,
          country,
          publicKey,
          signature,
          subtotal: subtotalCop,
          shippingExtraCop,
          total: totalCop,
          fxRateUsed,
        });
      },
    },
  },
});
