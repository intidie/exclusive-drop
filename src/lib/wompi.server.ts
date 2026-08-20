/**
 * Server-only Wompi helpers.
 * Never import this file from client code (blocked by the `.server.ts` boundary).
 */
import { PRICE, getProduct, SIZES } from "@/lib/drop-data";

export type OrderDraft = {
  productSlug: string;
  size: string;
  customerName: string;
  customerPhone: string;
  shippingCity: string;
  shippingAddress: string;
};

/** Generic error surfaced to the client. Never leaks server internals. */
export class PublicError extends Error {}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Strict server-side validation. The client is never trusted. */
export function validateDraft(input: unknown): OrderDraft {
  const i = (input ?? {}) as Record<string, unknown>;
  const productSlug = clean(i["productSlug"], 60);
  const size = clean(i["size"], 5).toUpperCase();
  const customerName = clean(i["customerName"], 80);
  const customerPhone = clean(i["customerPhone"], 25);
  const shippingCity = clean(i["shippingCity"], 60);
  const shippingAddress = clean(i["shippingAddress"], 160);

  if (!getProduct(productSlug)) throw new PublicError("Producto no válido.");
  if (!SIZES.includes(size)) throw new PublicError("Talla no válida.");
  if (customerName.length < 3) throw new PublicError("Nombre no válido.");
  if (!/^[0-9+\s-]{7,25}$/.test(customerPhone)) throw new PublicError("Teléfono no válido.");
  if (shippingCity.length < 2) throw new PublicError("Ciudad no válida.");
  if (shippingAddress.length < 5) throw new PublicError("Dirección no válida.");

  return { productSlug, size, customerName, customerPhone, shippingCity, shippingAddress };
}

/** Price is ALWAYS resolved server-side from the catalog, never from the request. */
export function amountInCentsFor(productSlug: string): number {
  const product = getProduct(productSlug);
  if (!product) throw new PublicError("Producto no válido.");
  return PRICE * 100;
}

export function newReference(): string {
  return `INTIT-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`.toUpperCase();
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Wompi integrity signature: SHA-256(reference + amountInCents + currency + secret) */
export function integritySignature(
  reference: string,
  amountInCents: number,
  currency: string,
  secret: string,
): Promise<string> {
  return sha256Hex(`${reference}${amountInCents}${currency}${secret}`);
}

/** Wompi event checksum: SHA-256(concat(properties values) + timestamp + eventsSecret) */
export function eventChecksum(
  values: string[],
  timestamp: number | string,
  secret: string,
): Promise<string> {
  return sha256Hex(`${values.join("")}${timestamp}${secret}`);
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new PublicError("Servicio de pagos no disponible.");
  return value;
}
