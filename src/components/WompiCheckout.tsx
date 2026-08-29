import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT, PRICE, waLink } from "@/lib/drop-data";

type Props = {
  open: boolean;
  onClose: () => void;
  productSlug: string;
  productName: string;
  size: string;
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

export default function WompiCheckout({ open, onClose, productSlug, productName, size }: Props) {
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setPhase("form");
      setError(null);
      setBusy(false);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const amountInCents = PRICE * 100;
    const currency = "COP";

    try {
      const publicKey = (import.meta.env["VITE_WOMPI_PUBLIC_KEY"] as string | undefined) ?? "";

      const { data, error: dbError } = await supabase
        .from("orders")
        .insert({
          product_slug: productSlug,
          product_name: productName,
          size,
          amount_in_cents: amountInCents,
          currency,
          status: "pending",
          reference: crypto.randomUUID(),
          customer_name: String(fd.get("name") ?? ""),
          customer_phone: String(fd.get("phone") ?? ""),
          shipping_city: String(fd.get("city") ?? ""),
          shipping_address: String(fd.get("address") ?? ""),
        })
        .select("id")
        .single();

      if (dbError || !data) throw new Error("No pudimos registrar tu pedido.");

      await loadWidget();
      const Widget = window.WidgetCheckout;
      if (!Widget) throw new Error("No pudimos cargar el checkout de Wompi.");

      new Widget({
        currency,
        amountInCents,
        reference: data.id as string,
        publicKey,
        redirectUrl: `${window.location.origin}/producto/${productSlug}`,
      }).open(() => {
        setPhase("sent");
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
                    Paga con tarjeta, PSE, Nequi o Bancolombia a través de Wompi.
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

              {phase === "sent" && (
                <div className="space-y-4 py-4">
                  <h3 className="text-3xl font-display tracking-wide">Pedido registrado</h3>
                  <p className="text-sm text-white/70">
                    Tu pedido de {productName} (talla {size}) quedó registrado. Si el pago fue
                    aprobado, tu camisa se elabora a mano y se despacha 1 semana después de la
                    compra. Cualquier duda escríbenos a {CONTACT.whatsappDisplay}.
                  </p>
                  <a
                    href={waLink(`Pedido: ${productName} — Talla ${size}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-4 text-xs tracking-[0.2em] uppercase font-semibold border border-white/25 hover:bg-white hover:text-black transition-colors"
                  >
                    Coordinar entrega por WhatsApp
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
