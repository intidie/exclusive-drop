import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";

const AdultsOnlySection = lazy(() => import("@/components/AdultsOnlySection"));
const CatalogSection = lazy(() => import("@/components/CatalogSection"));
const DropBySection = lazy(() => import("@/components/DropBySection"));
const InfoLinksSection = lazy(() => import("@/components/InfoLinksSection"));
const SiteFooter = lazy(() => import("@/components/SiteFooter"));
const FloatingContact = lazy(() => import("@/components/FloatingContact"));


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LIVE LEAKS by INTI(t) — Drop único" },
      {
        name: "description",
        content:
          "Drop exclusivo de camisas LIVE LEAKS by INTI(t). 5 piezas, todas las tallas. Pagos locales, internacionales y cripto.",
      },
      { property: "og:title", content: "LIVE LEAKS by INTI(t) — Drop único" },
      { property: "og:description", content: "Drop exclusivo de camisas. 5 piezas, todas las tallas disponibles." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
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
    <div className="bg-black text-black min-h-screen font-sans">
      <LoadingScreen onDone={() => setLoaderGone(true)} />
      <Hero start={loaderGone} />
      <Suspense fallback={null}>
        <AdultsOnlySection />
        <CatalogSection />
        <DropBySection />
        <InfoLinksSection />

        <SiteFooter />
        <FloatingContact />
      </Suspense>
    </div>
  );
}
