import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import shirtFront from "@/assets/shirt-front.png.asset.json";

const AdultsOnlySection = lazy(() => import("@/components/AdultsOnlySection"));
const DropSection = lazy(() => import("@/components/DropSection"));
const DropBySection = lazy(() => import("@/components/DropBySection"));
const CheckoutSection = lazy(() => import("@/components/CheckoutSection"));
const TermsSection = lazy(() => import("@/components/TermsSection"));
const SiteFooter = lazy(() => import("@/components/SiteFooter"));
const FloatingContact = lazy(() => import("@/components/FloatingContact"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LIVE LEAKS by INTI(t) — Drop único" },
      {
        name: "description",
        content:
          "Drop exclusivo de camisas LIVE LEAKS by INTI(t). Edición limitada de 6 unidades. Pago por Nequi o contraentrega.",
      },
      { property: "og:title", content: "LIVE LEAKS by INTI(t) — Drop único" },
      { property: "og:description", content: "Drop exclusivo de camisas. Edición limitada de 6 unidades." },
    ],
    links: [
      { rel: "icon", href: "/favicon.png" },
      // Preload LCP product image so it's hot once the user scrolls.
      { rel: "preload", as: "image", href: shirtWolf.url, fetchpriority: "high" },
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
        <DropSection />
        <DropBySection />
        <CheckoutSection />
        <TermsSection />
        <SiteFooter />
        <FloatingContact />
      </Suspense>
    </div>
  );
}
