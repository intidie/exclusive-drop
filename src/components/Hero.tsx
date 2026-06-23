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
          timeScale={1.9}
          pause={false}
          scanlineIntensity={1.9}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.5}
          tint="#ffffff"
          mouseReact={true}
          mouseStrength={1.1}
          pageLoadAnimation={false}
          brightness={0.5}
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={start ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-44 sm:w-56 md:w-72 mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
        />

        <div className="rounded-2xl px-6 py-4 bg-black/40 backdrop-blur-[2px] shadow-[0_0_60px_rgba(0,0,0,0.7)]">
          <motion.h1
            initial={{ opacity: 0, scale: 0.6, filter: "blur(12px)" }}
            animate={start ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
          >
            LIVE LEAKS!!!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={start ? { opacity: 1 } : {}}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-3 text-sm sm:text-base md:text-lg font-mono tracking-[0.4em] text-white/80 uppercase"
          >
            drop by intit
          </motion.p>
        </div>
      </div>
    </section>
  );
}
