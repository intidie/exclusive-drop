import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CONTACT,
  DESTINATION_COUNTRIES,
  DOC_TYPES,
  FREE_SHIPPING_THRESHOLD_COP,
  PRICE,
  PRODUCTS,
  XXL_SURCHARGE_COP,
  copToUsd,
  formatCop,
  formatUsd,
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
    WidgetCheckout?: new (opts: Record<string, unknown>) => { open: (cb: (r: unknown) => void) => void };
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
  // por defecto, porque de eso depende la moneda y el monto que se cobra.
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
// con los precios vigentes en Supabase y la TRM fija — esto es solo una
// vista previa para que el usuario sepa qué esperar antes de pagar.
function estimateUnitPriceCop(slug: string, size: string) {
  const base = PRODUCTS.find((p) => p.slug === slug)?.price ?? PRICE;
  return base + (size === "XXL" ? XXL_SURCHARGE_COP : 0);
}

export default function WompiCheckout({ open, onClose, items }: Props) {
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [totals, setTotals] = useState<{ total: number; currency: "COP" | "USD" } | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (open) setDraft(loadDraft());
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPhase("form");
      setError(null);
      setBusy(false);
      setTotals(null);
      setTurnstileToken("");
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

  const estimatedSubtotalCop = items.reduce(
    (sum, i) => sum + estimateUnitPriceCop(i.slug, i.size) * i.qty,
    0,
  );
  const estimatedSubtotalUsd = copToUsd(estimatedSubtotalCop);
  const isNational = draft.country === "CO";
  const isInternational = draft.country === "INTL";
  const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_COP - estimatedSubtotalCop);

  // El <select> de país de destino muestra la lista conocida; si el valor
  // guardado no está en la lista (o está vacío), se interpreta como "Otro
  // país" y se revela un campo de texto libre para escribirlo.
  const knownCountryNames = DESTINATION_COUNTRIES.map((c) => c.name).filter((n) => n !== "Otro país");
  const isKnownDestination = knownCountryNames.includes(draft.destinationCountry);
  const destinationSelectValue = draft.destinationCountry === "" ? "" : isKnownDestination ? draft.destinationCountry : "Otro país";
  const showOtherDestinationInput = destinationSelectValue === "Otro país";

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
      (!draft.idNumber || !draft.email || !draft.postalCode || !draft.state || !draft.destinationCountry)
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

    setBusy(true);

    try {
      if (items.length === 0) throw new Error("Tu carrito está vacío.");

      // El precio, la moneda, el stock, la referencia y la firma de
      // integridad los calcula el servidor (ver src/routes/api.checkout.ts)
      // a partir de "country". El cliente nunca decide cuánto se cobra ni
      // descuenta el inventario — solo indica a qué categoría pertenece.
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
          turnstileToken,
        }),
      });

      const checkout = (await res.json().catch(() => null)) as {
        reference?: string;
        amountInCents?: number;
        currency?: "COP" | "USD";
        country?: CountryCode;
        publicKey?: string;
        signature?: string;
        subtotal?: number;
        total?: number;
        error?: string;
      } | null;

      if (!res.ok || !checkout?.reference || !checkout.signature) {
        throw new Error(checkout?.error ?? "No pudimos registrar tu pedido.");
      }

      if (checkout.total != null && checkout.currency) {
        setTotals({ total: checkout.total, currency: checkout.currency });
      }

      await loadWidget();
      const Widget = window.WidgetCheckout;
      if (!Widget) throw new Error("No pudimos cargar el checkout de Wompi.");

      new Widget({
        currency: checkout.currency,
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

                  {/* Selección obligatoria de categoría de precio. Solo hay
                      dos casos: nacional (Colombia, COP) o internacional
                      (USD, precio fijo con TRM de negocio). No hay un valor
                      preseleccionado a propósito. */}
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
                        Colombia (COP)
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
                        Internacional (USD)
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
                    <p className="text-[11px] text-white/60">
                      Precio fijo estimado: {formatUsd(estimatedSubtotalUsd)}. Los envíos
                      internacionales se coordinan aparte con nuestro equipo por Instagram después
                      del pago.
                    </p>
                  )}

                  <div className="flex items-center justify-between border-y border-white/10 py-3">
                    <p className="text-[10px] text-white/55 leading-relaxed max-w-[70%]">
                      Compra supervisada por Bancolombia · segura de extremo a extremo.
                    </p>
                    <img src="/images/bancolombia-white.png" alt="Bancolombia" className="h-4 w-auto opacity-90" />
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
                        onChange={(e) => updateDraft({ docType: e.target.value as Draft["docType"] })}
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
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={draft.city}
                        onChange={(e) => updateDraft({ city: e.target.value })}
                        required
                        maxLength={60}
                        placeholder="Ciudad"
                        className={field}
                      />
                      <input
                        value={draft.department}
                        onChange={(e) => updateDraft({ department: e.target.value })}
                        required
                        maxLength={60}
                        placeholder="Departamento"
                        className={field}
                      />
                    </div>
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
                          updateDraft({ destinationCountry: value === "Otro país" ? "" : value });
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
                          value={draft.destinationCountry}
                          onChange={(e) => updateDraft({ destinationCountry: e.target.value })}
                          required
                          maxLength={60}
                          placeholder="Escribe tu país de destino"
                          className={field}
                        />
                      )}
                    </>
                  )}

                  {error && <p className="text-xs text-red-400">{error}</p>}

                  {/* Verificación anti-bots. El div queda vacío hasta que
                      Cloudflare inyecta el widget (ver useEffect de arriba).
                      El backend SIEMPRE revalida este token — este widget
                      por sí solo no bloquea nada. */}
                  <div ref={turnstileContainerRef} className="flex justify-center py-1" />

                  <button
                    type="submit"
                    disabled={busy || items.length === 0 || !turnstileToken}
                    className="group w-full h-16 flex flex-col items-center justify-center gap-1 bg-white text-black border border-white hover:bg-transparent hover:text-white transition-colors disabled:opacity-40"
                  >
                    {busy ? (
                      <span className="text-xs tracking-[0.2em] uppercase font-semibold">Preparando pago…</span>
                    ) : (
                      <>
                        <span className="text-[9px] tracking-[0.2em] uppercase text-black/50 group-hover:text-white/50 transition-colors">Pagar de forma segura</span>
                        <span className="flex items-center gap-3">
                          <img src="/images/wompi-white.png" alt="Wompi" className="h-4 w-auto invert group-hover:invert-0 transition-[filter]" />
                          <span className="text-black/20 group-hover:text-white/20 text-sm leading-none transition-colors">×</span>
                          <img src="/images/bancolombia-white.png" alt="Bancolombia" className="h-3.5 w-auto invert group-hover:invert-0 transition-[filter]" />
                        </span>
                      </>
                    )}
                  </button>
                  <WompiVerifiedBadge className="justify-center" />
                  {isInternational ? (
                    <p className="text-[10px] text-white/45 leading-relaxed">
                      Pago internacional: precio fijo en dólares. Tu camisa se hace a mano y se
                      despacha 1 semana después de la compra; el envío internacional se coordina
                      aparte con nuestro equipo.
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
                  {totals && (
                    <div className="text-sm text-white/70 space-y-1 border-t border-white/10 pt-3">
                      <div className="flex justify-between font-semibold text-white">
                        <span>Total</span>
                        <span>
                          {totals.currency === "USD" ? formatUsd(totals.total) : formatCop(totals.total)}
                        </span>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-white/70">
                    Tu pedido quedó registrado. Si el pago fue aprobado, tus camisas se elaboran a
                    mano y se despachan 1 semana después de la compra. Cualquier duda escríbenos
                    por Instagram.
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
