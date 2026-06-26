import { motion } from "motion/react";
import { useState } from "react";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 750'><rect width='600' height='750' fill='#f4f4f4'/><text x='50%' y='50%' fill='#999' font-family='monospace' font-size='28' text-anchor='middle' dominant-baseline='middle'>INTI(t)</text></svg>`,
  );

export default function ProductZoom({
  src,
  alt,
  eager = false,
}: {
  src: string;
  alt: string;
  eager?: boolean;
}) {
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-100 cursor-zoom-in"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-neutral-200" />}
      <motion.img
        src={current}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"

        onLoad={() => setLoaded(true)}
        onError={() => {
          setCurrent(FALLBACK);
          setLoaded(true);
        }}
        animate={{ scale: hover ? 1.6 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full object-cover select-none"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
        draggable={false}
      />
    </div>
  );
}
