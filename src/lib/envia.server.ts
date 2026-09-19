// Cliente mínimo para la API de Envia.com. SOLO se usa para mostrarle al
// cliente un ESTIMADO de envío antes de pagar — nunca participa en el cobro
// (ver src/routes/api.checkout.ts, que no importa nada de este archivo).
// Todo lo de acá corre en el servidor: el token de Envia nunca debe llegar
// al navegador (por eso no lleva prefijo VITE_).

const ENVIA_ORIGIN_ENV = (process.env["ENVIA_ENV"] ?? "sandbox").trim().toLowerCase();
const ENVIA_BASE_URL =
  ENVIA_ORIGIN_ENV === "production" ? "https://api.envia.com" : "https://api-test.envia.com";

// Dimensiones/peso por camisa doblada. Ajustables acá si cambia el
// empaque; no afectan nada del cobro, solo el peso/volumen que se le
// declara a la transportadora para cotizar.
const PARCEL_LENGTH_CM = 30;
const PARCEL_WIDTH_CM = 25;
const PARCEL_HEIGHT_CM = 3;
const PARCEL_WEIGHT_KG_PER_UNIT = 0.3;
// Tope razonable de peso declarado, para no mandar un número absurdo si
// alguien manipula `qty` en el body del POST.
const MAX_DECLARED_WEIGHT_KG = 30;

export type EnviaRate = {
  carrier: string;
  service: string;
  priceCop: number;
  days: number | null;
};

// El formulario de checkout guarda el país de destino como nombre visible
// ("México", "Estados Unidos"...), no como código ISO2 — pero la API de
// Envia SÍ espera el código ISO2 en `destination.country`. Esta tabla
// traduce los nombres que ofrece el selector (ver DESTINATION_COUNTRIES en
// drop-data.ts); si el cliente escribió un país distinto a mano en "Otro
// país", se intenta un último recurso razonable y, si Envia no lo
// reconoce, simplemente no devuelve tarifas (getEnviaRates ya maneja ese
// caso devolviendo `null`, sin romper el checkout).
const COUNTRY_NAME_TO_ISO2: Record<string, string> = {
  "estados unidos": "US",
  mexico: "MX",
  canada: "CA",
  espana: "ES",
  argentina: "AR",
  chile: "CL",
  peru: "PE",
  ecuador: "EC",
  panama: "PA",
  "costa rica": "CR",
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function resolveCountryIso2(destinationCountry: string): string {
  const normalized = normalizeText(destinationCountry);
  return COUNTRY_NAME_TO_ISO2[normalized] ?? destinationCountry.trim().slice(0, 2).toUpperCase();
}

function getEnviaToken(): string | null {
  const token = process.env["ENVIA_API_TOKEN"]?.trim();
  return token || null;
}

function getOriginAddress(): {
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  postalCode: string;
} | null {
  const name = process.env["ENVIA_ORIGIN_NAME"]?.trim();
  const phone = process.env["ENVIA_ORIGIN_PHONE"]?.trim();
  const address = process.env["ENVIA_ORIGIN_ADDRESS"]?.trim();
  const city = process.env["ENVIA_ORIGIN_CITY"]?.trim();
  const department = process.env["ENVIA_ORIGIN_DEPARTMENT"]?.trim();
  const postalCode = process.env["ENVIA_ORIGIN_POSTAL_CODE"]?.trim();
  if (!name || !phone || !address || !city || !department || !postalCode) return null;
  return { name, phone, address, city, department, postalCode };
}

async function enviaFetch(
  path: string,
  body: unknown,
  baseUrl = ENVIA_BASE_URL,
): Promise<unknown | null> {
  const token = getEnviaToken();
  if (!token) {
    console.error("[envia] Falta ENVIA_API_TOKEN.");
    return null;
  }
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    if (!res.ok) {
      // Se loguea el cuerpo de la respuesta (no solo el status) para poder
      // diagnosticar el motivo real sin tener que adivinar — Envia casi
      // siempre manda un mensaje descriptivo en el body incluso en 4xx.
      console.error(`[envia] ${path} respondió ${res.status}: ${text.slice(0, 500)}`);
      return null;
    }
    try {
      return JSON.parse(text);
    } catch {
      console.error(`[envia] ${path} respondió un body no-JSON: ${text.slice(0, 500)}`);
      return null;
    }
  } catch (err) {
    console.error(`[envia] Error llamando a ${path}:`, err);
    return null;
  }
}

