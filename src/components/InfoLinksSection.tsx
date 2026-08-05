import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

const LINKS = [
  {
    to: "/pagos" as const,
    tag: "Pagos & envíos",
    title: "Paga como prefieras",
    desc: "Nequi, contraentrega, PayPal, billeteras y cripto. Envíos a Colombia y worldwide.",
  },
  {
    to: "/terminos" as const,
    tag: "Legal",
    title: "Términos y condiciones",
    desc: "Compras, pedidos, envíos, cambios y datos personales del drop.",
  },
];

export default function InfoLinksSection() {
  return (
    <section className="relative bg-black text-white py-20 md:py-24 px-6 border-t border-white/10 grain">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-4 relative z-10">
        {LINKS.map((l, i) => (
          <motion.div
            key={l.to}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={l.to}
              className="block h-full hairline p-6 md:p-8 transition-colors duration-300 hover:bg-white hover:text-black"
            >
              <p className="micro opacity-50">{l.tag}</p>
              <h3 className="mt-3 text-2xl md:text-3xl font-display tracking-wide leading-none">{l.title}</h3>
              <p className="mt-3 text-sm opacity-70">{l.desc}</p>
              <p className="mt-5 micro underline underline-offset-4">Ver más →</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
