import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { CONTACT, DROP, waLink } from "@/lib/drop-data";

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function NequiCheckoutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<"number" | "amount" | null>(null);
  const p = DROP.product;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const copy = async (value: string, key: "number" | "amount") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* noop */
    }
  };

  const confirmMsg = `Hola! Ya pagué por Nequi ${formatCOP(p.price)} para apartar la camisa ${p.name} — Talla XL. Adjunto comprobante.`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black w-full max-w-lg max-h-[92vh] overflow-y-auto border border-black"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-3 bg-white border-b border-black/10">
              <p className="text-xs tracking-[0.3em] uppercase pl-2">Checkout · Nequi</p>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                type="button"
                className="w-11 h-11 flex items-center justify-center border border-black text-2xl leading-none active:bg-black active:text-white hover:bg-black hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                Paga con Nequi
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Sigue los 3 pasos y envíanos el comprobante por WhatsApp para confirmar tu pedido.
              </p>

              <div className="mt-6 border border-black">
                <div className="flex items-center justify-between p-4 border-b border-black/10">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">Producto</p>
                    <p className="text-sm font-semibold">{p.name} · Talla XL</p>
                  </div>
                </div>
                <button
                  onClick={() => copy(String(p.price), "amount")}
                  className="w-full flex items-center justify-between p-4 border-b border-black/10 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">Monto a pagar</p>
                    <p className="text-xl font-black">{formatCOP(p.price)}</p>
                  </div>
                  <span className="text-[10px] tracking-[0.3em] uppercase border border-black px-3 py-2">
                    {copied === "amount" ? "Copiado" : "Copiar"}
                  </span>
                </button>
                <button
                  onClick={() => copy(CONTACT.nequiNumber, "number")}
                  className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">Número Nequi · {CONTACT.nequiHolder}</p>
                    <p className="text-xl font-black font-mono">{CONTACT.nequiNumber}</p>
                  </div>
                  <span className="text-[10px] tracking-[0.3em] uppercase border border-black px-3 py-2">
                    {copied === "number" ? "Copiado" : "Copiar"}
                  </span>
                </button>
              </div>

              <ol className="mt-6 space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-black text-xs font-black">1</span>
                  <span>Abre la app <strong>Nequi</strong> y ve a <strong>Enviar</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-black text-xs font-black">2</span>
                  <span>Ingresa el número, transfiere el monto exacto y guarda el comprobante.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-black text-xs font-black">3</span>
                  <span>Envíanos el comprobante por WhatsApp para confirmar tu pedido y coordinar envío.</span>
                </li>
              </ol>

              <a
                href={waLink(confirmMsg)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center h-14 px-8 bg-black text-white text-sm tracking-[0.2em] uppercase font-semibold border border-black hover:bg-white hover:text-black transition-all duration-300"
              >
                Ya pagué · Enviar comprobante
              </a>

              <p className="mt-4 text-xs text-neutral-500 text-center">
                Tu pedido se aparta cuando confirmamos el pago.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
