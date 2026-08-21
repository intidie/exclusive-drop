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
          "Pagos seguros con Wompi: tarjeta, PSE, Nequi y Bancolombia. Envíos nacionales en Colombia.",
      },
      { property: "og:title", content: "Métodos de pago y envíos — INTI(t)" },
      { property: "og:description", content: "Pago seguro con Wompi. Envíos nacionales; próximamente internacionales." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/pagos" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/pagos" }],
  }),

  component: PagosPage,
});

function PagosPage() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <nav className="px-6 py-5 border-b border-white/10">
        <Link to="/" className="text-xs tracking-[0.3em] uppercase hover:opacity-60">
          ← Volver
        </Link>
      </nav>
      <CheckoutSection />
      <SiteFooter />
    </div>
  );
}
