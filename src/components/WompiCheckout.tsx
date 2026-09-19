import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  COLOMBIA_DEPARTMENTS,
  CONTACT,
  DESTINATION_COUNTRIES,
  DOC_TYPES,
  FREE_SHIPPING_THRESHOLD_COP,
  MEXICO_ULTRA_ECONOMICA_SHIPPING,
  PRICE,
  PRODUCTS,
  XXL_SURCHARGE_COP,
  copToUsd,
  formatCop,
  formatUsd,
  isMexicoDestination,
  type CountryCode,
} from "@/lib/drop-data";
import type { CartItem } from "@/lib/cart-context";
import { WompiVerifiedBadge } from "@/components/TrustBadges";

type Props = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
};

type Phase = "form" | "sent";

declare global {
  interface Window {
    WidgetCheckout?: new (opts: Record<string, unknown>) => {
      open: (cb: (r: unknown) => void) => void;
    };
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

function loadWidget(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.WidgetCheckout) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.wompi.co/widget.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("No pudimos cargar el checkout de Wompi."));
    document.head.appendChild(s);
  });
}

function loadTurnstile(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("No pudimos cargar la verificación anti-bots."));
    document.head.appendChild(s);
  });
}

// Borrador del formulario guardado SOLO en este dispositivo (localStorage),
// nunca en el servidor. Así, si el formulario se cierra por accidente, no
// hay que volver a escribir todo.
const DRAFT_KEY = "inti-checkout-draft-v1";
type Draft = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  // "" significa que el usuario todavía no ha elegido: no asumimos un país
  // por defecto a mano, porque de eso depende qué datos de envío se piden.
  // (Sí se preselecciona automáticamente por IP — ver el efecto de
  // geolocalización más abajo — pero eso cuenta como "elegido" igual, y el
  // usuario puede cambiarlo cuando quiera.)
  country: CountryCode | "";
  // Obligatorios SOLO para pedidos nacionales (country === "CO").
  docType: "" | "CC" | "NIT" | "CE" | "PASAPORTE" | "OTRO";
  docNumber: string;
  department: string;
  // Obligatorios SOLO para pedidos internacionales (country === "INTL").
  idNumber: string;
  postalCode: string;
  state: string;
  destinationCountry: string;
};
const EMPTY_DRAFT: Draft = {
  name: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  country: "",
  docType: "",
  docNumber: "",
  department: "",
  idNumber: "",
  postalCode: "",
  state: "",
  destinationCountry: "",
};

function loadDraft(): Draft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_DRAFT;
    return { ...EMPTY_DRAFT, ...JSON.parse(raw) };
  } catch {
    return EMPTY_DRAFT;
  }
}

function saveDraft(draft: Draft) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // almacenamiento lleno o bloqueado — no es crítico, solo se pierde el borrador.
  }
}

// Estimado de precio para la interfaz (barra de envío gratis, vista previa
// en USD, etc). El monto real que se cobra SIEMPRE lo calcula el servidor
// con los precios vigentes en Supabase — esto es solo una vista previa para
// que el usuario sepa qué esperar antes de pagar. El pago SIEMPRE se hace
// en pesos colombianos (COP), sea el pedido nacional o internacional.
function estimateUnitPriceCop(slug: string, size: string) {
  const base = PRODUCTS.find((p) => p.slug === slug)?.price ?? PRICE;
  return base + (size === "XXL" ? XXL_SURCHARGE_COP : 0);
}

