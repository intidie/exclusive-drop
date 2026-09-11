import { useEffect, useState } from "react";
import { copToUsd, formatUsd, formatCop } from "@/lib/drop-data";

// Detección de país SOLO para presentación de precios (no afecta el cobro:
// el monto real siempre lo calcula el servidor en src/routes/api.checkout.ts).
// 1) Cabecera de IP que agrega el hosting (/api/geo).
// 2) Si no hay cabecera, se estima por zona horaria del navegador.
let cached: string | null | undefined;
let inflight: Promise<string | null> | null = null;

// TRM real (USD -> COP) para convertir el precio a mostrar. Se pide una
// sola vez por carga de página y se comparte entre todos los componentes
// que usan este hook (ver src/lib/fx.server.ts / src/routes/api.fx.ts).
// Mientras no responda, se usa FALLBACK_TRM_GUESS solo para que la
// pantalla no muestre $0 — nunca se usa para cobrar nada.
const FALLBACK_TRM_GUESS = 4000;
let cachedTrm: number | undefined;
let trmInflight: Promise<number> | null = null;

function loadTrm(): Promise<number> {
  if (cachedTrm !== undefined) return Promise.resolve(cachedTrm);
  if (!trmInflight) {
    trmInflight = fetch("/api/fx")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { rate?: number } | null) => {
        const rate = typeof d?.rate === "number" && d.rate > 0 ? d.rate : FALLBACK_TRM_GUESS;
        cachedTrm = rate;
        return rate;
      })
      .catch(() => {
        cachedTrm = FALLBACK_TRM_GUESS;
        return FALLBACK_TRM_GUESS;
      });
  }
  return trmInflight;
}

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
  const [trm, setTrm] = useState<number>(cachedTrm ?? FALLBACK_TRM_GUESS);

  useEffect(() => {
    let alive = true;
    loadCountry().then((c) => {
      if (alive) setCountry(c);
    });
    loadTrm().then((rate) => {
      if (alive) setTrm(rate);
    });
    return () => {
      alive = false;
    };
  }, []);

  const isInternational = country != null && country !== "CO";

  return {
    country,
    isInternational,
    trm,
    /** Precio principal a mostrar según el país detectado. */
    format: (cop: number) => (isInternational ? formatUsd(copToUsd(cop, trm)) : formatCop(cop)),
    /** Equivalencia secundaria (la otra moneda). */
    formatAlt: (cop: number) => (isInternational ? formatCop(cop) : formatUsd(copToUsd(cop, trm))),
  };
}

