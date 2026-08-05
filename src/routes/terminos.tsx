import { createFileRoute, Link } from "@tanstack/react-router";
import TermsSection from "@/components/TermsSection";
import SiteFooter from "@/components/SiteFooter";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y condiciones — LIVE LEAKS by INTI(t)" },
      {
        name: "description",
        content:
          "Condiciones de compra, pagos, envíos, cambios y datos personales del drop LIVE LEAKS by INTI(t).",
      },
      { property: "og:title", content: "Términos y condiciones — INTI(t)" },
      { property: "og:description", content: "Compras, pedidos y políticas del drop LIVE LEAKS." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terminos" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/terminos" }],
  }),

  component: TerminosPage,
});

function TerminosPage() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <nav className="px-6 py-5 border-b border-white/10">
        <Link to="/" className="text-xs tracking-[0.3em] uppercase hover:opacity-60">
          ← Volver
        </Link>
      </nav>
      <TermsSection />
      <SiteFooter />
    </div>
  );
}
