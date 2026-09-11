import { useEffect, useState } from "react";
import { copToUsd, formatUsd, formatCop } from "@/lib/drop-data";

const FALLBACK_TRM_GUESS = 4000;
let cached: string | null | undefined;
let inflight: Promise<string | null> | null = null;

let cachedTrm: number | undefined;
let trmInflight: Promise<number> | null = null;

function loadTrm(): Promise<number> {
  // Evita ejecutar fetch relativo en Node.js durante SSR
  if (typeof window === "undefined") return Promise.resolve(FALLBACK_TRM_GUESS);
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
  if (typeof window === "undefined") return null;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return null;
    return tz === "America/Bogota" ? "CO" : "INTL";
  } catch {
    return null;
  }
}

function loadCountry(): Promise<string | null> {
  // Evita ejecutar fetch relativo en Node.js durante SSR
  if (typeof window === "undefined") return Promise.resolve(null);
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
    format: (cop: number) => (isInternational ? formatUsd(copToUsd(cop, trm)) : formatCop(cop)),
    formatAlt: (cop: number) => (isInternational ? formatCop(cop) : formatUsd(copToUsd(cop, trm))),
  };
}