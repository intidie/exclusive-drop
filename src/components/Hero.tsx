import { motion } from "motion/react";
import FaultyTerminal from "./FaultyTerminal.jsx";
import FisheyeFilter from "./FisheyeFilter";

const liveLeakLogo = "/images/liveleak-logo-transparent.webp";

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
          curvature={1.15}
          tint="#ffffff"
          pageLoadAnimation={false}
          brightness={0.45}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 pointer-events-none" />

      {/* REC indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-5 left-5 z-20 flex items-center gap-2"
      >
        <span
          className="block w-3 h-3 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.9)]"
          style={{ animation: "ll-strobe 1.2s steps(1, end) infinite", willChange: "opacity" }}
        />
        <span className="text-white/90 font-mono text-xs tracking-[0.3em]">REC</span>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none">
        <motion.img
          src={liveLeakLogo}
          alt="LiveLeak"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={start ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-40 sm:w-52 md:w-64 mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
        />

        {/* Strobe runs on GPU via CSS keyframes, no Framer per-frame work. */}
        <h1
          className={`text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white ${start ? "animate-strobe" : "opacity-0"}`}
          style={{
            WebkitTextStroke: "5px #000",
            textShadow: "0 4px 14px rgba(0,0,0,0.65), 0 0 30px rgba(255,255,255,0.15)",
          }}
        >
          LIVE LEAKS!!!
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={start ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-3 text-sm sm:text-base md:text-lg font-mono tracking-[0.4em] uppercase"
          style={{
            color: "#ffffff",
            textShadow: "0 2px 0 #000, 0 0 6px #000, 0 0 14px rgba(0,0,0,0.9)",
          }}
        >
          DROP BY INTI(t)
        </motion.p>
      </div>

      <motion.a
        href="#drop"
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors"
        style={{ textShadow: "0 0 8px #000" }}
      >
        <span className="text-[10px] tracking-[0.35em] uppercase font-mono">
          Baja para más información
        </span>
        <span className="animate-bounce text-sm leading-none">↓</span>
      </motion.a>
    </section>
  );
}
