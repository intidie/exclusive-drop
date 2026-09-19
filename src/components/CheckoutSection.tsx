import { motion } from "motion/react";
import { WompiVerifiedBadge, WompiBancolombiaLogos } from "@/components/TrustBadges";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const METHODS = [
  { tag: "Wompi", title: "Tarjeta débito / crédito", desc: "Visa, Mastercard y Amex procesadas de forma segura por Wompi." },
  { tag: "Wompi", title: "PSE", desc: "Débito directo desde tu cuenta bancaria en Colombia." },
  { tag: "Wompi", title: "Nequi", desc: "Aprueba el pago desde tu app Nequi en segundos." },
  { tag: "Wompi", title: "Botón Bancolombia", desc: "Paga con tu cuenta de ahorros o corriente Bancolombia." },
  { tag: "Wompi", title: "Corresponsales y efectivo", desc: "Genera tu recibo y paga en efectivo en los puntos habilitados por Wompi." },
  { tag: "Internacional", title: "Tarjetas internacionales (precio en USD)", desc: "Si compras desde fuera de Colombia, ves el precio fijo en dólares, pero el cobro se procesa en pesos colombianos con la misma pasarela de Wompi." },
];

export default function CheckoutSection() {
  return (
    <section id="checkout" className="bg-black text-white py-24 md:py-32 px-6 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp}>
          <p className="text-xs tracking-[0.3em] uppercase mb-3">Métodos de pago & envíos</p>
          <h2 className="text-4xl md:text-6xl font-display tracking-wide">Paga seguro con Wompi.</h2>
          <p className="mt-4 text-sm md:text-base text-white/60 max-w-2xl">
            Todos los pagos se procesan a través de la pasarela Wompi, siempre en pesos
            colombianos: tarjeta, PSE, Nequi, botón Bancolombia y efectivo en corresponsales para
            Colombia; tarjeta internacional con precio fijo mostrado en dólares si compras desde
            fuera del país.
          </p>
          <p className="mt-2 text-sm text-white/50 max-w-2xl">
            Talla XXL tiene un recargo de $15.000. Envío nacional gratis en compras superiores a
            $250.000; por debajo de ese monto el envío corre por cuenta del comprador y no se
            cobra por Wompi. Los envíos internacionales tampoco se cobran por Wompi, salvo la
            opción ultra-económica (solo México), que sí se suma al total.
          </p>
          <WompiVerifiedBadge className="mt-4" />
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {METHODS.map((m) => (
            <PaymentCard key={m.title} {...m} />
          ))}
        </div>

        <motion.div {...fadeUp} className="mt-12 border border-white/25 p-6 md:p-8">
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">Aviso</p>
          <h3 className="mt-2 text-2xl md:text-3xl font-display tracking-wide">
            Envíos internacionales
          </h3>
          <p className="mt-3 text-sm text-white/60">
            Ya puedes comprar desde fuera de Colombia con precio fijo en dólares. En el formulario
            de pago eliges entre tres opciones de envío: Express y Económica (costo y días de
            llegada aproximados, calculados automáticamente con Envia.com) y Ultra-económica.
            El valor de Express y Económica es un aproximado, lo paga el cliente a la
            transportadora y es responsabilidad exclusiva de la transportadora, no de Inti Net.
          </p>
          <p className="mt-3 text-xs text-amber-300/90 border border-amber-300/30 bg-amber-300/5 px-3 py-2 leading-relaxed">
            <span className="font-bold text-red-500">(Válida solo para México)</span>{" "}
            Ultra-económica (transportadora 4-72): llega entre 15 y 25 días y tiene un valor fijo
            de $83.050 COP que SÍ se suma a tu pago con Wompi. Es la única opción de envío que
            modifica el valor de Wompi; ninguna otra lo hace.
          </p>
          <p className="mt-3 text-xs text-amber-300/90 border border-amber-300/30 bg-amber-300/5 px-3 py-2 leading-relaxed">
            ⚠ El cobro real se procesa en pesos colombianos (COP) a la TRM oficial del día
            (Banco de la República) que se muestra en el checkout. No somos responsables por la
            tasa de cambio o comisiones que aplique el banco o la entidad emisora de tu tarjeta
            al convertir el monto a tu moneda local.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mt-8">
          <WompiBancolombiaLogos />
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
      className="border border-white/25 p-6 md:p-8 transition-colors duration-300 hover:bg-white hover:text-black group"
    >
      <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">{tag}</p>
      <h3 className="mt-2 text-xl font-display tracking-wide">{title}</h3>
      <p className="mt-3 text-sm opacity-80">{desc}</p>
    </motion.div>
  );
}
