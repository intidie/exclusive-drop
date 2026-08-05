export default function FlickerSection() {
  return (
    <section className="relative bg-black text-white py-14 md:py-20 px-6 overflow-hidden grain">
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        <img
          src="/images/heart-scan.webp"
          alt="INTI(t) heart scan"
          width={736}
          height={736}
          loading="lazy"
          decoding="async"
          className="w-[75vw] max-w-lg h-auto invert mix-blend-screen animate-flicker-frenetic"
        />
      </div>
    </section>
  );
}
