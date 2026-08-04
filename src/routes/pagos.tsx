import { createFileRoute, Link } from "@tanstack/react-router";
import CheckoutSection from "@/components/CheckoutSection";
import SiteFooter from "@/components/SiteFooter";

export const Route = createFileRoute("/pagos")({
  head: () => ({
    meta: [
      { title: "Métodos de pago y envíos — LIVE LEAKS by INTI(t)" },
      {
        name: "description",
        content:
          "Nequi, contraentrega, PayPal, billeteras digitales y cripto (BTC, ETH, USDT). Envíos a Colombia y a todo el mundo.",
      },
      { property: "og:title", content: "Métodos de pago y envíos — INTI(t)" },
      { property: "og:description", content: "Pagos locales, internacionales y cripto. Envíos worldwide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PagosPage,
});

function PagosPage() {
  return (
    <div className="bg-white text-black min-h-screen font-sans">
      <nav className="px-6 py-5 border-b border-black/10">
        <Link to="/" className="text-xs tracking-[0.3em] uppercase hover:opacity-60">
          ← Volver
        </Link>
      </nav>
      <CheckoutSection />
      <SiteFooter />
    </div>
  );
}
