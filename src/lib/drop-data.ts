export const SIZES = ["S", "M", "L", "XL", "XXL"];

export const PRINT_SPEC =
  "Estampado en DTF máxima calidad. No le salen motas, máxima calidad.";

// El precio real que se cobra SIEMPRE se cobra en COP contra la tabla
// `products`/`product_sizes` en Supabase (ver src/routes/api.checkout.ts).
// El equivalente en dólares para clientes internacionales se calcula con
// la TRM OFICIAL del día (Banco de la República), obtenida en vivo desde
// /api/trm — ver src/lib/trm.ts. Aquí NO hay ninguna tasa fija: si la API
// de la TRM llegara a fallar, el propio /api/trm devuelve un valor de
// respaldo, nunca este archivo.
export const PRICE = 89999;
export const XXL_SURCHARGE_COP = 15000;

export const ORIGINAL_PRICE = 99999;

// Envío nacional (Colombia): gratis en compras superiores a este monto.
// Por debajo del umbral, el envío corre por cuenta del cliente y se
// coordina aparte (no se cobra a través de Wompi). Aplica solo a pedidos
// nacionales (country = "CO"); los envíos internacionales se coordinan
// siempre aparte con el cliente.
export const FREE_SHIPPING_THRESHOLD_COP = 250000;

export type CountryCode = "CO" | "INTL";

// Tipos de documento de identidad válidos para pedidos nacionales. El
// value es lo que se envía y se guarda en Supabase (orders.doc_type); el
// label es lo que ve el usuario.
export const DOC_TYPES: { value: "CC" | "NIT" | "CE" | "PASAPORTE" | "OTRO"; label: string }[] = [
  { value: "CC", label: "Cédula de ciudadanía" },
  { value: "NIT", label: "NIT" },
  { value: "CE", label: "Cédula de extranjería" },
  { value: "PASAPORTE", label: "Pasaporte" },
  { value: "OTRO", label: "Otro" },
];

// Países de destino más comunes para el formulario de pago internacional.
// "Otro país" permite escribir manualmente cualquier otro destino. El
// código de marcación (dial) es solo una ayuda visual en el placeholder del
// teléfono, no se usa para calcular nada.
export const DESTINATION_COUNTRIES = [
  { name: "Estados Unidos", dial: "+1" },
  { name: "México", dial: "+52" },
  { name: "Canadá", dial: "+1" },
  { name: "España", dial: "+34" },
  { name: "Argentina", dial: "+54" },
  { name: "Chile", dial: "+56" },
  { name: "Perú", dial: "+51" },
  { name: "Ecuador", dial: "+593" },
  { name: "Panamá", dial: "+507" },
  { name: "Costa Rica", dial: "+506" },
  { name: "Otro país", dial: "" },
];

export function formatCop(cop: number): string {
  return `$${Math.round(cop).toLocaleString("es-CO")}`;
}

// Convierte un valor en COP a su equivalente en USD usando la TRM que se le
// pase (siempre la TRM OFICIAL del día, obtenida de /api/trm — ver
// src/lib/trm.ts). Es solo para PREVISUALIZAR: el monto real que se cobra
// siempre lo recalcula el servidor en src/routes/api.checkout.ts.
export function copToUsd(cop: number, trm: number): number {
  return Math.round((cop / trm) * 100) / 100;
}

export function formatUsd(usd: number): string {
  return `US$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export type Product = {
  slug: string;
  name: string;
  image: string;
  images: string[];
  tag: string;
  description: string;
  price?: number; // Solo para mostrar en el sitio antes de pagar. Si no se
  // especifica, se usa PRICE. El monto real que se cobra SIEMPRE sale de
  // `products.price_cop` en Supabase (ver src/routes/api.checkout.ts).
};

export const PRODUCTS: Product[] = [
  {
    slug: "machine-girl",
    name: "INTI(t) MACHINE GIRL",
    image: "/images/machine_girl.webp",
    images: ["/images/machine_girl.webp", "/images/machine_girl_back.webp"],
    tag: "Footwork / Breakcore",
    description:
      "Camisa oversize negra con print full-front inspirado en el artwork japonés de breakcore. Tipografía kanji y gradientes ácidos sobre algodón pesado.",
    price: 79999,
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
