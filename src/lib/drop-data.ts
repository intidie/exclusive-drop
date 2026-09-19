export const SIZES = ["S", "M", "L", "XL", "XXL"];

export const PRINT_SPEC = "Estampado en DTF máxima calidad. No le salen motas, máxima calidad.";

// El precio real que se cobra SIEMPRE lo valida el servidor contra la tabla
// `products`/`product_sizes` en Supabase (ver src/routes/api.checkout.ts).
// Estas constantes son solo para mostrar un estimado antes de pagar.
export const PRICE = 89999;
export const XXL_SURCHARGE_COP = 15000;

export const ORIGINAL_PRICE = 99999;

// Envío nacional (Colombia): gratis en compras superiores a este monto.
// Por debajo del umbral, el envío corre por cuenta del cliente y se
// coordina aparte (no se cobra a través de Wompi). Aplica solo a pedidos
// nacionales (country = "CO"); los envíos internacionales se coordinan
// siempre aparte con el cliente.
export const FREE_SHIPPING_THRESHOLD_COP = 250000;

// Única excepción a "el envío nunca se cobra por Wompi": el envío
// ultra-económico internacional, pero SOLO cuando el destino es México.
// Transportadora fija 4-72, sin cotización en vivo — el valor y el rango
// de días son fijos y se suman al monto que cobra Wompi (ver
// src/routes/api.checkout.ts). Para cualquier otro país, la opción
// "ultra-económica" sigue siendo informativa y se coordina por Instagram,
// sin costo adicional en el pago.
export const MEXICO_ULTRA_ECONOMICA_SHIPPING = {
  carrier: "4-72",
  minDays: 15,
  maxDays: 25,
  surchargeCop: 83050,
};

// Compara el nombre del país de destino (tal como lo guarda el formulario,
// p. ej. "México") contra "México", ignorando tildes/mayúsculas — para
// que tanto "México" (del selector) como "mexico" (si el cliente lo
// escribe a mano en "Otro país") activen la misma lógica.
export function isMexicoDestination(destinationCountry: string): boolean {
  const normalized = destinationCountry
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
  return normalized === "mexico";
}

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
// teléfono, no se usa para calcular nada. `cities` son las ciudades más
// habituales para ese destino: el formulario las ofrece como lista (no como
// texto libre) para que la ciudad que le llega a Envia.com sea siempre un
// nombre reconocible y el cálculo del envío aproximado no falle por typos o
// variaciones de escritura. "Otra ciudad" revela un campo de texto libre
// para cualquier ciudad que no esté en la lista.
export const DESTINATION_COUNTRIES: { name: string; dial: string; cities: string[] }[] = [
  {
    name: "Estados Unidos",
    dial: "+1",
    cities: [
      "Miami",
      "Nueva York",
      "Los Ángeles",
      "Houston",
      "Orlando",
      "Chicago",
      "Dallas",
      "Atlanta",
      "New Jersey",
    ],
  },
  {
    name: "México",
    dial: "+52",
    cities: [
      "Ciudad de México",
      "Guadalajara",
      "Monterrey",
      "Puebla",
      "Cancún",
      "Tijuana",
      "Querétaro",
    ],
  },
  {
    name: "Canadá",
    dial: "+1",
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  },
  {
    name: "España",
    dial: "+34",
    cities: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Málaga"],
  },
  {
    name: "Argentina",
    dial: "+54",
    cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
  },
  {
    name: "Chile",
    dial: "+56",
    cities: ["Santiago", "Valparaíso", "Concepción"],
  },
  {
    name: "Perú",
    dial: "+51",
    cities: ["Lima", "Arequipa", "Trujillo"],
  },
  {
    name: "Ecuador",
    dial: "+593",
    cities: ["Quito", "Guayaquil", "Cuenca"],
  },
  {
    name: "Panamá",
    dial: "+507",
    cities: ["Ciudad de Panamá", "Colón", "David"],
  },
  {
    name: "Costa Rica",
    dial: "+506",
    cities: ["San José", "Alajuela", "Heredia"],
  },
  { name: "Otro país", dial: "", cities: [] },
];