// La API de Envia exige, para el campo `state` de /locate en Colombia, su
// PROPIO código de 2 letras por departamento (ej. "AT" para Atlántico, "CN"
// para Cundinamarca) — NO el nombre del departamento ni el código numérico
// del DANE. Ese código no está publicado en su documentación pública de
// forma completa y puede variar, así que en vez de hardcodear una tabla que
// podría estar mal, se consulta en vivo contra la propia API de Envia
// (GET /state?country_code=CO) y se cachea en memoria — es un catálogo fijo,
// no cambia entre requests. ESTE era el motivo real por el que nunca se
// podía calcular ningún envío nacional: se le mandaba el nombre completo
// del departamento ("Bogotá D.C.", "Antioquia"...) donde Envia esperaba su
// código de 2 letras, así que /locate nunca encontraba coincidencia.
let colombiaStateCodeCache: Record<string, string> | null = null;

async function getColombiaStateCode(departmentName: string): Promise<string | null> {
  if (!colombiaStateCodeCache) {
    const token = getEnviaToken();
    if (!token) return null;
    try {
      const res = await fetch("https://queries.envia.com/state?country_code=CO", {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(8000),
      });
      const text = await res.text();
      if (!res.ok) {
        console.error(`[envia] /state respondió ${res.status}: ${text.slice(0, 500)}`);
        return null;
      }
      const json = JSON.parse(text) as {
        data?: Array<{ name?: string; code_2_digits?: string; country_code?: string }>;
      };
      const map: Record<string, string> = {};
      for (const row of json.data ?? []) {
        if (row.name && row.code_2_digits && (!row.country_code || row.country_code === "CO")) {
          map[normalizeText(row.name)] = row.code_2_digits;
        }
      }
      if (Object.keys(map).length === 0) {
        console.error("[envia] /state?country_code=CO no devolvió departamentos.");
        return null;
      }
      colombiaStateCodeCache = map;
    } catch (err) {
      console.error("[envia] Error obteniendo códigos de departamento:", err);
      return null;
    }
  }

  const normalized = normalizeText(departmentName);
  if (colombiaStateCodeCache[normalized]) return colombiaStateCodeCache[normalized];

  // Bogotá D.C. suele aparecer en el catálogo de Envia con variantes de
  // nombre distintas a la que ofrece nuestro selector ("Bogotá", "Bogota
  // D.C.", "Distrito Capital", etc.) — se prueba una coincidencia parcial
  // antes de rendirse.
  if (normalized.includes("bogota")) {
    const bogotaKey = Object.keys(colombiaStateCodeCache).find((k) => k.includes("bogota"));
    if (bogotaKey) return colombiaStateCodeCache[bogotaKey];
  }
  const partial = Object.keys(colombiaStateCodeCache).find(
    (k) => k.includes(normalized) || normalized.includes(k),
  );
  return partial ? colombiaStateCodeCache[partial] : null;
}

// Resuelve el código DANE (8 dígitos) que exige Envia para el campo `city`
// en destinos dentro de Colombia. Envia nunca acepta el nombre de la
// ciudad tal cual para cotizar destinos colombianos — siempre hay que
// pasar primero por /locate.
export async function locateColombiaCity(
  cityName: string,
  department: string,
): Promise<string | null> {
  const stateCode = await getColombiaStateCode(department);
  if (!stateCode) {
    console.error(`[envia] No se pudo resolver el código de departamento para "${department}".`);
    return null;
  }

  const data = (await enviaFetch("/locate", {
    country: "CO",
    state: stateCode,
    city: cityName,
  })) as
    | { data?: Array<{ code?: string; city?: string }> }
    | Array<{ code?: string; city?: string }>
    | null;

  if (!data) return null;

  const list = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
  const first = list.find((row) => typeof row?.code === "string" && /^\d{8}$/.test(row.code));
  return first?.code ?? null;
}

type RateParams = {
  destinationCountry: string;
  destinationCity: string;
  destinationState: string;
  destinationPostalCode: string;
  qty: number;
};

