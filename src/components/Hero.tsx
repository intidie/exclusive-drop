import FaultyTerminal from "./FaultyTerminal.jsx";
import BlurText from "./BlurText.jsx";

export default function Hero() {
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none">
        <div className="rounded-2xl px-6 py-4 bg-black/40 backdrop-blur-[2px] shadow-[0_0_60px_rgba(0,0,0,0.7)]">
          <BlurText
            text="LIVE LEAKS!!!"
            delay={120}
            animateBy="words"
            direction="top"
            className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight text-white justify-center drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
          />
          <p className="mt-3 text-sm sm:text-base md:text-lg font-mono tracking-[0.4em] text-white/80 uppercase">
            drop by intit
          </p>
        </div>
      </div>
    </section>
  );
}
