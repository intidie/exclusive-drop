import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const TERMS = [
  {
    t: "Pedidos y reservas",
    d: "El pedido se confirma únicamente tras coordinar pago por WhatsApp. La reserva se mantiene por 24 horas; pasado ese tiempo la unidad vuelve a stock.",
  },
  {
    t: "Pagos",
    d: "Aceptamos Nequi y Pago Contraentrega en Colombia. Para pagos internacionales: PayPal, Wise, billeteras digitales y criptomonedas (BTC, ETH, USDT/USDC). El precio referencia se calcula a una TRM de 4.000 COP/USD; el valor final en cripto/USD se confirma al momento del pago.",
  },
  {
    t: "Envíos",
    d: "Envío nacional en Colombia (3-7 días hábiles) y envíos internacionales a cualquier parte del mundo (7-21 días hábiles según destino). El comprador asume el costo del envío y posibles impuestos/aduanas del país de destino, salvo indicación contraria.",
  },
  {
    t: "Cambios y devoluciones",
    d: "Por tratarse de un drop limitado de edición única, no hay devoluciones por cambio de opinión. Solo se aceptan cambios por defectos de fábrica reportados dentro de las 48 horas tras la entrega, con foto y empaque original.",
  },
  {
    t: "Stock limitado",
    d: "El drop está limitado a 6 unidades. Una vez agotado no se reimprime ni se vuelve a producir.",
  },
  {
    t: "Datos personales",
    d: "Los datos compartidos por WhatsApp (nombre, dirección, contacto) se usan únicamente para procesar y enviar tu pedido. No se comparten con terceros ajenos al envío.",
  },
];

export default function TermsSection() {
  return (
    <section id="terms" className="bg-black text-white py-24 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeUp}>
          <p className="text-xs tracking-[0.3em] uppercase mb-3">Legal</p>
          <h2 className="text-3xl md:text-5xl font-display tracking-wide">
            Términos y condiciones
          </h2>
          <p className="mt-3 text-sm text-white/60 max-w-xl">
            Compras, pedidos y políticas del drop LIVE LEAKS by INTI(t).
          </p>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {TERMS.map((item, i) => (
            <motion.div
              key={item.t}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="border border-white/25 p-5"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 text-lg font-display tracking-wide">{item.t}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{item.d}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-xs text-white/45 tracking-wide">
          Al apartar tu camisa por WhatsApp aceptas estos términos. Última actualización: 2026.
        </p>
      </div>
    </section>
  );
}
