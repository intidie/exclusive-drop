// Tasa de cambio USD -> COP real (de mercado), con caché en memoria y
// respaldo si el proveedor falla. Se usa solo como referencia informativa:
// el cobro real siempre se hace en pesos colombianos.
const FALLBACK_TRM = 4000;
const TTL_MS = 6 * 60 * 60 * 1000;

let cache: { rate: number; at: number } | null = null;

export async function getUsdCopRate(): Promise<{ rate: number; live: boolean }> {
  if (cache && Date.now() - cache.at < TTL_MS) return { rate: cache.rate, live: true };
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = (await res.json()) as { rates?: Record<string, number> };
      const cop = data.rates?.["COP"];
      if (typeof cop === "number" && cop > 500 && cop < 20000) {
        cache = { rate: Math.round(cop), at: Date.now() };
        return { rate: cache.rate, live: true };
      }
    }
  } catch {
    // sin conexión con el proveedor: se usa el respaldo
  }
  return { rate: cache?.rate ?? FALLBACK_TRM, live: cache != null };
}
