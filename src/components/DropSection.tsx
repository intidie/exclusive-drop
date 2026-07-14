import { motion } from "motion/react";
import { useState } from "react";
import { DROP, waLink, CONTACT } from "@/lib/drop-data";
import CountdownTimer from "./CountdownTimer";
import ProductZoom from "./ProductZoom";
import SizeGuideModal from "./SizeGuideModal";
import NequiCheckoutModal from "./NequiCheckoutModal";
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
  const [nequiOpen, setNequiOpen] = useState(false);
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
          Drop limitado y único — pocas unidades disponibles.
        </p>
      </motion.div>

      <motion.article {...fadeUp} className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div className="grid grid-cols-1 gap-4">
          {p.images.map((src, i) => (
            <ProductZoom
              key={i}
              src={src}
              alt={`${p.name} vista ${i + 1}`}
              eager={i === 0}
              fit="contain"
              zoom
              zoomOrigin={i === 1 ? "top" : "center"}
            />
          ))}
        </div>


        <div className="flex flex-col gap-6 md:sticky md:top-10">
          <div>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight">{p.name}</h3>
            <div className="mt-2 flex items-baseline gap-3 flex-wrap">
              <span className="text-base text-neutral-400 line-through">
                {formatCOP(p.originalPrice)}
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase bg-red-600 text-white px-2 py-0.5">
                Oferta
              </span>
              <CountdownTimer />
            </div>
            <p className="mt-1 text-4xl md:text-5xl font-black tracking-tight animate-price-flash">
              {formatCOP(p.price)}
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              ≈ {formatUSD(Math.round(p.price / USD_TRM))} USD{" "}
              <span className="text-xs opacity-60">(TRM {formatCOP(USD_TRM)}/USD)</span>
            </p>
            <a
              href={`https://www.instagram.com/${CONTACT.instagramHandle.replace("@", "")}/`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center justify-center h-11 px-5 text-xs tracking-[0.2em] uppercase font-semibold border border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
            >
              Pedir descuento · Sigue {CONTACT.instagramHandle}
            </a>
          </div>

          <p className="text-xs tracking-[0.2em] uppercase text-neutral-600">
            Edición limitada · {DROP.totalUnits} camisas totales · Quedan {DROP.available} disponibles
          </p>

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
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center justify-center h-12 px-6 border border-black text-sm font-medium bg-black text-white">
                XL (Oversize)
              </div>
              <div className="inline-flex items-center justify-center h-12 px-6 border border-black text-sm font-medium bg-neutral-100 text-neutral-400 line-through">
                XXL · Agotado
              </div>
            </div>
          </div>


          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={soldOut}
              onClick={() => setNequiOpen(true)}
              className={`inline-flex items-center justify-center h-14 px-8 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 ${
                soldOut
                  ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                  : "bg-[#da0081] text-white hover:bg-black border border-[#da0081] hover:border-black"
              }`}
            >
              {soldOut ? "Agotado" : "Pagar con Nequi"}
            </button>
            <a
              href={waLink(`Producto: ${p.name} — Talla XL`)}
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
        </div>
      </motion.article>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <NequiCheckoutModal open={nequiOpen} onClose={() => setNequiOpen(false)} />
    </section>
  );
}

