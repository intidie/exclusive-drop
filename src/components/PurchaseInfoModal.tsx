import { AnimatePresence, motion } from "motion/react";
import { CONTACT } from "@/lib/drop-data";

export default function PurchaseInfoModal({
  open,
  onClose,
  whatsappHref,
}: {
  open: boolean;
  onClose: () => void;
  whatsappHref: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Cómo se coordina tu compra"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg bg-white text-black border border-black"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
              <p className="text-[10px] tracking-[0.3em] uppercase">Antes de continuar</p>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="w-9 h-9 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              <h3 className="text-2xl font-black tracking-tight">Tu pago se acuerda en el chat.</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Al entrar al chat de WhatsApp o Instagram coordinamos contigo el método de pago de
                forma amable y con una experiencia totalmente personalizada: elegimos juntos lo que
                más cómodo te quede.
              </p>
              <p className="text-sm font-semibold border border-black px-4 py-3">
                Incluso puedes pagar <span className="underline">contraentrega</span>: pagas en
                efectivo cuando recibas tu camisa.
              </p>
              <p className="text-xs text-neutral-600">
                También: Nequi · Daviplata · Bancolombia · PayPal · Wise · BTC / ETH / USDT.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center h-13 py-4 px-6 bg-black text-white text-xs tracking-[0.2em] uppercase font-semibold border border-black hover:bg-white hover:text-black transition-colors"
                >
                  Continuar en WhatsApp
                </a>
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center py-4 px-6 text-xs tracking-[0.2em] uppercase font-semibold border border-black hover:bg-black hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
