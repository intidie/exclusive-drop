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
  const [errored, setErrored] = useState(false);

  return (
    <div className="group relative w-full aspect-[4/5] overflow-hidden bg-neutral-100 cursor-zoom-in">
      <img
        src={errored ? FALLBACK : src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        // @ts-expect-error native HTML attribute
        fetchpriority={eager ? "high" : "auto"}
        decoding="async"
        draggable={false}
        onError={() => setErrored(true)}
        className="w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-[1.6]"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
