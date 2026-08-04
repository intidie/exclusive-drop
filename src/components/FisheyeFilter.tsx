/**
 * SVG barrel-distortion (fisheye) filter shared by the hero composition.
 * The displacement map is a static PNG served from /images so it works
 * identically in dev, preview and on Vercel.
 */
export default function FisheyeFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <filter id="hero-fisheye" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feImage
          href="/images/fisheye-map.png"
          preserveAspectRatio="none"
          x="0"
          y="0"
          width="100%"
          height="100%"
          result="map"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale="240"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
