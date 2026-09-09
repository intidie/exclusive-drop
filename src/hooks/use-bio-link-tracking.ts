import { useEffect } from "react";

// Parámetros cortos que puede usar el link de la bio de Instagram (o de
// cualquier otro lugar) para identificar el origen de la visita SIN que la
// URL se vea larga. Ejemplos de link para la bio:
//   https://www.inti-net.com/?ig=1
//   https://www.inti-net.com/?ig
// También se reconoce utm_source=instagram por si en algún momento se usa
// un link con UTM completos (ej. desde un anuncio).
const SHORT_SOURCE_PARAMS: Record<string, string> = {
  ig: "instagram_bio",
  instagram: "instagram_bio",
};

function detectSource(params: URLSearchParams): string | null {
  for (const [key, source] of Object.entries(SHORT_SOURCE_PARAMS)) {
    if (params.has(key)) return source;
  }
  const utmSource = params.get("utm_source")?.toLowerCase();
  if (utmSource === "instagram" || utmSource === "ig") return "instagram_bio";
  return null;
}

// Hook de una sola vía: si la URL trae un parámetro que identifica que se
// entró por el link de la bio de Instagram (u otro origen corto conocido),
// 1) registra la visita en /api/track-visit (fire-and-forget, nunca bloquea
//    ni rompe la navegación si falla), y
// 2) limpia la barra de direcciones para que solo quede
//    "www.inti-net.com" (o la ruta actual), sin el parámetro de tracking.
// Si la URL no trae ninguno de esos parámetros, el hook no hace nada — no
// toca la URL de nadie que entre directo o por otro medio.
export function useBioLinkTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const source = detectSource(params);
    if (!source) return;

    const payload = {
      source,
      path: window.location.pathname,
      referrer: document.referrer || null,
    };

    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Si falla el registro (offline, bloqueado, etc.) igual limpiamos la
      // URL más abajo — no vale la pena mostrarle al visitante un parámetro
      // de tracking roto solo porque la analítica no se pudo guardar.
    });

    // Deja la barra de direcciones limpia: solo dominio + ruta (+ hash si
    // había alguno), sin ningún query param. No usa router.navigate para no
    // disparar una recarga de datos ni añadir una entrada al historial.
    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
  }, []);
}
