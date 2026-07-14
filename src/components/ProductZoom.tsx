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
  fit = "cover",
  zoom = true,
  zoomOrigin = "center",
}: {
  src: string;
  alt: string;
  eager?: boolean;
  fit?: "cover" | "contain";
  zoom?: boolean;
  zoomOrigin?: "center" | "top" | "bottom";
}) {
  const [errored, setErrored] = useState(false);

  const originClass =
    zoomOrigin === "top"
      ? "origin-top"
      : zoomOrigin === "bottom"
        ? "origin-bottom"
        : "origin-center";

  return (
    <div
      className={`group relative w-full overflow-hidden bg-neutral-100 ${
        zoom ? "cursor-zoom-in" : ""
      } ${fit === "contain" ? "aspect-square" : "aspect-[4/5]"}`}
    >
      <img
        src={errored ? FALLBACK : src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        // @ts-expect-error native HTML attribute
        fetchpriority={eager ? "high" : "auto"}
        decoding="async"
        draggable={false}
        onError={() => setErrored(true)}
        className={`w-full h-full select-none ${
          zoom
            ? `transition-transform duration-500 ease-out group-hover:scale-[1.6] ${originClass}`
            : ""
        } ${fit === "contain" ? "object-contain" : "object-cover"}`}
        style={zoom ? { willChange: "transform" } : undefined}
      />
    </div>
  );
}
