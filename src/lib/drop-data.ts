import shirtWolf from "@/assets/shirt-wolf.asset.json";
import shirtLiveLeak from "@/assets/shirt-liveleak.asset.json";

export const DROP = {
  name: "Drop Único — LIVE LEAKS by intit",
  totalUnits: 6,
  product: {
    id: "inti-machine-girl",
    name: "INTI(t) DROP MACHINE GIRL",
    price: 120000,
    currency: "COP",
    images: [shirtWolf.url, shirtLiveLeak.url],
    stock: 6,
    sizes: ["S", "M", "L", "XL"],
  },
};

export const CONTACT = {
  instagram: "https://www.instagram.com/intitnet/",
  instagramHandle: "@intitnet",
  whatsappNumber: "573006865256",
  whatsappDisplay: "+57 300 686 5256",
  whatsappMessage: "Hola! Quiero apartar una camisa del drop LIVE LEAKS by intit.",
};

export const waLink = (extra = "") =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
    CONTACT.whatsappMessage + (extra ? " " + extra : "")
  )}`;
