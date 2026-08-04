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
      { property: "og:description", content: "Drop exclusivo de camisas. 5 piezas, edición limitada." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/favicon.png" },
      { rel: "preload", as: "image", href: "/images/machine_girl.webp", fetchpriority: "high" },
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
        <CheckoutSection />
        <TermsSection />
        <SiteFooter />
        <FloatingContact />
      </Suspense>
    </div>
  );
}
