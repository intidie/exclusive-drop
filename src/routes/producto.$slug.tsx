import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, PRODUCTS, PRICE, ORIGINAL_PRICE, USD_TRM, SIZES, CONTACT, PRINT_SPEC, XXL_SURCHARGE_COP } from "@/lib/drop-data";
import CountdownTimer from "@/components/CountdownTimer";
import SizeGuideModal from "@/components/SizeGuideModal";
import { useCart } from "@/lib/cart-context";
import { useDisplayCurrency } from "@/lib/use-currency";


const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export const Route = createFileRoute("/producto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Producto no disponible — INTI(t)" }, { name: "robots", content: "noindex" }] };
    const { product } = loaderData;
    const url = `/producto/${product.slug}`;
    return {
      meta: [
        { title: `${product.name} — LIVE LEAKS by INTI(t)` },
        { name: "description", content: product.description.slice(0, 155) },
        { property: "og:title", content: `${product.name} — LIVE LEAKS by INTI(t)` },
        { property: "og:description", content: product.description.slice(0, 155) },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "preload", as: "image", href: product.image, fetchpriority: "high" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: `https://inti-net.vercel.app${product.image}`,
            brand: { "@type": "Brand", name: "INTI(t)" },
            offers: {
              "@type": "Offer",
              price: product.price ?? PRICE,
              priceCurrency: "COP",
              availability: "https://schema.org/InStock",
              url: `https://inti-net.vercel.app${url}`,
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
});


function ProductPage() {
  const { product } = Route.useLoaderData();
  const price = product.price ?? PRICE;
  const [size, setSize] = useState("XL");
  const [guideOpen, setGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [everAdded, setEverAdded] = useState(false);
  const { addItem, openCart } = useCart();
  const { format, formatAlt, isInternational } = useDisplayCurrency();

  function handleAddToCart() {
    addItem({ slug: product.slug, name: product.name, size });
    setEverAdded(true);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <main className="bg-black text-white min-h-screen font-sans grain">
      <header className="relative z-10 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-mono text-sm md:text-[10px] tracking-[0.34em] uppercase font-semibold hover:opacity-60">
          ← INTI(t)
        </Link>
        <a
          href={CONTACT.instagram}
          target="_blank"
          rel="noreferrer"
          className="micro hover:opacity-60"
        >
          {CONTACT.instagramHandle}
        </a>
      </header>

      <article className="max-w-6xl mx-auto px-6 py-10 md:py-16 grid md:grid-cols-2 gap-8 md:gap-16 items-start relative z-10">
        <div className="grid gap-4">
          {/* Cuando subas la foto trasera, agrégala como segundo elemento en
              el arreglo `images` de este producto en src/lib/drop-data.ts —
              esta galería ya muestra automáticamente todas las fotos que
              tenga el producto, no necesita ningún cambio de código. */}
          {product.images.map((src: string, i: number) => (
            <div key={src} className="aspect-[4/5] overflow-hidden bg-neutral-950 hairline group cursor-zoom-in">
              <img
                src={src}
                alt={`${product.name} vista ${i + 1}`}
                width={1200}
                height={1500}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 md:sticky md:top-10">
          <div>
            <p className="micro opacity-50">{product.tag}</p>
            <h1 className="mt-2 text-4xl md:text-6xl font-display tracking-wide leading-none">{product.name}</h1>
            <div className="mt-3 flex items-baseline gap-3 flex-wrap">
              <span className="text-base text-white/40 line-through">{format(ORIGINAL_PRICE)}</span>
              <span className="text-[10px] tracking-[0.3em] uppercase bg-red-600 text-white px-2 py-0.5">Oferta</span>
              <CountdownTimer />
            </div>
            <p className="mt-1 text-4xl md:text-5xl font-black tracking-tight animate-price-flash">
              {format(price)}
            </p>
            {!isInternational && (
              <p className="text-sm text-white/60 mt-1 font-mono">
                ≈ {formatAlt(price)}{" "}
                <span className="text-xs opacity-60">(TRM {formatCOP(USD_TRM)}/USD)</span>
              </p>
            )}
            <p className="text-xs text-white/50 mt-1">
              Talla XXL: +{format(XXL_SURCHARGE_COP)} adicionales.
            </p>
            {isInternational && (
              <p className="text-xs text-white/45 mt-2 leading-relaxed">
                Precios en dólares calculados con TRM fija de {formatCOP(USD_TRM)}/USD. El cobro se
                procesa en pesos colombianos (COP); no somos responsables por la conversión ni por
                los cargos que aplique el banco emisor de tu tarjeta.
              </p>
            )}
          </div>

          <p className="text-sm text-white/70 leading-relaxed">{product.description}</p>

          <p className="micro font-semibold hairline px-3 py-2 leading-relaxed">
            {PRINT_SPEC}
          </p>


          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="micro">Talla</p>
              <button
                onClick={() => setGuideOpen(true)}
                className="micro underline underline-offset-4 hover:opacity-60"
              >
                Guía de tallas
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`inline-flex items-center justify-center h-12 px-6 hairline text-sm font-mono transition-colors ${
                    size === s ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center h-14 px-8 micro font-semibold bg-white text-black border border-white hover:bg-transparent hover:text-white transition-colors"
          >
            {justAdded ? "Agregado ✓" : "Agregar al carrito"}
          </button>
          {everAdded && (
            <button type="button" onClick={openCart} className="micro underline underline-offset-4 text-left hover:opacity-60">
              Ver carrito →
            </button>
          )}

          <p className="text-xs text-white/55 leading-relaxed">
            Pago seguro con Wompi: tarjeta, PSE, Nequi, botón Bancolombia y efectivo.
            Envío nacional gratis en compras superiores a $250.000 (solo Colombia); por debajo de
            ese monto el envío corre por cuenta del comprador y se coordina aparte.
          </p>


          <p className="micro text-white/55">
            Drop limitado y único — pocas unidades por talla.
          </p>
        </div>
      </article>

      <section className="max-w-6xl mx-auto px-6 pb-20 relative z-10">
        <p className="micro mb-6 text-white/50">Más del drop</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PRODUCTS.filter((p) => p.slug !== product.slug).map((p) => (
            <Link key={p.slug} to="/producto/$slug" params={{ slug: p.slug }} className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-neutral-950 hairline">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale contrast-125 group-hover:grayscale-0"
                />
              </div>
              <p className="mt-2 text-base font-display tracking-wide">{p.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </main>
  );
}
