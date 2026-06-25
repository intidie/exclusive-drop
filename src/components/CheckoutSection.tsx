import { motion } from "motion/react";
import { waLink } from "@/lib/drop-data";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const METHODS = [
  { tag: "Transferencia", title: "Nequi", desc: "Pago inmediato vía Nequi. Te enviamos el número al confirmar tu pedido." },
  { tag: "Al recibir", title: "Pago Contraentrega", desc: "Paga en efectivo cuando recibas tu camisa. Disponible en ciudades principales de Colombia." },
  { tag: "Internacional", title: "PayPal", desc: "Pago seguro desde cualquier parte del mundo en USD." },
  { tag: "Billeteras", title: "Daviplata · Bancolombia · Wise", desc: "Transferencias desde billeteras digitales y bancos internacionales." },
  { tag: "Crypto", title: "BTC · ETH · USDT", desc: "Aceptamos Bitcoin, Ethereum y stablecoins (USDT/USDC) en redes principales." },
  { tag: "Envío Worldwide", title: "Envíos Internacionales", desc: "Enviamos a cualquier parte del mundo. Costo y tiempo se cotizan por WhatsApp según destino." },
];

export default function CheckoutSection() {
  return (
    <section id="checkout" className="bg-white text-black py-24 md:py-32 px-6 border-t border-black/10">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp}>
          <p className="text-xs tracking-[0.3em] uppercase mb-3">Métodos de pago & envíos</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">Paga como prefieras.</h2>
          <p className="mt-4 text-sm md:text-base text-neutral-600 max-w-2xl">
            Aceptamos pagos locales e internacionales: Nequi, Pago Contraentrega, PayPal, billeteras digitales y criptomonedas (BTC, ETH, USDT). Enviamos a Colombia y a todo el mundo.
          </p>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {METHODS.map((m) => (
            <PaymentCard key={m.title} {...m} />
          ))}
        </div>

        <motion.div {...fadeUp} className="mt-12">
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center h-14 px-10 bg-black text-white text-sm tracking-[0.2em] uppercase font-semibold border border-black hover:bg-white hover:text-black transition-all duration-300"
          >
            Iniciar compra por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function PaymentCard({ tag, title, desc }: { tag: string; title: string; desc: string }) {
  return (
    <motion.div
      {...fadeUp}
      whileHover={{ y: -4 }}
      className="border border-black p-6 md:p-8 transition-colors duration-300 hover:bg-black hover:text-white group"
    >
      <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">{tag}</p>
      <h3 className="mt-2 text-xl font-black tracking-tight">{title}</h3>
      <p className="mt-3 text-sm opacity-80">{desc}</p>
    </motion.div>
  );
}
