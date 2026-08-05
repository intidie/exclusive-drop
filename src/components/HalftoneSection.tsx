import { motion } from "motion/react";

export default function HalftoneSection() {
  return (
    <section className="relative bg-black text-white py-16 md:py-24 px-6 grain scanlines overflow-hidden border-t border-white/10">
      <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg relative"
        >
          <img
            src="/images/halftone-face.webp"
            alt="Serigrafía halftone INTI(t)"
            width={900}
            height={849}
            loading="lazy"
            decoding="async"
            className="w-full h-auto invert contrast-150 mix-blend-screen opacity-90 glitch"
          />
          <div className="absolute inset-0 pointer-events-none scanlines" />
        </motion.div>
        <p className="micro mt-6 text-white/45 text-center">Serigrafía · half-tone · 45°</p>
      </div>
    </section>
  );
}
