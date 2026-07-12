import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { SIZE_GUIDE } from "@/lib/drop-data";
import sizeFront from "@/assets/size-front.png.asset.json";
import sizeBack from "@/assets/size-back.png.asset.json";

export default function SizeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
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
            className="bg-white text-black w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-10 border border-black relative"
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors"
            >
              ×
            </button>
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">Guía</p>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight mt-1">
              Tallas — Medidas en cm
            </h3>
            <p className="text-sm text-neutral-600 mt-2">
              La camisa es <strong>talla única (oversize)</strong>. Estas son las medidas
              equivalentes en XL y XXL, tomadas con la prenda tendida.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-6 items-center">
              <ShirtDiagram />
              <div className="space-y-4">
                {SIZE_GUIDE.map((s) => (
                  <div key={s.size} className="border border-black p-4">
                    <p className="text-xs tracking-[0.3em] uppercase opacity-60">Talla</p>
                    <p className="text-3xl font-black">{s.size}</p>
                    <ul className="mt-3 text-sm space-y-1 font-mono">
                      <li>A · Pecho: <strong>{s.chest} cm</strong></li>
                      <li>B · Largo: <strong>{s.length} cm</strong></li>
                      <li>C · Hombro a hombro: <strong>{s.shoulder} cm</strong></li>
                      <li>D · Manga: <strong>{s.sleeve} cm</strong></li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-xs text-neutral-500">
              ±1cm de tolerancia. Para dudas, escríbenos por WhatsApp antes de apartar.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ShirtDiagram() {
  return (
    <svg viewBox="0 0 220 260" className="w-full max-w-xs mx-auto">
      <g fill="none" stroke="black" strokeWidth="1.5">
        {/* T-shirt silhouette */}
        <path d="M50 40 L90 25 Q110 45 130 25 L170 40 L200 70 L175 95 L165 80 L165 230 L55 230 L55 80 L45 95 L20 70 Z" />
      </g>
      {/* Measurement lines */}
      <g stroke="#dc2626" strokeWidth="1" fill="#dc2626" fontSize="10" fontFamily="monospace">
        {/* A - chest */}
        <line x1="55" y1="130" x2="165" y2="130" />
        <text x="105" y="125" textAnchor="middle">A</text>
        {/* B - length */}
        <line x1="180" y1="40" x2="180" y2="230" />
        <text x="190" y="140">B</text>
        {/* C - shoulder */}
        <line x1="55" y1="55" x2="165" y2="55" />
        <text x="105" y="50" textAnchor="middle">C</text>
        {/* D - sleeve */}
        <line x1="20" y1="70" x2="45" y2="95" />
        <text x="10" y="85">D</text>
      </g>
    </svg>
  );
}
