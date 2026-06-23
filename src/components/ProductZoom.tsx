import { useRef, useState } from "react";
import { motion } from "motion/react";

export default function ProductZoom({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

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
      className="relative aspect-[3/4] bg-neutral-50 overflow-hidden cursor-zoom-in select-none"
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hover ? 1.18 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${pos.x}% ${pos.y}%` }}
      />
      {/* magnifier lens */}
      {hover && (
        <div
          className="pointer-events-none absolute hidden md:block w-40 h-40 rounded-full border border-black/40 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
          style={{
            left: `calc(${pos.x}% - 80px)`,
            top: `calc(${pos.y}% - 80px)`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "300% 300%",
            backgroundPosition: `${pos.x}% ${pos.y}%`,
          }}
        />
      )}
    </div>
  );
}
