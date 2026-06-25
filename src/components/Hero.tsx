import { motion } from "motion/react";
import FaultyTerminal from "./FaultyTerminal.jsx";
import liveLeakLogo from "@/assets/liveleak-logo-transparent.png";

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
          initial={{ opacity: 0, scale: 0.85 }}
          animate={
            start
              ? { scale: 1, opacity: [0, 1, 0, 1, 0, 1] }
              : {}
          }
          transition={{
            scale: { duration: 0.3, ease: "easeOut" },
            opacity: { duration: 1.2, times: [0, 0.25, 0.5, 0.75, 0.9, 1], repeat: Infinity, repeatDelay: 0.4, ease: "linear" },
          }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white"
          style={{
            WebkitTextStroke: "4px #000",
            textShadow: "0 4px 14px rgba(0,0,0,0.65), 0 0 30px rgba(255,255,255,0.15)",
          }}
        >
          LIVE LEAKS!!!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={start ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-3 text-sm sm:text-base md:text-lg font-mono tracking-[0.4em] uppercase"
          style={{
            color: "#ffffff",
            textShadow: "0 2px 0 #000, 0 0 6px #000, 0 0 14px rgba(0,0,0,0.9)",
          }}
        >
          DROP BY INTI(t)
        </motion.p>
      </div>
    </section>
  );
}