export default function WompiCheckout({ open, onClose, items }: Props) {
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [totalCop, setTotalCop] = useState<number | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  // TRM real (USD -> COP), solo para mostrar el estimado en dólares antes
  // de pagar. El monto que realmente cobra Wompi siempre es en COP y nunca
  // depende de este valor (ver src/routes/api.checkout.ts).
  const [trm, setTrm] = useState<number>(4000);

  // Cotización de envío EN VIVO (Envia.com), SOLO informativa — nunca se
  // suma al monto que cobra Wompi (ver src/routes/api.checkout.ts, que no
  // importa nada de esto). `domesticQuote` aplica a country === "CO";
  // `intlQuotes` aplica a country === "INTL".
  const [domesticQuote, setDomesticQuote] = useState<{
    estimateCop: number;
    carrier: string;
    service: string;
  } | null>(null);
  const [intlQuotes, setIntlQuotes] = useState<{
    premium: { priceCop: number; carrier: string; service: string; days: number } | null;
    economica: { priceCop: number; carrier: string; service: string; days: number } | null;
  }>({ premium: null, economica: null });
  const [selectedShipping, setSelectedShipping] = useState<"premium" | "economica" | "ultra" | "">(
    "",
  );
  const [shippingConfirmed, setShippingConfirmed] = useState(false);
  // true mientras se espera la respuesta de /api/shipping-quote: el botón de
  // pago queda bloqueado para que nadie pague antes de ver el aproximado.
  const [quoteLoading, setQuoteLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/fx")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { rate?: number } | null) => {
        if (!cancelled && typeof d?.rate === "number" && d.rate > 0) setTrm(d.rate);
      })
      .catch(() => {
        // Se queda con el valor inicial; no es crítico, es solo un
        // estimado visual antes de pagar.
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (open) setDraft(loadDraft());
  }, [open]);

  // Preselecciona "Colombia" o "Internacional" según el país detectado por
  // IP (ver src/routes/api.geo.ts) — SOLO si el usuario todavía no ha
  // elegido nada (ni ahora ni en un borrador guardado). Nunca sobreescribe
  // una elección ya hecha, y si la detección falla, tarda o no está
  // disponible (ej. en desarrollo local), el usuario simplemente elige
  // manualmente como antes — esto es pura comodidad de UX, nunca bloquea
  // el flujo de pago.
  useEffect(() => {
    if (!open || draft.country !== "") return;
    let cancelled = false;
    fetch("/api/geo")
      .then((r) => r.json())
      .then((data: { country?: string | null }) => {
        if (cancelled || !data?.country) return;
        updateDraft({ country: data.country === "CO" ? "CO" : "INTL" });
      })
      .catch(() => {
        // Sin detección disponible: el usuario elige manualmente.
      });
    return () => {
      cancelled = true;
    };
  }, [open, draft.country]);

  useEffect(() => {
    if (!open) {
      setPhase("form");
      setError(null);
      setBusy(false);
      setTotalCop(null);
      setTurnstileToken("");
      setDomesticQuote(null);
      setIntlQuotes({ premium: null, economica: null });
      setSelectedShipping("");
      setShippingConfirmed(false);
      setQuoteLoading(false);
      return;
    }

    // Renderizar el widget en modo EXPLÍCITO (no automático por
    // data-sitekey) para controlar exactamente cuándo se resetea: si el
    // pago falla o el checkout es rechazado, un token ya usado/vencido no
    // sirve para un segundo intento.
    let cancelled = false;
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
    if (!siteKey) {
      console.error("Falta VITE_TURNSTILE_SITE_KEY.");
      return;
    }

    loadTurnstile()
      .then(() => {
        if (cancelled || !window.turnstile || !turnstileContainerRef.current) return;
        turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          callback: (token: string) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [open]);

  function updateDraft(patch: Partial<Draft>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      saveDraft(next);
      return next;
    });
  }

  const isNationalCountry = draft.country === "CO";
  const isInternationalCountry = draft.country === "INTL";

  // Cotización de envío EN VIVO, solo informativa (ver comentario en el
  // estado de arriba). Se dispara sola apenas están completos los campos
  // de dirección que YA existen — sin pedir nada nuevo ni botón de
  // "cotizar". Cualquier cambio en la dirección invalida la selección y
  // confirmación previas, porque el estimado cambia. Si Envia falla o no
  // hay token configurado, la ruta responde con los campos en `null` y
  // simplemente no se muestra nada (nacional) o solo queda la tarjeta fija
  // "Ultra-económica" (internacional) — el pago nunca se bloquea por eso.
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  useEffect(() => {
    if (!open) return;

    setSelectedShipping("");
    setShippingConfirmed(false);
    setQuoteLoading(false);

    const qty = totalQty;
    let cancelled = false;

    if (isNationalCountry) {
      setDomesticQuote(null);
      if (!draft.city || !draft.department) return;
      setQuoteLoading(true);
      const timer = setTimeout(() => {
        fetch("/api/shipping-quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: "CO",
            city: draft.city,
            department: draft.department,
            qty,
          }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((d: { domestic?: typeof domesticQuote } | null) => {
            if (!cancelled) setDomesticQuote(d?.domestic ?? null);
          })
          .catch(() => {
            if (!cancelled) setDomesticQuote(null);
          })
          .finally(() => {
            if (!cancelled) setQuoteLoading(false);
          });
      }, 600);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    if (isInternationalCountry) {
      setIntlQuotes({ premium: null, economica: null });
      if (!draft.city || !draft.state || !draft.postalCode || !draft.destinationCountry) return;
      setQuoteLoading(true);
      const timer = setTimeout(() => {
        fetch("/api/shipping-quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: "INTL",
            city: draft.city,
            state: draft.state,
            postalCode: draft.postalCode,
            destinationCountry: draft.destinationCountry,
            qty,
          }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then(
            (
              d: {
                premium?: typeof intlQuotes.premium;
                economica?: typeof intlQuotes.economica;
              } | null,
            ) => {
              if (!cancelled)
                setIntlQuotes({ premium: d?.premium ?? null, economica: d?.economica ?? null });
            },
          )
          .catch(() => {
            if (!cancelled) setIntlQuotes({ premium: null, economica: null });
          })
          .finally(() => {
            if (!cancelled) setQuoteLoading(false);
          });
      }, 600);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }
  }, [
    open,
    isNationalCountry,
    isInternationalCountry,
    draft.city,
    draft.department,
    draft.state,
    draft.postalCode,
    draft.destinationCountry,
    totalQty,
  ]);

  const estimatedSubtotalCop = items.reduce(
    (sum, i) => sum + estimateUnitPriceCop(i.slug, i.size) * i.qty,
    0,
  );
  const estimatedSubtotalUsd = copToUsd(estimatedSubtotalCop, trm);
  const isNational = isNationalCountry;
  const isInternational = isInternationalCountry;
  const destinationIsMexico = isInternational && isMexicoDestination(draft.destinationCountry);
  const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_COP - estimatedSubtotalCop);

  // --- Envío: qué hay que mostrar y qué hay que confirmar antes de pagar ---
  // Los "sentinel" ("Otro", "Otro país", "Otra ciudad") marcan que el
  // usuario eligió la opción "escribir a mano" en el <select> pero
  // TODAVÍA no ha escrito el valor real en el campo de texto que se
  // revela. Mientras el campo tenga ese valor literal, la dirección NO
  // está completa: si se tratara como completa, se dispararía una
  // cotización de envío con datos sin sentido (departamento "Otro",
  // ciudad "Otra ciudad", etc.) y no calcularía nada útil.
  const departmentHasRealValue = Boolean(draft.department) && draft.department !== "Otro";
  const nationalCityHasRealValue = Boolean(draft.city) && draft.city !== "Otra ciudad";
  const destinationCountryHasRealValue =
    Boolean(draft.destinationCountry) && draft.destinationCountry !== "Otro país";
  const intlCityHasRealValue = Boolean(draft.city) && draft.city !== "Otra ciudad";

  const nationalAddressComplete = isNational && nationalCityHasRealValue && departmentHasRealValue;
  const intlAddressComplete =
    isInternational &&
    intlCityHasRealValue &&
    Boolean(draft.state) &&
    Boolean(draft.postalCode) &&
    destinationCountryHasRealValue;
  // Con la dirección completa SIEMPRE hay que marcar la casilla de envío.
  const shippingAckRequired = nationalAddressComplete || intlAddressComplete;
  // Internacional: ¿hay al menos una opción elegible? (Ultra solo si es México.)
  const hasIntlOption = Boolean(intlQuotes.premium || intlQuotes.economica) || destinationIsMexico;

  type ShippingSummary = {
    label: string;
    carrier: string;
    amountCop: number;
    chargedInWompi: boolean;
  };
  let selectedSummary: ShippingSummary | null = null;
  if (isInternational) {
    if (selectedShipping === "premium" && intlQuotes.premium) {
      selectedSummary = {
        label: "Express",
        carrier: intlQuotes.premium.carrier,
        amountCop: intlQuotes.premium.priceCop,
        chargedInWompi: false,
      };
    } else if (selectedShipping === "economica" && intlQuotes.economica) {
      selectedSummary = {
        label: "Económica",
        carrier: intlQuotes.economica.carrier,
        amountCop: intlQuotes.economica.priceCop,
        chargedInWompi: false,
      };
    } else if (selectedShipping === "ultra" && destinationIsMexico) {
      selectedSummary = {
        label: "Ultra-económica",
        carrier: MEXICO_ULTRA_ECONOMICA_SHIPPING.carrier,
        amountCop: MEXICO_ULTRA_ECONOMICA_SHIPPING.surchargeCop,
        chargedInWompi: true,
      };
    }
  }

  const shippingReady =
    !shippingAckRequired ||
    (!quoteLoading &&
      shippingConfirmed &&
      (!isInternational || !hasIntlOption || selectedSummary !== null));

  // Cambiar de opción invalida la confirmación: el valor del texto cambia.
  function selectShipping(option: "premium" | "economica" | "ultra") {
    setSelectedShipping(option);
    setShippingConfirmed(false);
  }

  // El <select> de país de destino muestra la lista conocida; si el valor
  // guardado no está en la lista (o está vacío), se interpreta como "Otro
  // país" y se revela un campo de texto libre para escribirlo.
  //
  // IMPORTANTE: al elegir "Otro país" del <select>, el valor que se guarda
  // en el draft es literalmente "Otro país" (no ""). Si se guardara "",
  // en el siguiente render `destinationSelectValue` volvería a caer en la
  // rama `draft.destinationCountry === ""` y el <select> mostraría de
  // nuevo el placeholder en vez de "Otro país" — perdiendo la selección y
  // ocultando el campo de texto libre apenas aparecía (ese era el bug).
  // Guardando el sentinel, el <select> se mantiene en "Otro país" y el
  // campo de texto libre queda visible hasta que el cliente escriba su
  // país real, que sobreescribe el sentinel.
  const knownCountryNames = DESTINATION_COUNTRIES.map((c) => c.name).filter(
    (n) => n !== "Otro país",
  );
  const isKnownDestination = knownCountryNames.includes(draft.destinationCountry);
  const destinationSelectValue =
    draft.destinationCountry === ""
      ? ""
      : isKnownDestination
        ? draft.destinationCountry
        : "Otro país";
  const showOtherDestinationInput = destinationSelectValue === "Otro país";

  // Ciudades del país de destino elegido, para ofrecer la ciudad también
  // como lista (no como texto libre): así el nombre que le llega a
  // Envia.com para cotizar siempre es uno reconocible. Si el país es "Otro
  // país" (texto libre) no hay lista de ciudades disponible, así que la
  // ciudad se escribe directamente a mano. Mismo cuidado con el sentinel
  // "Otra ciudad" que con "Otro país" arriba.
  const intlCitiesForCountry =
    DESTINATION_COUNTRIES.find((c) => c.name === destinationSelectValue)?.cities ?? [];
  const intlCitySelectValue =
    draft.city === "" ? "" : intlCitiesForCountry.includes(draft.city) ? draft.city : "Otra ciudad";
  const showOtherIntlCityInput = showOtherDestinationInput || intlCitySelectValue === "Otra ciudad";

  // Mismo patrón para el departamento (nacional): lista completa de los 32
  // departamentos + Bogotá D.C., con "Otro" para escribirlo a mano si no
  // está en la lista (mismo cuidado con el sentinel que arriba).
  const knownDepartmentNames = COLOMBIA_DEPARTMENTS.map((d) => d.name).filter((n) => n !== "Otro");
  const isKnownDepartment = knownDepartmentNames.includes(draft.department);
  const departmentSelectValue =
    draft.department === "" ? "" : isKnownDepartment ? draft.department : "Otro";
  const showOtherDepartmentInput = departmentSelectValue === "Otro";

  // Ciudades del departamento elegido, también como lista con "Otra
  // ciudad" de respaldo. Si el departamento es "Otro" (texto libre), la
  // ciudad se escribe directamente a mano.
  const nationalCitiesForDepartment =
    COLOMBIA_DEPARTMENTS.find((d) => d.name === departmentSelectValue)?.cities ?? [];
  const nationalCitySelectValue =
    draft.city === ""
      ? ""
      : nationalCitiesForDepartment.includes(draft.city)
        ? draft.city
        : "Otra ciudad";
  const showOtherNationalCityInput =
    showOtherDepartmentInput || nationalCitySelectValue === "Otra ciudad";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!draft.country) {
      setError("Selecciona si tu compra es nacional (Colombia) o internacional.");
      return;
    }
    if (draft.country === "CO" && (!draft.docType || !draft.docNumber || !draft.department)) {
      setError("Faltan datos: tipo/número de documento de identidad o departamento.");
      return;
    }
    if (
      draft.country === "INTL" &&
      (!draft.idNumber ||
        !draft.email ||
        !draft.postalCode ||
        !draft.state ||
        !draft.destinationCountry)
    ) {
      setError(
        "Para compras internacionales faltan datos: documento de identificación, correo, código postal, estado/provincia o país de destino.",
      );
      return;
    }
    if (!turnstileToken) {
      setError("Completa la verificación de seguridad antes de continuar.");
      return;
    }

    // Misma validación que ya deshabilita el botón de pago (ver `disabled`
    // más abajo), repetida acá por seguridad de UX antes de llamar al
    // servidor, que es quien de verdad la hace cumplir.
    if (shippingAckRequired) {
      if (quoteLoading) {
        setError("Espera un momento: estamos calculando el costo aproximado de tu envío.");
        return;
      }
      if (isInternational && hasIntlOption && !selectedSummary) {
        setError("Elige una opción de envío internacional antes de pagar.");
        return;
      }
      if (!shippingConfirmed) {
        setError("Marca la casilla de confirmación del envío para poder pagar.");
        return;
      }
    }

    setBusy(true);

    // Traduce la selección visual a la opción concreta que entiende el
    // servidor. El servidor vuelve a validar todo (p. ej. que "intl_ultra_mx"
    // solo exista para México y fija él mismo el recargo de 83.050) — el
    // cliente nunca decide el monto, solo indica qué eligió.
    let shippingMethod: string | null = null;
    let shippingCarrier = "";
    let shippingService = "";
    let shippingEstimateCop: number | null = null;

    if (isNational) {
      if (domesticQuote) {
        shippingMethod = "domestic";
        shippingCarrier = domesticQuote.carrier;
        shippingService = domesticQuote.service;
        shippingEstimateCop = domesticQuote.estimateCop;
      } else {
        shippingMethod = "domestic_unquoted";
      }
    } else if (isInternational) {
      if (selectedShipping === "premium" && intlQuotes.premium) {
        shippingMethod = "intl_express";
        shippingCarrier = intlQuotes.premium.carrier;
        shippingService = intlQuotes.premium.service;
        shippingEstimateCop = intlQuotes.premium.priceCop;
      } else if (selectedShipping === "economica" && intlQuotes.economica) {
        shippingMethod = "intl_economica";
        shippingCarrier = intlQuotes.economica.carrier;
        shippingService = intlQuotes.economica.service;
        shippingEstimateCop = intlQuotes.economica.priceCop;
      } else if (selectedShipping === "ultra" && destinationIsMexico) {
        shippingMethod = "intl_ultra_mx";
        shippingCarrier = MEXICO_ULTRA_ECONOMICA_SHIPPING.carrier;
        shippingService = "Ultra-económica";
        shippingEstimateCop = MEXICO_ULTRA_ECONOMICA_SHIPPING.surchargeCop;
      } else if (!hasIntlOption) {
        shippingMethod = "intl_unquoted";
      }
    }

    try {
      if (items.length === 0) throw new Error("Tu carrito está vacío.");

      // El precio (siempre en COP), el stock, la referencia y la firma de
      // integridad los calcula el servidor (ver src/routes/api.checkout.ts)
      // a partir de "country". El cliente nunca decide cuánto se cobra ni
      // descuenta el inventario — solo indica a qué categoría de envío
      // pertenece.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, size: i.size, qty: i.qty })),
          name: draft.name,
          phone: draft.phone,
          email: draft.email,
          city: draft.city,
          address: draft.address,
          country: draft.country,
          docType: draft.docType,
          docNumber: draft.docNumber,
          department: draft.department,
          idNumber: draft.idNumber,
          postalCode: draft.postalCode,
          state: draft.state,
          destinationCountry: draft.destinationCountry,
          shippingMethod,
          shippingCarrier,
          shippingService,
          shippingEstimateCop,
          shippingConfirmed,
          turnstileToken,
        }),
      });

      const checkout = (await res.json().catch(() => null)) as {
        reference?: string;
        amountInCents?: number;
        currency?: "COP";
        country?: CountryCode;
        publicKey?: string;
        signature?: string;
        total?: number;
        shippingExtraCop?: number;
        error?: string;
      } | null;

      if (!res.ok || !checkout?.reference || !checkout.signature) {
        throw new Error(checkout?.error ?? "No pudimos registrar tu pedido.");
      }

      if (checkout.total != null) {
        setTotalCop(checkout.total);
      }

      await loadWidget();
      const Widget = window.WidgetCheckout;
      if (!Widget) throw new Error("No pudimos cargar el checkout de Wompi.");

      new Widget({
        currency: "COP",
        amountInCents: checkout.amountInCents,
        reference: checkout.reference,
        publicKey: checkout.publicKey,
        signature: { integrity: checkout.signature },
        redirectUrl: `${window.location.origin}/`,
      }).open(() => {
        setPhase("sent");
        // Pago iniciado con éxito: el borrador ya no hace falta.
        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* no crítico */
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos iniciar el pago.");
      // El token es de un solo uso: si algo falló, hay que resetear el
      // widget para que el usuario pueda obtener uno nuevo antes de
      // reintentar.
      setTurnstileToken("");
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full bg-transparent border border-white/25 px-3 py-3 text-sm outline-none focus:border-white placeholder:text-white/35";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/85 flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Pago con Wompi"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[85dvh] bg-black text-white border border-white/25 flex flex-col overscroll-contain"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0">
              <p className="text-[10px] tracking-[0.3em] uppercase">Pago seguro · Wompi</p>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="w-9 h-9 flex items-center justify-center border border-white/25 hover:bg-white hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-6 space-y-4 overflow-y-auto overscroll-contain flex-1">
              {phase === "form" && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <h3 className="text-2xl font-display tracking-wide">Tu pedido</h3>
                  <ul className="text-sm text-white/70 space-y-1 border border-white/15 p-3">
                    {items.map((i) => (
                      <li key={`${i.slug}-${i.size}`} className="flex justify-between">
                        <span>
                          {i.name} · {i.size} × {i.qty}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Selección obligatoria de categoría de envío. Solo hay
                      dos casos: nacional (Colombia) o internacional. El pago
                      SIEMPRE se cobra en pesos colombianos (COP) en ambos
                      casos — lo único que cambia son los datos de envío que
                      se piden más abajo. Se preselecciona por IP (ver el
                      efecto de geolocalización arriba), pero el usuario
                      puede cambiarlo libremente. */}
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/55 mb-2">
                      ¿Dónde recibes tu pedido?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateDraft({ country: "CO" })}
                        aria-pressed={isNational}
                        className={`border px-3 py-3 text-xs tracking-[0.1em] uppercase transition-colors ${
                          isNational
                            ? "bg-white text-black border-white"
                            : "border-white/25 hover:border-white/60"
                        }`}
                      >
                        Colombia
                      </button>
                      <button
                        type="button"
                        onClick={() => updateDraft({ country: "INTL" })}
                        aria-pressed={isInternational}
                        className={`border px-3 py-3 text-xs tracking-[0.1em] uppercase transition-colors ${
                          isInternational
                            ? "bg-white text-black border-white"
                            : "border-white/25 hover:border-white/60"
                        }`}
                      >
                        Internacional
                      </button>
                    </div>
                  </div>

                  {isNational && (
                    <p className="text-[11px] text-white/60">
                      Subtotal estimado: {formatCop(estimatedSubtotalCop)}.{" "}
                      {missingForFreeShipping > 0 ? (
                        <>
                          Agrega {formatCop(missingForFreeShipping)} más y el envío es gratis (solo
                          Colombia).
                        </>
                      ) : (
                        <span className="text-emerald-400">
                          Tu compra supera $250.000 — el envío nacional es gratis.
                        </span>
                      )}
                    </p>
                  )}

                  {isInternational && (
                    <div className="text-[11px] text-white/60 space-y-1.5">
                      <p>
                        Subtotal estimado: {formatUsd(estimatedSubtotalUsd)} USD (cobro procesado en
                        pesos colombianos, TRM del día {formatCop(trm)}/USD).
                      </p>
                      <p>
                        El cobro se realiza en pesos colombianos (COP); si tu tarjeta o banco está
                        en el extranjero, ellos hacen la conversión a tu moneda al momento de pagar.
                        No somos responsables por la tasa de cambio ni por comisiones que aplique tu
                        banco.
                      </p>
                      <p>
                        El envío internacional NO está incluido en este pago con Wompi: lo paga el
                        cliente a la transportadora. La única excepción es la opción ultra-económica
                        (4-72, válida solo para México), cuyo valor sí se suma al total de Wompi.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-y border-white/10 py-3">
                    <p className="text-[10px] text-white/55 leading-relaxed max-w-[70%]">
                      Compra supervisada por Bancolombia · segura de extremo a extremo.
                    </p>
                    <img
                      src="/images/bancolombia-white.png"
                      alt="Bancolombia"
                      className="h-4 w-auto opacity-90"
                    />
                  </div>

                  <input
                    value={draft.name}
                    onChange={(e) => updateDraft({ name: e.target.value })}
                    required
                    maxLength={80}
                    placeholder="Nombre completo o razón social"
                    className={field}
                  />

                  {isNational && (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={draft.docType}
                        onChange={(e) =>
                          updateDraft({ docType: e.target.value as Draft["docType"] })
                        }
                        required
                        className={`${field} ${draft.docType === "" ? "text-white/35" : ""}`}
                      >
                        <option value="" disabled>
                          Tipo de documento
                        </option>
                        {DOC_TYPES.map((d) => (
                          <option key={d.value} value={d.value} className="bg-black">
                            {d.label}
                          </option>
                        ))}
                      </select>
                      <input
                        value={draft.docNumber}
                        onChange={(e) => updateDraft({ docNumber: e.target.value })}
                        required
                        maxLength={40}
                        placeholder="Número de documento"
                        className={field}
                      />
                    </div>
                  )}

                  {isInternational && (
                    <input
                      value={draft.idNumber}
                      onChange={(e) => updateDraft({ idNumber: e.target.value })}
                      required
                      maxLength={40}
                      placeholder="Documento de identificación / pasaporte del destinatario"
                      className={field}
                    />
                  )}

                  <input
                    value={draft.phone}
                    onChange={(e) => updateDraft({ phone: e.target.value })}
                    required
                    maxLength={30}
                    placeholder={
                      isInternational
                        ? "Teléfono de contacto (del país de destino, con código)"
                        : "Teléfono celular o fijo"
                    }
                    className={field}
                  />

                  {isInternational && (
                    <input
                      value={draft.email}
                      onChange={(e) => updateDraft({ email: e.target.value })}
                      type="email"
                      required
                      maxLength={120}
                      placeholder="Correo electrónico"
                      className={field}
                    />
                  )}

                  <input
                    value={draft.address}
                    onChange={(e) => updateDraft({ address: e.target.value })}
                    required
                    maxLength={200}
                    placeholder={
                      isInternational
                        ? "Dirección exacta detallada"
                        : "Dirección exacta (incluye barrio o indicaciones)"
                    }
                    className={field}
                  />

                  {isNational && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={departmentSelectValue}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Cambiar de departamento invalida la ciudad
                            // elegida (la lista de ciudades depende de él).
                            // Se guarda el valor tal cual (incluyendo el
                            // sentinel "Otro") para que el <select> no
                            // pierda la selección — ver comentario arriba
                            // de destinationSelectValue.
                            updateDraft({ department: value, city: "" });
                          }}
                          required
                          className={`${field} ${departmentSelectValue === "" ? "text-white/35" : ""}`}
                        >
                          <option value="" disabled>
                            Departamento
                          </option>
                          {COLOMBIA_DEPARTMENTS.map((d) => (
                            <option key={d.name} value={d.name} className="bg-black">
                              {d.name}
                            </option>
                          ))}
                        </select>
                        {showOtherNationalCityInput ? (
                          <input
                            value={draft.city === "Otra ciudad" ? "" : draft.city}
                            onChange={(e) => updateDraft({ city: e.target.value })}
                            required
                            maxLength={60}
                            placeholder="Ciudad"
                            className={field}
                          />
                        ) : (
                          <select
                            value={nationalCitySelectValue}
                            onChange={(e) => updateDraft({ city: e.target.value })}
                            required
                            disabled={!departmentSelectValue}
                            className={`${field} ${nationalCitySelectValue === "" ? "text-white/35" : ""} disabled:opacity-40`}
                          >
                            <option value="" disabled>
                              Ciudad
                            </option>
                            {nationalCitiesForDepartment.map((c) => (
                              <option key={c} value={c} className="bg-black">
                                {c}
                              </option>
                            ))}
                            <option value="Otra ciudad" className="bg-black">
                              Otra ciudad
                            </option>
                          </select>
                        )}
                      </div>
                      {showOtherDepartmentInput && (
                        <input
                          value={draft.department === "Otro" ? "" : draft.department}
                          onChange={(e) => updateDraft({ department: e.target.value })}
                          required
                          maxLength={60}
                          placeholder="Escribe tu departamento"
                          className={field}
                        />
                      )}
                      {showOtherNationalCityInput && !showOtherDepartmentInput && (
                        <p className="text-[10px] text-white/40 -mt-1">
                          Escribe tu ciudad o municipio exacto.
                        </p>
                      )}
                    </>
                  )}

                  {isInternational && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={draft.postalCode}
                          onChange={(e) => updateDraft({ postalCode: e.target.value })}
                          required
                          maxLength={20}
                          placeholder="Código postal (Zip Code)"
                          className={field}
                        />
                        <input
                          value={draft.city}
                          onChange={(e) => updateDraft({ city: e.target.value })}
                          required
                          maxLength={60}
                          placeholder="Ciudad"
                          className={field}
                        />
                      </div>
                      <input
                        value={draft.state}
                        onChange={(e) => updateDraft({ state: e.target.value })}
                        required
                        maxLength={60}
                        placeholder="Estado / provincia"
                        className={field}
                      />
                      <select
                        value={destinationSelectValue}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Cambiar de país invalida la ciudad elegida (la
                          // lista de ciudades depende de él).
                          updateDraft({ destinationCountry: value, city: "" });
                        }}
                        required
                        className={`${field} ${destinationSelectValue === "" ? "text-white/35" : ""}`}
                      >
                        <option value="" disabled>
                          País de destino
                        </option>
                        {DESTINATION_COUNTRIES.map((c) => (
                          <option key={c.name} value={c.name} className="bg-black">
                            {c.name}
                            {c.dial ? ` (${c.dial})` : ""}
                          </option>
                        ))}
                      </select>
                      {showOtherDestinationInput && (
                        <input
                          value={
                            draft.destinationCountry === "Otro país" ? "" : draft.destinationCountry
                          }
                          onChange={(e) => updateDraft({ destinationCountry: e.target.value })}
                          required
                          maxLength={60}
                          placeholder="Escribe tu país de destino"
                          className={field}
                        />
                      )}
                      {showOtherIntlCityInput ? (
                        <input
                          value={draft.city === "Otra ciudad" ? "" : draft.city}
                          onChange={(e) => updateDraft({ city: e.target.value })}
                          required
                          maxLength={60}
                          placeholder="Ciudad"
                          className={field}
                        />
                      ) : (
                        <select
                          value={intlCitySelectValue}
                          onChange={(e) => updateDraft({ city: e.target.value })}
                          required
                          disabled={!destinationSelectValue}
                          className={`${field} ${intlCitySelectValue === "" ? "text-white/35" : ""} disabled:opacity-40`}
                        >
                          <option value="" disabled>
                            Ciudad
                          </option>
                          {intlCitiesForCountry.map((c) => (
                            <option key={c} value={c} className="bg-black">
                              {c}
                            </option>
                          ))}
                          <option value="Otra ciudad" className="bg-black">
                            Otra ciudad
                          </option>
                        </select>
                      )}
                    </>
                  )}

                  {/* Envío NACIONAL — cotización automática (Envia.com), solo
                      informativa: NO está conectada con Wompi, la paga el
                      cliente. Sin marcar la casilla, el botón de Wompi queda
                      deshabilitado. */}
                  {nationalAddressComplete && (
                    <div className="border border-white/20 p-3 space-y-2">
                      {quoteLoading ? (
                        <p className="text-xs text-white/60">
                          Calculando el costo aproximado de tu envío…
                        </p>
                      ) : domesticQuote ? (
                        <p className="text-xs text-white/80">
                          Envío aproximado:{" "}
                          <span className="font-semibold text-white">
                            {formatCop(domesticQuote.estimateCop)}
                          </span>{" "}
                          vía {domesticQuote.carrier} ({domesticQuote.service}).
                        </p>
                      ) : (
                        <p className="text-xs text-white/60">
                          No pudimos calcular el costo aproximado de tu envío en este momento. Lo
                          define la transportadora.
                        </p>
                      )}
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Precio informativo: es un aproximado, muy cercano al valor real, pero puede
                        variar. El envío corre por cuenta del cliente: este valor no está conectado
                        con Wompi ni se suma a tu pago, y lo define la transportadora, no Inti Net.
                      </p>
                      {!quoteLoading && (
                        <label className="flex items-start gap-2 cursor-pointer text-[11px] text-white/60 leading-relaxed">
                          <input
                            type="checkbox"
                            checked={shippingConfirmed}
                            onChange={(e) => setShippingConfirmed(e.target.checked)}
                            className="mt-0.5 shrink-0"
                          />
                          <span>
                            {domesticQuote
                              ? `Confirmo que leí la información del envío: el valor aproximado es ${formatCop(domesticQuote.estimateCop)}, lo paga el cliente y es responsabilidad exclusiva de la transportadora, no de Inti Net.`
                              : "Confirmo que leí la información del envío: su costo lo paga el cliente y es responsabilidad exclusiva de la transportadora, no de Inti Net."}
                          </span>
                        </label>
                      )}
                    </div>
                  )}

                  {/* Envío INTERNACIONAL — tres opciones. Express y Económica
                      salen de Envia.com (solo informativas, requieren la
                      dirección completa). Ultra-económica es fija, solo
                      México, y no depende de Envia — por eso el panel
                      completo se muestra apenas se elige el país de destino,
                      no solo cuando toda la dirección está completa (ese
                      era el bug: antes, si faltaba una sola casilla como el
                      código postal, ni siquiera la Ultra-económica se
                      mostraba). Ninguna viene preseleccionada. */}
                  {isInternational && destinationCountryHasRealValue && (
                    <div className="space-y-2">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-white/45">
                        Elige tu opción de envío
                      </p>
                      {quoteLoading && (
                        <p className="text-xs text-white/60">
                          Calculando los costos aproximados de tu envío…
                        </p>
                      )}

                      <div className="space-y-2">
                        {intlQuotes.premium && (
                          <label
                            className={`flex items-start gap-2 border p-3 cursor-pointer transition-colors ${
                              selectedShipping === "premium"
                                ? "border-white bg-white/5"
                                : "border-white/20 hover:border-white/40"
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping-option"
                              checked={selectedShipping === "premium"}
                              onChange={() => selectShipping("premium")}
                              className="mt-0.5 shrink-0"
                            />
                            <span className="text-xs">
                              <span className="block font-semibold text-white">
                                Express — {formatCop(intlQuotes.premium.priceCop)} aprox.
                              </span>
                              <span className="block text-white/55 mt-0.5">
                                {intlQuotes.premium.carrier} ({intlQuotes.premium.service}) ·{" "}
                                {intlQuotes.premium.days > 0
                                  ? `llega en ${intlQuotes.premium.days} días aprox.`
                                  : "tiempo de llegada no informado por la transportadora"}{" "}
                                — la entrega más rápida.
                              </span>
                            </span>
                          </label>
                        )}

                        {intlQuotes.economica && (
                          <label
                            className={`flex items-start gap-2 border p-3 cursor-pointer transition-colors ${
                              selectedShipping === "economica"
                                ? "border-white bg-white/5"
                                : "border-white/20 hover:border-white/40"
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping-option"
                              checked={selectedShipping === "economica"}
                              onChange={() => selectShipping("economica")}
                              className="mt-0.5 shrink-0"
                            />
                            <span className="text-xs">
                              <span className="block font-semibold text-white">
                                Económica — {formatCop(intlQuotes.economica.priceCop)} aprox.
                              </span>
                              <span className="block text-white/55 mt-0.5">
                                {intlQuotes.economica.carrier} ({intlQuotes.economica.service}) ·{" "}
                                {intlQuotes.economica.days > 0
                                  ? `llega en ${intlQuotes.economica.days} días aprox.`
                                  : "tiempo de llegada no informado por la transportadora"}{" "}
                                — el precio más bajo.
                              </span>
                            </span>
                          </label>
                        )}

                        {/* Ultra-económica: siempre visible, pero solo se
                            puede elegir si el destino es México. */}
                        <label
                          className={`block border p-3 transition-colors ${
                            destinationIsMexico
                              ? selectedShipping === "ultra"
                                ? "cursor-pointer border-white bg-white/5"
                                : "cursor-pointer border-white/20 hover:border-white/40"
                              : "cursor-not-allowed border-white/10 opacity-60"
                          }`}
                        >
                          <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-red-500 mb-2">
                            (Válida solo para México)
                          </span>
                          <span className="flex items-start gap-2">
                            <input
                              type="radio"
                              name="shipping-option"
                              checked={selectedShipping === "ultra"}
                              disabled={!destinationIsMexico}
                              onChange={() => selectShipping("ultra")}
                              className="mt-0.5 shrink-0"
                            />
                            <span className="text-xs">
                              <span className="block font-semibold text-white">
                                Ultra-económica ({MEXICO_ULTRA_ECONOMICA_SHIPPING.carrier}) —{" "}
                                {formatCop(MEXICO_ULTRA_ECONOMICA_SHIPPING.surchargeCop)}
                              </span>
                              <span className="block text-white/55 mt-0.5 leading-relaxed">
                                La más lenta: llega entre {MEXICO_ULTRA_ECONOMICA_SHIPPING.minDays}{" "}
                                y {MEXICO_ULTRA_ECONOMICA_SHIPPING.maxDays} días, sin fecha
                                garantizada.
                                {!destinationIsMexico && " No disponible para tu país de destino."}
                              </span>
                              <span className="block text-amber-300/90 mt-1 font-medium leading-relaxed">
                                Es la ÚNICA opción cuyo valor (
                                {formatCop(MEXICO_ULTRA_ECONOMICA_SHIPPING.surchargeCop)}) SÍ se
                                suma a tu pago con Wompi. Express y Económica no modifican el valor
                                de Wompi.
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>

                      {!quoteLoading && !hasIntlOption && !intlAddressComplete && (
                        <p className="text-[11px] text-white/50 leading-relaxed border border-white/15 p-2">
                          Completa ciudad, estado/provincia y código postal para ver el estimado de
                          Express y Económica.
                        </p>
                      )}

                      {!quoteLoading && !hasIntlOption && intlAddressComplete && (
                        <p className="text-[11px] text-white/60 leading-relaxed border border-white/20 p-2">
                          No pudimos calcular el costo aproximado de tu envío en este momento. El
                          envío internacional lo paga el cliente a la transportadora y no se suma a
                          tu pago con Wompi.
                        </p>
                      )}

                      {selectedSummary && !selectedSummary.chargedInWompi && (
                        <p className="text-[11px] text-amber-300/90 leading-relaxed border border-amber-300/30 p-2">
                          Valor aproximado de tu envío {selectedSummary.label}:{" "}
                          {formatCop(selectedSummary.amountCop)} ({selectedSummary.carrier}). Es un
                          aproximado cercano al valor real, pero puede variar. NO se suma a tu pago
                          con Wompi: lo paga el cliente y es responsabilidad exclusiva de la
                          transportadora, no de Inti Net.
                        </p>
                      )}

                      {selectedSummary?.chargedInWompi && (
                        <p className="text-[11px] text-amber-300/90 leading-relaxed border border-amber-300/30 p-2">
                          Al pagar, tu compra incluirá{" "}
                          {formatCop(MEXICO_ULTRA_ECONOMICA_SHIPPING.surchargeCop)} adicionales de
                          envío ({MEXICO_ULTRA_ECONOMICA_SHIPPING.carrier}, 15 a 25 días). El total
                          que verás en el botón de Wompi ya lo incluye. Esta es la única opción de
                          envío que modifica el valor de Wompi.
                        </p>
                      )}

                      {/* BUG CORREGIDO: antes la casilla quedaba con
                          `disabled` + opacidad 40% hasta que se elegía una
                          opción de envío, lo que la hacía prácticamente
                          invisible ("no aparece desde el principio"). Ahora
                          la casilla siempre se ve y es clickeable; si
                          todavía falta elegir una opción, el intento de
                          marcarla simplemente no hace nada (el texto de al
                          lado y la validación al pagar ya avisan qué
                          falta). */}
                      {!quoteLoading && (
                        <label className="flex items-start gap-2 cursor-pointer text-[11px] text-white/60 leading-relaxed">
                          <input
                            type="checkbox"
                            checked={shippingConfirmed}
                            onChange={(e) => {
                              if (hasIntlOption && !selectedSummary) return;
                              setShippingConfirmed(e.target.checked);
                            }}
                            className="mt-0.5 shrink-0"
                          />
                          <span>
                            {selectedSummary
                              ? selectedSummary.chargedInWompi
                                ? `Confirmo que leí la información del envío: elegí la opción ultra-económica (${MEXICO_ULTRA_ECONOMICA_SHIPPING.carrier}, solo México, 15 a 25 días). Su valor de ${formatCop(selectedSummary.amountCop)} se suma a mi pago con Wompi; la entrega es responsabilidad exclusiva de la transportadora, no de Inti Net.`
                                : `Confirmo que leí la información del envío: el valor aproximado de la opción ${selectedSummary.label} es ${formatCop(selectedSummary.amountCop)}, lo pago yo a la transportadora, no se suma a mi pago con Wompi y es responsabilidad exclusiva de la transportadora, no de Inti Net. Puede variar respecto a este aproximado.`
                              : hasIntlOption
                                ? "Elige una opción de envío para poder confirmar."
                                : "Confirmo que leí la información del envío: su costo lo pago yo a la transportadora, no se suma a mi pago con Wompi y es responsabilidad exclusiva de la transportadora, no de Inti Net."}
                          </span>
                        </label>
                      )}
                    </div>
                  )}

                  {error && <p className="text-xs text-red-400">{error}</p>}

                  {/* Verificación anti-bots. El div queda vacío hasta que
                      Cloudflare inyecta el widget (ver useEffect de arriba).
                      El backend SIEMPRE revalida este token — este widget
                      por sí solo no bloquea nada. */}
                  <div ref={turnstileContainerRef} className="flex justify-center py-1" />

                  {/* Igual que con Turnstile: mientras haya al menos un
                      estimado de envío visible (nacional con cotización
                      disponible, o internacional con los campos completos
                      — que siempre incluye la tarjeta fija
                      "Ultra-económica") y el cliente no haya marcado el
                      checkbox correspondiente, el botón de pago queda
                      deshabilitado. Si Envia falla en nacional, no hay
                      nada que confirmar y el pago no se bloquea. */}
                  <button
                    type="submit"
                    disabled={busy || items.length === 0 || !turnstileToken || !shippingReady}
                    className="group w-full h-16 flex flex-col items-center justify-center gap-1 bg-white text-black border border-white hover:bg-transparent hover:text-white transition-colors disabled:opacity-40"
                  >
                    {busy ? (
                      <span className="text-xs tracking-[0.2em] uppercase font-semibold">
                        Preparando pago…
                      </span>
                    ) : (
                      <>
                        <span className="text-[9px] tracking-[0.2em] uppercase text-black/50 group-hover:text-white/50 transition-colors">
                          Pagar de forma segura
                        </span>
                        <span className="flex items-center gap-3">
                          <img
                            src="/images/wompi-white.png"
                            alt="Wompi"
                            className="h-4 w-auto invert group-hover:invert-0 transition-[filter]"
                          />
                          <span className="text-black/20 group-hover:text-white/20 text-sm leading-none transition-colors">
                            ×
                          </span>
                          <img
                            src="/images/bancolombia-white.png"
                            alt="Bancolombia"
                            className="h-3.5 w-auto invert group-hover:invert-0 transition-[filter]"
                          />
                        </span>
                      </>
                    )}
                  </button>
                  <WompiVerifiedBadge className="justify-center" />
                  {isInternational ? (
                    <p className="text-[10px] text-white/45 leading-relaxed">
                      Pago internacional: se cobra en pesos colombianos (COP); tu banco hace la
                      conversión a tu moneda. Tu camisa se hace a mano y se despacha 1 semana
                      después de la compra. El envío internacional no está incluido en este pago con
                      Wompi y lo paga el cliente a la transportadora, salvo la opción
                      ultra-económica (solo México), que sí se suma al total.
                    </p>
                  ) : (
                    <p className="text-[10px] text-white/45 leading-relaxed">
                      Envío nacional: tu camisa se hace a mano y se despacha 1 semana después de la
                      compra. Envío gratis en compras superiores a $250.000 (solo Colombia); por
                      debajo de ese monto, el envío corre por cuenta del comprador y se coordina
                      aparte.
                    </p>
                  )}
                </form>
              )}

              {/* Colchón de scroll: en móviles donde el navegador no
                  reajusta el layout al abrir el teclado (interactive-widget
                  no soportado), este espacio permite seguir bajando hasta
                  destapar por completo el último campo. */}
              {phase === "form" && <div className="h-[45vh] shrink-0" aria-hidden="true" />}

              {phase === "sent" && (
                <div className="space-y-4 py-4">
                  <h3 className="text-3xl font-display tracking-wide">Pedido registrado</h3>
                  {totalCop != null && (
                    <div className="text-sm text-white/70 space-y-1 border-t border-white/10 pt-3">
                      <div className="flex justify-between font-semibold text-white">
                        <span>Total</span>
                        <span>{formatCop(totalCop)}</span>
                      </div>
                      {isInternational && (
                        <p className="text-[11px] text-white/50">
                          ≈ {formatUsd(copToUsd(totalCop, trm))} USD (referencial). El monto cobrado
                          por Wompi es siempre en pesos colombianos; la conversión final la hace tu
                          banco.
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-white/70">
                    Tu pedido quedó registrado. Si el pago fue aprobado, tus camisas se elaboran a
                    mano y se despachan 1 semana después de la compra. Cualquier duda escríbenos por
                    Instagram.
                  </p>
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-4 text-xs tracking-[0.2em] uppercase font-semibold border border-white/25 hover:bg-white hover:text-black transition-colors"
                  >
                    Escríbenos por Instagram ({CONTACT.instagramHandle})
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
