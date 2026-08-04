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
    <section className="bg-white text-black py-20 md:py-24 px-6 border-t border-black/10">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-4">
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
              className="block h-full border border-black p-6 md:p-8 hover:bg-black hover:text-white transition-colors duration-300"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">{l.tag}</p>
              <h3 className="mt-2 text-xl md:text-2xl font-black tracking-tight">{l.title}</h3>
              <p className="mt-3 text-sm opacity-80">{l.desc}</p>
              <p className="mt-5 text-xs tracking-[0.3em] uppercase underline underline-offset-4">Ver más →</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
