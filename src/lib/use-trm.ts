import { useEffect, useState } from "react";

// Valor de arranque SOLO para el primer render, mientras /api/trm responde
// (ver src/lib/trm.ts para la fuente real: Banco de la República). Nunca
// se usa para cobrar nada, solo para que la pantalla no aparezca en $0
// mientras carga.
const INITIAL_TRM_GUESS = 3900;

export function useTrm(): number {
  const [trm, setTrm] = useState(INITIAL_TRM_GUESS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/trm")
      .then((r) => r.json())
      .then((data: { trm?: number }) => {
        if (!cancelled && typeof data.trm === "number" && data.trm > 0) {
          setTrm(data.trm);
        }
      })
      .catch(() => {
        // Se queda con INITIAL_TRM_GUESS; no es crítico, es solo un
        // estimado visual antes de pagar.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return trm;
}
