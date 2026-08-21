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
    d: "El pedido se confirma únicamente cuando el pago es aprobado por la pasarela Wompi. Mientras la transacción esté pendiente la unidad no queda reservada.",
  },
  {
    t: "Pagos",
    d: "Todos los pagos se procesan exclusivamente a través de Wompi: tarjeta débito/crédito, PSE, Nequi, botón Bancolombia y efectivo en corresponsales. No aceptamos otros medios de pago. El monto es calculado y validado en nuestro servidor; nunca manejamos los datos de tu tarjeta.",
  },
  {
    t: "Envíos",
    d: "Solo envíos nacionales dentro de Colombia. Cada camisa es realizada a mano, por lo que el despacho se hace 1 semana después de la compra. El tiempo de entrega adicional depende de la región del país donde te encuentres. PRÓXIMAMENTE ENVÍOS INTERNACIONALES.",
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
    d: "Los datos de envío (nombre, teléfono, dirección, ciudad) se usan únicamente para procesar y despachar tu pedido. Los datos de pago son gestionados directamente por Wompi y nunca se almacenan en nuestros servidores.",
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
