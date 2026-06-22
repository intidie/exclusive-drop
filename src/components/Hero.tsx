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
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none">
        <BlurText
          text="Drop unico LIVE LEAKS by intit"
          delay={120}
          animateBy="words"
          direction="top"
          className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white justify-center"
        />
      </div>
    </section>
  );
}
