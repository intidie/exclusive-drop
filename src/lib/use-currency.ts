import { useEffect, useState } from "react";
import { USD_TRM, copToUsd, formatUsd, formatCop } from "@/lib/drop-data";

// Detección de país SOLO para presentación de precios (no afecta el cobro:
// el monto real siempre lo calcula el servidor en src/routes/api.checkout.ts).
// 1) Cabecera de IP que agrega el hosting (/api/geo).
// 2) Si no hay cabecera, se estima por zona horaria del navegador.
let cached: string | null | undefined;
let inflight: Promise<string | null> | null = null;

function guessFromTimeZone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return null;
    return tz === "America/Bogota" ? "CO" : "INTL";
  } catch {
    return null;
  }
}

function loadCountry(): Promise<string | null> {
  if (cached !== undefined) return Promise.resolve(cached ?? null);
  if (!inflight) {
    inflight = fetch("/api/geo")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { country?: string | null } | null) => d?.country ?? null)
      .catch(() => null)
      .then((c) => {
        cached = c ?? guessFromTimeZone();
        return cached ?? null;
      });
  }
  return inflight;
}

export function useDisplayCurrency() {
  const [country, setCountry] = useState<string | null>(cached ?? null);

  useEffect(() => {
    let alive = true;
    loadCountry().then((c) => {
      if (alive) setCountry(c);
    });
    return () => {
      alive = false;
    };
  }, []);

  const isInternational = country != null && country !== "CO";

  return {
    country,
    isInternational,
    trm: USD_TRM,
    /** Precio principal a mostrar según el país detectado. */
    format: (cop: number) => (isInternational ? formatUsd(copToUsd(cop)) : formatCop(cop)),
    /** Equivalencia secundaria (la otra moneda). */
    formatAlt: (cop: number) => (isInternational ? formatCop(cop) : formatUsd(copToUsd(cop))),
  };
}
