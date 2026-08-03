export const SIZES = ["S", "M", "L", "XL", "XXL"];

export const PRICE = 74999;
export const ORIGINAL_PRICE = 87999;
export const USD_TRM = 4000;

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

export const CONTACT = {
  instagram: "https://www.instagram.com/intitnet/",
  instagramHandle: "@intitnet",
  whatsappNumber: "573006865256",
  whatsappDisplay: "+57 300 686 5256",
  whatsappMessage: "Hola! Quiero apartar una camisa del drop LIVE LEAKS by INTI(t).",
};

export const waLink = (extra = "") =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
    CONTACT.whatsappMessage + (extra ? " " + extra : "")
  )}`;
