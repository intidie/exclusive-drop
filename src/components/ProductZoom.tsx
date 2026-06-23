import { useRef, useState } from "react";
import { motion } from "motion/react";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'><rect width='600' height='800' fill='#f4f4f4'/><text x='50%' y='50%' fill='#999' font-family='monospace' font-size='22' text-anchor='middle' dominant-baseline='middle'>IMAGE UNAVAILABLE</text></svg>`,
  );

export default function ProductZoom({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={onMove}
      className="relative aspect-[3/4] bg-neutral-100 overflow-hidden cursor-zoom-in select-none"
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-neutral-200" aria-hidden />}
      <motion.img
        src={current}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== FALLBACK) setCurrent(FALLBACK);
          setLoaded(true);
        }}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hover ? 1.18 : 1, opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${pos.x}% ${pos.y}%` }}
      />
      {hover && loaded && (
        <div
          className="pointer-events-none absolute hidden md:block w-40 h-40 rounded-full border border-black/40 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
          style={{
            left: `calc(${pos.x}% - 80px)`,
            top: `calc(${pos.y}% - 80px)`,
            backgroundImage: `url(${current})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "300% 300%",
            backgroundPosition: `${pos.x}% ${pos.y}%`,
          }}
        />
      )}
    </div>
  );
}
