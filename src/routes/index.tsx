import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import DropSection from "@/components/DropSection";
import CheckoutSection from "@/components/CheckoutSection";
import SiteFooter from "@/components/SiteFooter";
import FloatingContact from "@/components/FloatingContact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LIVE LEAKS by intit — Drop único" },
      { name: "description", content: "Drop exclusivo de camisas LIVE LEAKS by intit. Edición limitada de 6 unidades. Pago por Nequi o contraentrega." },
      { property: "og:title", content: "LIVE LEAKS by intit — Drop único" },
      { property: "og:description", content: "Drop exclusivo de camisas. Edición limitada de 6 unidades." },
    ],
    links: [{ rel: "icon", href: "/favicon.png" }],
  }),
  component: Index,
});

function Index() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="bg-white text-black min-h-screen font-sans">
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <Hero />
      <DropSection />
      <CheckoutSection />
      <SiteFooter />
      <FloatingContact />
    </div>
  );
}
