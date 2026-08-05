import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PRODUCTS, PRICE } from "@/lib/drop-data";

const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function CatalogSection() {
  return (
    <section id="drop" className="relative bg-black text-white pt-10 md:pt-14 pb-24 md:pb-32 px-6 grain scanlines overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform, opacity" }}
          className="mb-6 md:mb-8 flex flex-col items-center text-center"
        >
          <img
            src="/images/inti-net-logo.webp"
            alt="inti-net"
            width={1200}
            height={600}
            loading="lazy"
            decoding="async"
            className="w-full max-w-md md:max-w-lg h-auto"
          />
        </motion.div>





        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {PRODUCTS.map((p, i) => (
            <Link
              key={p.slug}
              to="/producto/$slug"
              params={{ slug: p.slug }}
              className="group block border border-black/10 hover:border-black transition-colors"
            >
              <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                <img
                  src={p.image}
                  alt={p.name}
                  width={1200}
                  height={1500}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-3 md:p-4">
                <p className="text-[10px] tracking-[0.25em] uppercase opacity-50">{p.tag}</p>
                <h3 className="mt-1 text-sm md:text-base font-black tracking-tight">{p.name}</h3>
                <p className="mt-1 text-sm">{formatCOP(PRICE)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
