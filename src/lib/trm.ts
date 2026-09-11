// TRM oficial (Tasa Representativa del Mercado) publicada a diario por el
// Banco de la República, expuesta como dato abierto del Estado colombiano.
// Fuente: https://www.datos.gov.co/resource/32sa-8pi3.json
//
// Se usa SOLO para mostrarle al cliente internacional un estimado en
// dólares y para guardar un registro (`orders.fx_rate_used`). El monto que
// realmente cobra Wompi es siempre el precio en COP de `products.price_cop`
// (ver src/routes/api.checkout.ts) — la TRM nunca afecta el monto cobrado.
const TRM_API_URL = "https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=1";

// Respaldo si la API oficial no responde (caída, timeout, formato
// inesperado). Es un valor de emergencia, no la fuente de verdad — se puede
// actualizar de vez en cuando a mano, pero no pasa nada si queda algo
// desactualizado porque solo se usa cuando la API real falla.
const FALLBACK_TRM = 3900;

// Cuánto tiempo se reutiliza el último valor obtenido antes de volver a
// consultar la API. El Banco de la República publica un solo valor por día
// hábil, así que 6 horas es más que suficiente y evita golpear la API en
// cada pago.
const CACHE_MS = 6 * 60 * 60 * 1000;

let cache: { value: number; fetchedAt: number } | null = null;

export async function getTrm(): Promise<{ trm: number; source: "oficial" | "respaldo" }> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_MS) {
    return { trm: cache.value, source: "oficial" };
  }

  try {
    const res = await fetch(TRM_API_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Array<{ valor?: string }>;
    const raw = data[0]?.valor;
    const value = raw ? Number(raw) : NaN;
    if (!Number.isFinite(value) || value <= 0) throw new Error(`Valor TRM inválido: ${raw}`);

    cache = { value, fetchedAt: Date.now() };
    return { trm: value, source: "oficial" };
  } catch (err) {
    console.error("[trm] No se pudo obtener la TRM oficial, se usa respaldo:", err);
    // Si hay un valor viejo en caché, mejor reusarlo que el respaldo fijo.
    return { trm: cache?.value ?? FALLBACK_TRM, source: "respaldo" };
  }
}
