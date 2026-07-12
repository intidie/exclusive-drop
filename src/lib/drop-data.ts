import shirtFront from "@/assets/shirt-front.png.asset.json";
import shirtLiveLeak from "@/assets/shirt-liveleak.asset.json";

export const DROP = {
  name: "Drop Único — LIVE LEAKS by INTI(t)",
  totalUnits: 6,
  product: {
    id: "inti-machine-girl",
    name: "INTI(t) DROP MACHINE GIRL",
    price: 75999,
    originalPrice: 87999,
    currency: "COP",
    images: [shirtFront.url, shirtLiveLeak.url],
    stock: 6,
    sizes: ["Única"],
  },
};

// Medidas en cm (planas, prenda tendida).
export const SIZE_GUIDE = [
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
