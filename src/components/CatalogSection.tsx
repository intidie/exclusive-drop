import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PRODUCTS, PRICE } from "@/lib/drop-data";

const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function CatalogSection() {
  return (
    <section id="drop" className="relative bg-black text-white pt-10 md:pt-14 pb-24 md:pb-32 px-6 grain scanlines overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform, opacity" }}
          className="mb-8 md:mb-12 flex flex-col items-center text-center"
        >
          <img
            src="/images/inti-net-logo.webp"
            alt="inti-net"
            width={1774}
            height={887}
            loading="lazy"
            decoding="async"
            className="w-full max-w-md md:max-w-lg h-auto glitch animate-logo-pulse"
          />
          <img
            src="/images/eternity-ornament.webp"
            alt=""
            aria-hidden
            width={1199}
            height={628}
            loading="lazy"
            decoding="async"
            className="w-full max-w-xs md:max-w-sm h-auto -mt-2 opacity-40 mix-blend-screen animate-decor-drift"
          />
          <p className="micro mt-4 text-white/45">Catálogo · 05 piezas · edición única</p>

        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-white/15">
          {PRODUCTS.map((p, i) => (
            <Link
              key={p.slug}
              to="/producto/$slug"
              params={{ slug: p.slug }}
              className="group relative block bg-black transition-colors duration-300 hover:bg-white/[0.04]"
            >
              <div className="absolute top-0 left-0 z-10 px-2 py-1 micro text-white/60 bg-black/60">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="aspect-[4/5] overflow-hidden bg-neutral-950">
                <img
                  src={p.image}
                  alt={p.name}
                  width={1200}
                  height={1500}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover contrast-125 transition-all duration-700 ease-out md:grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
              <div className="p-3 md:p-4">
                <p className="micro text-white/40">{p.tag}</p>
                <h3 className="mt-1 text-lg md:text-2xl font-display tracking-wide leading-none">{p.name}</h3>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-mono text-white/70">{formatCOP(p.price ?? PRICE)}</p>
                  {p.slug === "machine-girl" && (
                    <span className="text-[9px] tracking-[0.15em] uppercase bg-red-600 text-white px-1.5 py-0.5">
                      Oferta única
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
