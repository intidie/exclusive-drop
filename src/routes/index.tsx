import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";

const AdultsOnlySection = lazy(() => import("@/components/AdultsOnlySection"));
const CatalogSection = lazy(() => import("@/components/CatalogSection"));
const HalftoneSection = lazy(() => import("@/components/HalftoneSection"));
const DropBySection = lazy(() => import("@/components/DropBySection"));
const FlickerSection = lazy(() => import("@/components/FlickerSection"));
const InfoLinksSection = lazy(() => import("@/components/InfoLinksSection"));
const SiteFooter = lazy(() => import("@/components/SiteFooter"));
const FloatingContact = lazy(() => import("@/components/FloatingContact"));
const DecorLayer = lazy(() => import("@/components/DecorLayer"));



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "INTInet - LIVE LEAKS by INTI(t)" },
      {
        name: "description",
        content:
          "Drop exclusivo de camisas LIVE LEAKS by INTI(t). Todas las tallas, pago seguro con Wompi y envíos nacionales.",
      },
      { property: "og:title", content: "INTInet - LIVE LEAKS by INTI(t)" },
      { property: "og:description", content: "Drop exclusivo de camisas LIVE LEAKS by INTI(t), con todas las tallas disponibles." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "https://inti-net.vercel.app/images/liveleak-logo-transparent.webp" },
      { name: "twitter:image", content: "https://inti-net.vercel.app/images/liveleak-logo-transparent.webp" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "icon", href: "/favicon.png" },
      { rel: "preload", as: "image", href: "/images/machine_girl.webp", fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "LIVE LEAKS by INTI(t)",
          url: "https://inti-net.vercel.app",
          sameAs: ["https://www.instagram.com/intitnet/"],
        }),
      },
    ],

  }),
  component: Index,
});

function Index() {
  // Hero mounts immediately behind the loader so WebGL initializes during load.
  const [loaderGone, setLoaderGone] = useState(false);

  return (
    <div className="relative bg-black text-black min-h-screen font-sans">
      <LoadingScreen onDone={() => setLoaderGone(true)} />
      <Hero start={loaderGone} />
      <Suspense fallback={null}>
        <DecorLayer />
      </Suspense>
      <div className="relative z-10">
        <Suspense fallback={null}>
          <AdultsOnlySection />
          <CatalogSection />
          <HalftoneSection />
          <DropBySection />
          <FlickerSection />
          <InfoLinksSection />

          <SiteFooter />
          <FloatingContact />
        </Suspense>
      </div>
    </div>

  );
}
