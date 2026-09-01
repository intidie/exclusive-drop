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
            className="bg-black text-white w-full max-w-5xl max-h-[92vh] overflow-y-auto border border-white/25 relative"
          >
            <div className="sticky top-0 z-10 flex justify-end p-2 bg-white border-b border-white/10">
              <button
                onClick={onClose}
                aria-label="Cerrar"
                type="button"
                className="w-11 h-11 flex items-center justify-center border border-white/25 text-2xl leading-none active:bg-black active:text-white hover:bg-white hover:text-black transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 md:p-10 pt-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">Guía</p>
            <h3 className="text-2xl md:text-4xl font-display tracking-wide mt-1">
              Tallas — Medidas en cm
            </h3>
            <p className="text-sm text-white/60 mt-2">
              La camisa es <strong>talla única (oversize)</strong>. Estas son las medidas
              equivalentes en XL y XXL, tomadas con la prenda tendida.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-6 items-center">
              <ShirtDiagram />
              <div className="space-y-4">
                {SIZE_GUIDE.map((s) => (
                  <div key={s.size} className="border border-white/25 p-4">
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

            <div className="mt-10 flex flex-col gap-8">
              <figure>
                <img
                  src={sizeFront.url}
                  alt="Medidas frontales de la camisa talla XL"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain border border-white/25 bg-white"
                />
                <figcaption className="mt-3 text-sm tracking-[0.2em] uppercase text-white/60">
                  Frente
                </figcaption>
              </figure>
              <figure>
                <img
                  src={sizeBack.url}
                  alt="Medidas traseras de la camisa talla XL"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain border border-white/25 bg-white"
                />
                <figcaption className="mt-3 text-sm tracking-[0.2em] uppercase text-white/60">
                  Espalda
                </figcaption>
              </figure>
            </div>

            <p className="mt-6 text-xs text-white/45">
              ±1cm de tolerancia. Para dudas, escríbenos por Instagram antes de comprar.
            </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ShirtDiagram() {
  return (
    <svg viewBox="0 0 220 260" className="w-full max-w-xs mx-auto">
      <g fill="none" stroke="white" strokeWidth="1.5">
        {/* T-shirt silhouette — blanco para verse sobre el fondo oscuro del modal */}
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
