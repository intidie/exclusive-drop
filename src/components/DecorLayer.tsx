/**
 * Decorative skeleton sketch repeated down the whole page (inverted, no background).
 * Purely visual: fixed, non-interactive, very low opacity.
 * Each decoration is rendered as a sharp centre layer plus a blurred edge layer
 * so the middle stays crisp while the borders feather out smoothly.
 */
function DecorImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`relative ${className}`} style={style}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain opacity-[0.65] mix-blend-screen animate-decor-drift decor-sharp"
      />
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain opacity-[0.65] mix-blend-screen animate-decor-drift decor-blur"
        aria-hidden
      />
    </div>
  );
}

export default function DecorLayer() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <DecorImage
        src="/images/decor-skeleton.webp"
        alt=""
        className="absolute -left-20 top-[4%] w-72 md:w-[28rem] lg:w-[32rem]"
      />
      <DecorImage
        src="/images/decor-skeleton.webp"
        alt=""
        className="absolute -right-24 top-[40%] w-80 md:w-[32rem] lg:w-[36rem] scale-x-[-1]"
        style={{ animationDelay: "-6s" }}
      />
      <DecorImage
        src="/images/decor-skeleton.webp"
        alt=""
        className="absolute left-[6%] bottom-[-10%] w-44 md:w-64 lg:w-72 rotate-12"
        style={{ animationDelay: "-12s" }}
      />
    </div>
  );
}