// Departamentos de Colombia (los 32 + Bogotá D.C.) para el formulario de
// envío nacional. `cities` trae las ciudades/municipios más habituales de
// cada uno; no es un listado exhaustivo de los ~1.100 municipios del país,
// así que siempre se ofrece "Otra ciudad" para escribir cualquiera que no
// esté en la lista. Igual que con el país de destino en el formulario
// internacional, "Otro" en departamento revela un campo de texto libre.
export const COLOMBIA_DEPARTMENTS: { name: string; cities: string[] }[] = [
  { name: "Amazonas", cities: ["Leticia", "Puerto Nariño"] },
  {
    name: "Antioquia",
    cities: [
      "Medellín",
      "Bello",
      "Itagüí",
      "Envigado",
      "Rionegro",
      "Apartadó",
      "Turbo",
      "Sabaneta",
      "Caldas",
      "La Estrella",
      "Copacabana",
      "Girardota",
    ],
  },
  { name: "Arauca", cities: ["Arauca", "Saravena", "Tame", "Arauquita"] },
  {
    name: "Atlántico",
    cities: ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Puerto Colombia", "Galapa"],
  },
  { name: "Bogotá D.C.", cities: ["Bogotá"] },
  {
    name: "Bolívar",
    cities: ["Cartagena", "Magangué", "Turbaco", "Arjona", "El Carmen de Bolívar"],
  },
  { name: "Boyacá", cities: ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Paipa"] },
  { name: "Caldas", cities: ["Manizales", "La Dorada", "Chinchiná", "Villamaría"] },
  { name: "Caquetá", cities: ["Florencia", "San Vicente del Caguán"] },
  { name: "Casanare", cities: ["Yopal", "Aguazul", "Villanueva"] },
  { name: "Cauca", cities: ["Popayán", "Santander de Quilichao", "Puerto Tejada"] },
  { name: "Cesar", cities: ["Valledupar", "Aguachica", "Agustín Codazzi"] },
  { name: "Chocó", cities: ["Quibdó", "Istmina"] },
  { name: "Córdoba", cities: ["Montería", "Lorica", "Cereté", "Sahagún"] },
  {
    name: "Cundinamarca",
    cities: [
      "Soacha",
      "Chía",
      "Zipaquirá",
      "Facatativá",
      "Fusagasugá",
      "Girardot",
      "Mosquera",
      "Madrid",
      "Funza",
      "Cajicá",
    ],
  },
  { name: "Guainía", cities: ["Inírida"] },
  { name: "Guaviare", cities: ["San José del Guaviare"] },
  { name: "Huila", cities: ["Neiva", "Pitalito", "Garzón"] },
  { name: "La Guajira", cities: ["Riohacha", "Maicao", "Uribia"] },
  { name: "Magdalena", cities: ["Santa Marta", "Ciénaga", "Fundación"] },
  { name: "Meta", cities: ["Villavicencio", "Acacías", "Granada"] },
  { name: "Nariño", cities: ["Pasto", "Ipiales", "Tumaco"] },
  { name: "Norte de Santander", cities: ["Cúcuta", "Ocaña", "Pamplona", "Villa del Rosario"] },
  { name: "Putumayo", cities: ["Mocoa", "Puerto Asís"] },
  { name: "Quindío", cities: ["Armenia", "Calarcá", "Montenegro"] },
  { name: "Risaralda", cities: ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"] },
  { name: "San Andrés y Providencia", cities: ["San Andrés", "Providencia"] },
  {
    name: "Santander",
    cities: ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja"],
  },
  { name: "Sucre", cities: ["Sincelejo", "Corozal"] },
  { name: "Tolima", cities: ["Ibagué", "Espinal", "Honda"] },
  {
    name: "Valle del Cauca",
    cities: ["Cali", "Palmira", "Buenaventura", "Tuluá", "Cartago", "Buga", "Yumbo", "Jamundí"],
  },
  { name: "Vaupés", cities: ["Mitú"] },
  { name: "Vichada", cities: ["Puerto Carreño"] },
  { name: "Otro", cities: [] },
];

export function formatCop(cop: number): string {
  return `$${Math.round(cop).toLocaleString("es-CO")}`;
}

// Convierte un valor en COP a su equivalente fijo en USD usando la TRM de
// negocio. Es solo para PREVISUALIZAR: el monto real que se cobra siempre
// lo recalcula el servidor en src/routes/api.checkout.ts.
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
