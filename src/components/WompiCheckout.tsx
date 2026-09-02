import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT, FREE_SHIPPING_THRESHOLD_COP, PRICE, PRODUCTS, XXL_SURCHARGE_COP } from "@/lib/drop-data";
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

// Borrador del formulario guardado SOLO en este dispositivo (localStorage),
// nunca en el servidor. Así, si el formulario se cierra por accidente, no
// hay que volver a escribir todo.
const DRAFT_KEY = "inti-checkout-draft-v1";
type Draft = { name: string; phone: string; email: string; city: string; address: string };
const EMPTY_DRAFT: Draft = { name: "", phone: "", email: "", city: "", address: "" };

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

// Estimado de precio para la interfaz (barra de envío gratis, etc.). El
// monto real que se cobra SIEMPRE lo calcula el servidor con los precios
// vigentes en Supabase — esto es solo una vista previa.
function estimateUnitPrice(slug: string, size: string) {
  const base = PRODUCTS.find((p) => p.slug === slug)?.price ?? PRICE;
  return base + (size === "XXL" ? XXL_SURCHARGE_COP : 0);
}

export default function WompiCheckout({ open, onClose, items }: Props) {
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [totals, setTotals] = useState<{ subtotalCop: number; totalCop: number } | null>(null);

  useEffect(() => {
    if (open) setDraft(loadDraft());
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPhase("form");
      setError(null);
      setBusy(false);
      setTotals(null);
    }
  }, [open]);

  function updateDraft(patch: Partial<Draft>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      saveDraft(next);
      return next;
    });
  }

  const estimatedSubtotal = items.reduce((sum, i) => sum + estimateUnitPrice(i.slug, i.size) * i.qty, 0);
  const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_COP - estimatedSubtotal);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      if (items.length === 0) throw new Error("Tu carrito está vacío.");

      // El precio, el stock, la referencia y la firma de integridad los
      // calcula el servidor (ver src/routes/api.checkout.ts). El cliente
      // nunca decide cuánto se cobra ni descuenta el inventario.
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
        }),
      });

      const checkout = (await res.json().catch(() => null)) as {
        reference?: string;
        amountInCents?: number;
        currency?: string;
        publicKey?: string;
        signature?: string;
        subtotalCop?: number;
        totalCop?: number;
        error?: string;
      } | null;

      if (!res.ok || !checkout?.reference || !checkout.signature) {
        throw new Error(checkout?.error ?? "No pudimos registrar tu pedido.");
      }

      if (checkout.subtotalCop != null && checkout.totalCop != null) {
        setTotals({ subtotalCop: checkout.subtotalCop, totalCop: checkout.totalCop });
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

                  {missingForFreeShipping > 0 ? (
                    <p className="text-[11px] text-white/50">
                      Agrega ${missingForFreeShipping.toLocaleString("es-CO")} más y el envío es
                      gratis (solo Colombia).
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-400">
                      Tu compra supera $250.000 — el envío nacional es gratis.
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
                    placeholder="Nombre completo"
                    className={field}
                  />
                  <input
                    value={draft.phone}
                    onChange={(e) => updateDraft({ phone: e.target.value })}
                    required
                    maxLength={25}
                    placeholder="Teléfono"
                    className={field}
                  />
                  <input
                    value={draft.email}
                    onChange={(e) => updateDraft({ email: e.target.value })}
                    type="email"
                    maxLength={120}
                    placeholder="Correo (opcional)"
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
                  <input
                    value={draft.address}
                    onChange={(e) => updateDraft({ address: e.target.value })}
                    required
                    maxLength={160}
                    placeholder="Dirección de envío"
                    className={field}
                  />
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={busy || items.length === 0}
                    className="w-full h-16 flex flex-col items-center justify-center gap-1 bg-black border border-white/25 hover:border-white transition-colors disabled:opacity-40"
                  >
                    {busy ? (
                      <span className="text-xs tracking-[0.2em] uppercase font-semibold">Preparando pago…</span>
                    ) : (
                      <>
                        <span className="text-[9px] tracking-[0.2em] uppercase text-white/50">Pagar de forma segura</span>
                        <span className="flex items-center gap-3">
                          <img src="/images/wompi-white.png" alt="Wompi" className="h-4 w-auto" />
                          <span className="text-white/20 text-sm leading-none">×</span>
                          <img src="/images/bancolombia-white.png" alt="Bancolombia" className="h-3.5 w-auto" />
                        </span>
                      </>
                    )}
                  </button>
                  <WompiVerifiedBadge className="justify-center" />
                  <p className="text-[10px] text-white/45 leading-relaxed">
                    Envío nacional: tu camisa se hace a mano y se despacha 1 semana después de la
                    compra. Envío gratis en compras superiores a $250.000 (solo Colombia); por
                    debajo de ese monto, el envío corre por cuenta del comprador y se coordina
                    aparte.
                  </p>
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
                        <span>${totals.totalCop.toLocaleString("es-CO")}</span>
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
