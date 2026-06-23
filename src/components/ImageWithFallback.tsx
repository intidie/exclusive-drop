import { useState, type ImgHTMLAttributes } from "react";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
       <rect width='400' height='400' fill='#111'/>
       <text x='50%' y='50%' fill='#666' font-family='monospace' font-size='18' text-anchor='middle' dominant-baseline='middle'>IMAGE UNAVAILABLE</text>
     </svg>`,
  );

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className = "",
  loading = "lazy",
  decoding = "async",
  ...rest
}: Props) {
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-neutral-900" aria-hidden />
      )}
      <img
        {...rest}
        src={current}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== fallbackSrc) setCurrent(fallbackSrc);
          setLoaded(true);
        }}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default ImageWithFallback;
