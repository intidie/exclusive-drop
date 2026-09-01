export const SIZES = ["S", "M", "L", "XL", "XXL"];

export const PRINT_SPEC =
  "Estampado en DTF máxima calidad. No le salen motas, máxima calidad.";

// El precio real que se cobra SIEMPRE lo valida el servidor contra la tabla
// `products`/`product_sizes` en Supabase (ver src/routes/api.checkout.ts).
// Estas constantes son solo para mostrar un estimado antes de pagar.
export const PRICE = 89999;
export const XXL_SURCHARGE_COP = 15000;

export const ORIGINAL_PRICE = 99999;
export const USD_TRM = 4000;

// Envío nacional (Colombia): gratis en compras superiores a este monto.
// Por debajo del umbral, el envío corre por cuenta del cliente y se
// coordina aparte (no se cobra a través de Wompi).
export const FREE_SHIPPING_THRESHOLD_COP = 250000;

export type Product = {
  slug: string;
  name: string;
  image: string;
  images: string[];
  tag: string;
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "machine-girl",
    name: "INTI(t) MACHINE GIRL",
    image: "/images/machine_girl.webp",
    images: ["/images/machine_girl.webp"],
    tag: "Footwork / Breakcore",
    description:
      "Camisa oversize negra con print full-front inspirado en el artwork japonés de breakcore. Tipografía kanji y gradientes ácidos sobre algodón pesado.",
  },
  {
    slug: "aphex",
    name: "INTI(t) AFX-47",
    image: "/images/aphex.webp",
    images: ["/images/aphex.webp"],
    tag: "Ambient / IDM",
    description:
      "Negro lavado con print AFX-47 en frente, logo circular morado y lettering INTI-net en caligrafía. Detalles en mangas.",
  },
  {
    slug: "creeper",
    name: "INTI(t) CREEPER",
    image: "/images/creeper.webp",
    images: ["/images/creeper.webp"],
    tag: "Cyber / Tribal",
    description:
      "Verde bosque con print pixelado y tribal cyber-sigil en negro. Prints laterales en ambas mangas.",
  },
  {
    slug: "2003",
    name: "INTI(t) 2003",
    image: "/images/2003.webp",
    images: ["/images/2003.webp"],
    tag: "Blur Series",
    description:
      "Blanco oversize con número 2003 en efecto de baja resolución. Print INTI-net en manga izquierda.",
  },
  {
    slug: "2005",
    name: "INTI(t) 2005",
    image: "/images/2005.webp",
    images: ["/images/2005.webp"],
    tag: "Blur Series",
    description:
      "Blanco oversize con número 2005 pixelado en alto contraste. Print INTI-net en manga izquierda.",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

// Medidas en cm (planas, prenda tendida).
export const SIZE_GUIDE = [
  { size: "S", chest: 52, length: 68, shoulder: 48, sleeve: 21 },
  { size: "M", chest: 55, length: 70, shoulder: 51, sleeve: 22 },
  { size: "L", chest: 57, length: 72, shoulder: 53, sleeve: 23 },
  { size: "XL", chest: 60, length: 74, shoulder: 56, sleeve: 24 },
  { size: "XXL", chest: 64, length: 76, shoulder: 60, sleeve: 25 },
];

// Solo Instagram como contacto — no se usa WhatsApp en ningún punto del sitio.
export const CONTACT = {
  instagram: "https://www.instagram.com/intitnet/",
  instagramHandle: "@intitnet",
};