// Cotiza contra Envia.com para un destino nacional o internacional.
// Devuelve `null` si algo falla (token faltante, Envia caído, ciudad no
// encontrada, país no soportado) — nunca lanza, para no romper el
// checkout por un problema de envío.
export async function getEnviaRates(params: RateParams): Promise<EnviaRate[] | null> {
  const origin = getOriginAddress();
  if (!origin) {
    console.error("[envia] Falta configurar la dirección de origen (ENVIA_ORIGIN_*).");
    return null;
  }

  const isColombia = params.destinationCountry === "CO";
  const destinationCountryIso2 = isColombia ? "CO" : resolveCountryIso2(params.destinationCountry);

  let destinationCityField = params.destinationCity;
  if (isColombia) {
    const dane = await locateColombiaCity(params.destinationCity, params.destinationState);
    if (!dane) return null;
    destinationCityField = dane;
  }

  const qty = Math.max(1, Math.floor(params.qty || 1));
  const weightKg = Math.min(PARCEL_WEIGHT_KG_PER_UNIT * qty, MAX_DECLARED_WEIGHT_KG);

  const payload = {
    origin: {
      name: origin.name,
      company: origin.name,
      email: undefined,
      phone: origin.phone,
      street: origin.address,
      city: origin.city,
      state: origin.department,
      country: "CO",
      postalCode: origin.postalCode,
    },
    destination: {
      name: "Cliente",
      phone: "0000000000",
      street: "N/A",
      city: destinationCityField,
      state: params.destinationState,
      country: destinationCountryIso2,
      postalCode: params.destinationPostalCode || undefined,
    },
    packages: [
      {
        content: "Ropa",
        amount: 1,
        type: "box",
        weight: weightKg,
        insurance: 0,
        declaredValue: 0,
        weightUnit: "KG",
        lengthUnit: "CM",
        dimensions: {
          length: PARCEL_LENGTH_CM,
          width: PARCEL_WIDTH_CM,
          height: PARCEL_HEIGHT_CM,
        },
      },
    ],
    shipment: {
      carrier: undefined,
      type: 1,
    },
  };

  const data = (await enviaFetch("/ship/rate/", payload)) as {
    data?: Array<{
      carrier?: string;
      service?: string;
      carrier_description?: string;
      serviceDescription?: string;
      totalPrice?: number | string;
      total_price?: number | string;
      currency?: string;
      deliveryEstimate?: string | number;
      delivery_date?: string;
    }>;
  } | null;

  if (!data || !Array.isArray(data.data)) return null;

  const rates: EnviaRate[] = data.data
    .map((row) => {
      const priceRaw = row.totalPrice ?? row.total_price;
      const price = typeof priceRaw === "string" ? parseFloat(priceRaw) : priceRaw;
      if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) return null;

      let days: number | null = null;
      const estimate = row.deliveryEstimate;
      if (typeof estimate === "number" && Number.isFinite(estimate)) {
        days = estimate;
      } else if (typeof estimate === "string") {
        const match = estimate.match(/\d+/);
        if (match) days = parseInt(match[0], 10);
      }

      return {
        carrier: row.carrier_description || row.carrier || "Transportadora",
        service: row.serviceDescription || row.service || "Estándar",
        priceCop: Math.round(price),
        days,
      };
    })
    .filter((r): r is EnviaRate => r !== null);

  return rates.length > 0 ? rates : null;
}

export async function getDomesticShippingQuote(params: {
  city: string;
  department: string;
  qty: number;
}): Promise<{ estimateCop: number; carrier: string; service: string } | null> {
  const rates = await getEnviaRates({
    destinationCountry: "CO",
    destinationCity: params.city,
    destinationState: params.department,
    destinationPostalCode: "",
    qty: params.qty,
  });
  if (!rates) return null;

  const cheapest = rates.reduce((best, r) => (r.priceCop < best.priceCop ? r : best));
  return { estimateCop: cheapest.priceCop, carrier: cheapest.carrier, service: cheapest.service };
}

export async function getInternationalShippingQuotes(params: {
  destinationCountry: string;
  city: string;
  state: string;
  postalCode: string;
  qty: number;
}): Promise<{
  premium: { priceCop: number; carrier: string; service: string; days: number } | null;
  economica: { priceCop: number; carrier: string; service: string; days: number } | null;
}> {
  const rates = await getEnviaRates({
    destinationCountry: params.destinationCountry,
    destinationCity: params.city,
    destinationState: params.state,
    destinationPostalCode: params.postalCode,
    qty: params.qty,
  });
  if (!rates || rates.length === 0) return { premium: null, economica: null };

  // "Premium": el tiempo de entrega más rápido. Si Envia no informa días
  // para ninguna tarifa, se usa la más barata como respaldo razonable.
  const withDays = rates.filter((r) => typeof r.days === "number");
  const fastest =
    withDays.length > 0
      ? withDays.reduce((best, r) => ((r.days as number) < (best.days as number) ? r : best))
      : rates.reduce((best, r) => (r.priceCop < best.priceCop ? r : best));

  // "Económica": la más barata de todas. Puede coincidir con "premium" —
  // eso es intencional, se muestra igual como segunda tarjeta.
  const cheapest = rates.reduce((best, r) => (r.priceCop < best.priceCop ? r : best));

  return {
    premium: {
      priceCop: fastest.priceCop,
      carrier: fastest.carrier,
      service: fastest.service,
      days: fastest.days ?? 0,
    },
    economica: {
      priceCop: cheapest.priceCop,
      carrier: cheapest.carrier,
      service: cheapest.service,
      days: cheapest.days ?? 0,
    },
  };
}
