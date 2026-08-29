import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import { createWompiSignature, getOrderStatus } from "@/lib/orders.functions";
import { CONTACT, waLink } from "@/lib/drop-data";

type Props = {
  open: boolean;
  onClose: () => void;
  productSlug: string;
  productName: string;
  size: string;
};

type Phase = "form" | "waiting" | "approved" | "failed";

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
    s.onerror = () => reject(new Error("widget"));
    document.head.appendChild(s);
  });
}

export default function WompiCheckout({ open, onClose, productSlug, productName, size }: Props) {
  const createSignature = useServerFn(createWompiSignature);
  const checkStatus = useServerFn(getOrderStatus);

  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const orderRef = useRef<{ orderId: string; accessToken: string } | null>(null);

  useEffect(() => {
    if (!open) {
      setPhase("form");
      setError(null);
      setBusy(false);
      orderRef.current = null;
    }
  }, [open]);

  // Polling seguro del estado real (lo escribe el webhook con Service Role).
  useEffect(() => {
    if (phase !== "waiting" || !orderRef.current) return;
    let alive = true;
    const id = setInterval(async () => {
      try {
        const res = await checkStatus({ data: orderRef.current! });
        if (!alive) return;
        if (res.status === "approved") setPhase("approved");
        else if (res.status === "declined" || res.status === "error") setPhase("failed");
      } catch {
        /* reintenta en el siguiente ciclo */
      }
    }, 3000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [phase, checkStatus]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await createSignature({
        data: {
          productSlug,
          size,
          customerName: String(fd.get("name") ?? ""),
          customerPhone: String(fd.get("phone") ?? ""),
          shippingCity: String(fd.get("city") ?? ""),
          shippingAddress: String(fd.get("address") ?? ""),
        },
      });
      orderRef.current = { orderId: res.orderId, accessToken: res.accessToken };
      setPhase("waiting");

      const publicKey = res.publicKey || (import.meta.env["VITE_WOMPI_PUBLIC_KEY"] as string | undefined);
      if (!publicKey) throw new Error("Falta la llave pública de Wompi.");

      await loadWidget();
      const Widget = window.WidgetCheckout;
      if (!Widget) throw new Error("widget");
      new Widget({
        currency: res.currency,
        amountInCents: res.amountInCents,
        reference: res.reference,
        publicKey,
        signature: { integrity: res.signature },
        redirectUrl: `${window.location.origin}/producto/${productSlug}`,
      }).open(() => {
        /* El estado real llega por webhook; aquí no se confía en el callback. */
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos iniciar el pago.");
      setPhase("form");
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
          className="fixed inset-0 z-[100] bg-black/85 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Pago con Wompi"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg bg-black text-white border border-white/25 my-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sticky top-0 bg-black">
              <p className="text-[10px] tracking-[0.3em] uppercase">Pago seguro · Wompi</p>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="w-9 h-9 flex items-center justify-center border border-white/25 hover:bg-white hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              {phase === "form" && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <h3 className="text-2xl font-display tracking-wide">
                    {productName} · Talla {size}
                  </h3>
                  <p className="text-xs text-white/60">
                    El valor a pagar lo calcula nuestro servidor. Paga con tarjeta, PSE, Nequi o
                    Bancolombia a través de Wompi.
                  </p>
                  <input name="name" required maxLength={80} placeholder="Nombre completo" className={field} />
                  <input name="phone" required maxLength={25} placeholder="Teléfono / WhatsApp" className={field} />
                  <input name="city" required maxLength={60} placeholder="Ciudad" className={field} />
                  <input name="address" required maxLength={160} placeholder="Dirección de envío" className={field} />
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full h-14 text-xs tracking-[0.2em] uppercase font-semibold border border-white/25 hover:bg-white hover:text-black transition-colors disabled:opacity-40"
                  >
                    {busy ? "Preparando pago…" : "Pagar con Wompi"}
                  </button>
                  <p className="text-[10px] text-white/45 leading-relaxed">
                    Envío nacional: tu camisa se hace a mano y se despacha 1 semana después de la
                    compra. El tiempo de entrega varía según tu región.
                  </p>
                </form>
              )}

              {phase === "waiting" && (
                <div className="space-y-3 py-4">
                  <h3 className="text-2xl font-display tracking-wide animate-pulse">Esperando confirmación…</h3>
                  <p className="text-sm text-white/70">
                    Completa el pago en la ventana de Wompi. Confirmamos automáticamente cuando el
                    banco apruebe la transacción. No cierres esta ventana.
                  </p>
                </div>
              )}

              {phase === "approved" && (
                <div className="space-y-4 py-4">
                  <h3 className="text-3xl font-display tracking-wide">¡Pago aprobado!</h3>
                  <p className="text-sm text-white/70">
                    Tu pedido de {productName} (talla {size}) quedó registrado. Tu camisa se elabora a
                    mano y se despacha 1 semana después de la compra.
                  </p>
                  <a
                    href={waLink(`Pedido pagado: ${productName} — Talla ${size}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-4 text-xs tracking-[0.2em] uppercase font-semibold border border-white/25 hover:bg-white hover:text-black transition-colors"
                  >
                    Coordinar entrega por WhatsApp
                  </a>
                </div>
              )}

              {phase === "failed" && (
                <div className="space-y-4 py-4">
                  <h3 className="text-2xl font-display tracking-wide">Pago no completado</h3>
                  <p className="text-sm text-white/70">
                    La transacción fue rechazada o falló. Puedes intentarlo de nuevo o escribirnos a{" "}
                    {CONTACT.whatsappDisplay}.
                  </p>
                  <button
                    onClick={() => setPhase("form")}
                    className="w-full py-4 text-xs tracking-[0.2em] uppercase font-semibold border border-white/25 hover:bg-white hover:text-black transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
