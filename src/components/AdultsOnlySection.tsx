import { motion } from "motion/react";
import adultsOnly from "@/assets/adults-only.png.asset.json";

export default function AdultsOnlySection() {
  return (
    <section className="relative bg-black text-white py-20 md:py-28 px-6 overflow-hidden">
      {/* noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          animation: "noiseShift 0.8s steps(4) infinite",
        }}
      />
      <style>{`
        @keyframes noiseShift {
          0% { transform: translate(0,0); }
          25% { transform: translate(-6px,4px); }
          50% { transform: translate(4px,-6px); }
          75% { transform: translate(-3px,-3px); }
          100% { transform: translate(0,0); }
        }
        @keyframes spin3d {
          0% { transform: perspective(800px) rotateY(0deg) rotateX(8deg); }
          100% { transform: perspective(800px) rotateY(360deg) rotateX(8deg); }
        }
      `}</style>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.4em] uppercase font-mono text-red-500"
        >
          Warning // Mature Content
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          style={{ width: 220, height: 320 }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              animation: "spin3d 6s linear infinite",
            }}
          >
            <img
              src={adultsOnly.url}
              alt="Adults Only 18+"
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.25)] invert"
            />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-4xl font-black tracking-tight"
        >
          DROP RESERVADO PARA MAYORES
        </motion.h2>
      </div>
    </section>
  );
}
