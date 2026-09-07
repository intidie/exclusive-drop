/**
 * Decorative skeleton sketch repeated down the whole page (inverted, no background).
 * Purely visual: fixed, non-interactive, very low opacity.
 */
export default function DecorLayer() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <img
        src="/images/decor-skeleton.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute -left-16 top-[6%] w-40 md:w-64 opacity-[0.30] mix-blend-screen animate-decor-drift"
      />
      <img
        src="/images/decor-skeleton.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute -right-20 top-[42%] w-48 md:w-72 opacity-[0.08] mix-blend-screen scale-x-[-1] animate-decor-drift"
        style={{ animationDelay: "-6s" }}
      />
      <img
        src="/images/decor-skeleton.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute left-[8%] bottom-[-8%] w-36 md:w-56 opacity-[0.07] mix-blend-screen rotate-12 animate-decor-drift"
        style={{ animationDelay: "-12s" }}
      />
    </div>
  );
}
