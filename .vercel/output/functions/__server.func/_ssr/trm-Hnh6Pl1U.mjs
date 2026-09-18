//#region node_modules/.nitro/vite/services/ssr/assets/trm-Hnh6Pl1U.js
var TRM_API_URL = "https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=1";
var FALLBACK_TRM = 3900;
var CACHE_MS = 216e5;
var cache = null;
async function getTrm() {
	if (cache && Date.now() - cache.fetchedAt < CACHE_MS) return {
		trm: cache.value,
		source: "oficial"
	};
	try {
		const res = await fetch(TRM_API_URL, { signal: AbortSignal.timeout(5e3) });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const raw = (await res.json())[0]?.valor;
		const value = raw ? Number(raw) : NaN;
		if (!Number.isFinite(value) || value <= 0) throw new Error(`Valor TRM inválido: ${raw}`);
		cache = {
			value,
			fetchedAt: Date.now()
		};
		return {
			trm: value,
			source: "oficial"
		};
	} catch (err) {
		console.error("[trm] No se pudo obtener la TRM oficial, se usa respaldo:", err);
		return {
			trm: cache?.value ?? FALLBACK_TRM,
			source: "respaldo"
		};
	}
}
//#endregion
export { getTrm };
