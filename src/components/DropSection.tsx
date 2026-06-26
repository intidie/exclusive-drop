import { motion } from "motion/react";
import { useState } from "react";
import { DROP, waLink } from "@/lib/drop-data";
import ProductZoom from "./ProductZoom";
import SizeGuideModal from "./SizeGuideModal";
import shirtGif from "@/assets/camisa-3d.gif.asset.json";

const USD_TRM = 4000;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function DropSection() {
  const p = DROP.product;
  const [guideOpen, setGuideOpen] = useState(false);
  const soldOut = p.stock === 0;

  return (
    <section id="drop" className="bg-white text-black py-24 md:py-32 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto flex justify-center mb-10"
      >
        <img
          src={shirtGif.url}
          alt="Camisa 3D girando"
          loading="lazy"
          decoding="async"
          className="w-40 sm:w-56 md:w-64 drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
        />
      </motion.div>

      <motion.div {...fadeUp} className="max-w-6xl mx-auto mb-16 md:mb-24">
        <p className="text-xs tracking-[0.3em] uppercase mb-3">El Drop</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight">{DROP.name}</h2>
        <p className="mt-4 text-sm md:text-base text-neutral-600 max-w-xl">
          Edición limitada de {DROP.totalUnits} unidades en total. Una vez agotadas, no se reimprimen.
        </p>
      </motion.div>

      <motion.article {...fadeUp} className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div className="grid grid-cols-1 gap-4">
          {p.images.map((src, i) => (
            <ProductZoom key={i} src={src} alt={`${p.name} vista ${i + 1}`} eager={i === 0} />
          ))}
        </div>


        <div className="flex flex-col gap-6 md:sticky md:top-10">
          <div>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight">{p.name}</h3>
            <p className="mt-2 text-lg font-semibold">{formatCOP(p.price)}</p>
            <p className="text-sm text-neutral-600">
              ≈ {formatUSD(Math.round(p.price / USD_TRM))} USD{" "}
              <span className="text-xs opacity-60">(TRM {formatCOP(USD_TRM)}/USD)</span>
            </p>
          </div>

          <StockIndicator stock={p.stock} total={DROP.totalUnits} />

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs tracking-[0.2em] uppercase">Talla</p>
              <button
                onClick={() => setGuideOpen(true)}
                className="text-xs tracking-[0.2em] uppercase underline underline-offset-4 hover:opacity-60"
              >
                Guía de tallas
              </button>
            </div>
            <div className="inline-flex items-center justify-center h-12 px-6 border border-black text-sm font-medium bg-black text-white">
              Talla Única (Oversize)
            </div>
          </div>

          <a
            href={waLink(`Producto: ${p.name} — Talla Única`)}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center h-14 px-8 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 ${
              soldOut
                ? "bg-neutral-200 text-neutral-500 cursor-not-allowed pointer-events-none"
                : "bg-black text-white hover:bg-white hover:text-black border border-black"
            }`}
          >
            {soldOut ? "Agotado" : "Apartar por WhatsApp"}
          </a>
        </div>
      </motion.article>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </section>
  );
}

function StockIndicator({ stock, total }: { stock: number; total: number }) {
  const pct = (stock / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs tracking-[0.2em] uppercase mb-2">
        <span>Stock</span>
        <span>
          Solo {stock}/{total} restantes
        </span>
      </div>
      <div className="h-px w-full bg-neutral-200 relative">
        <motion.div
          className="absolute left-0 top-0 h-px bg-black"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
