import { motion } from "motion/react";
import intitPack from "@/assets/intit-pack.png.asset.json";

export default function DropBySection() {
  return (
    <section className="bg-black text-white py-12 md:py-16 px-6">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs md:text-sm tracking-[0.5em] uppercase font-mono text-white/70"
        >
          Drop By:
        </motion.p>

        <motion.img
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.04 }}
          src={intitPack.url}
          alt="INTI(t) Pleasure Pack"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='#111'/><text x='50%' y='50%' fill='#fff' font-family='monospace' font-size='48' font-weight='900' text-anchor='middle' dominant-baseline='middle'>INTI(t)</text></svg>`,
              );
          }}
          className="w-full max-w-[220px] md:max-w-xs shadow-[0_20px_60px_rgba(255,255,255,0.08)]"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl font-black tracking-tight"
        >
          INTI(t)
        </motion.p>
      </div>
    </section>
  );
}
