import { motion } from "motion/react";
import { useState } from "react";
import { DROP, waLink } from "@/lib/drop-data";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

export default function DropSection() {
  return (
    <section id="drop" className="bg-white text-black py-24 md:py-32 px-6">
      <motion.div {...fadeUp} className="max-w-6xl mx-auto mb-16 md:mb-24">
        <p className="text-xs tracking-[0.3em] uppercase mb-3">El Drop</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight">{DROP.name}</h2>
        <p className="mt-4 text-sm md:text-base text-neutral-600 max-w-xl">
          Edición limitada de {DROP.totalUnits} unidades en total. Una vez agotadas, no se reimprimen.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid gap-20 md:gap-28">
        {DROP.products.map((p, i) => (
          <ProductCard key={p.id} product={p} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, reverse }: { product: typeof DROP.products[number]; reverse: boolean }) {
  const [size, setSize] = useState<string | null>(null);
  const soldOut = product.stock === 0;

  return (
    <motion.article
      {...fadeUp}
      className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      <motion.div
        className="relative aspect-[3/4] bg-neutral-50 overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.4 }}
      >
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
      </motion.div>

      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-2xl md:text-4xl font-black tracking-tight">{product.name}</h3>
          <p className="mt-2 text-lg">{formatCOP(product.price)}</p>
        </div>

        <StockIndicator stock={product.stock} total={DROP.totalUnits} />

        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-3">Talla</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                disabled={soldOut}
                className={`w-12 h-12 border border-black text-sm font-medium transition-all duration-200 hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed ${
                  size === s ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <a
          href={waLink(`Producto: ${product.name}${size ? ` — Talla ${size}` : ""}`)}
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
  );
}

function StockIndicator({ stock, total }: { stock: number; total: number }) {
  const pct = (stock / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs tracking-[0.2em] uppercase mb-2">
        <span>Stock</span>
        <span>Solo {stock}/{total} restantes</span>
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
