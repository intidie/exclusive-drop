import { motion } from "motion/react";
import FaultyTerminal from "./FaultyTerminal.jsx";
import liveLeakLogo from "@/assets/liveleak-logo-transparent.png";
import shirtGif from "@/assets/camisa-3d.gif.asset.json";

export default function Hero({ start = true }: { start?: boolean }) {
  return (
    <section className="relative w-full h-[100svh] bg-black overflow-hidden">
      <div className="absolute inset-0">
        <FaultyTerminal
          scale={1.4}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1.6}
          pause={false}
          scanlineIntensity={1.6}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.4}
          tint="#ffffff"
          mouseReact={false}
          mouseStrength={0.6}
          pageLoadAnimation={false}
          brightness={0.45}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 pointer-events-none" />

      {/* REC indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-5 left-5 z-20 flex items-center gap-2"
      >
        <motion.span
          className="block w-3 h-3 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.9)]"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-white/90 font-mono text-xs tracking-[0.3em]">REC</span>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none">
        {/* Floating 3D shirt gif popup */}
        <motion.img
          src={shirtGif.url}
          alt="Camisa 3D"
          loading="eager"
          decoding="async"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={
            start
              ? { opacity: [0, 1, 1, 1], scale: 1, y: [0, -10, 0, -8, 0] }
              : {}
          }
          transition={{
            opacity: { duration: 0.8, ease: "easeOut" },
            scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
          }}
          className="w-28 sm:w-36 md:w-44 mb-2 drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)] pointer-events-none"
        />

        <motion.img
          src={liveLeakLogo}
          alt="LiveLeak"
          loading="eager"
          decoding="async"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={start ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-40 sm:w-52 md:w-64 mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
        />

        <motion.h1
          initial={{ opacity: 0, scale: 0.7, filter: "blur(10px)" }}
          animate={
            start
              ? {
                  scale: 1,
                  filter: "blur(0px)",
                  opacity: [0, 1, 0.55, 1, 0.7, 1],
                }
              : {}
          }
          transition={{
            scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            filter: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
          }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white"
          style={{
            WebkitTextStroke: "2px #000",
            textShadow: "0 4px 14px rgba(0,0,0,0.55), 0 0 30px rgba(255,255,255,0.15)",
          }}
        >
          LIVE LEAKS!!!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={start ? { opacity: [0, 1, 0.5, 1] } : {}}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.3,
          }}
          className="mt-3 text-sm sm:text-base md:text-lg font-mono tracking-[0.4em] text-white uppercase"
          style={{
            WebkitTextStroke: "1px #000",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          DROP BY INTI(t)
        </motion.p>
      </div>
    </section>
  );
}
