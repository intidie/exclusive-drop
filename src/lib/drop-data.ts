import shirtWolf from "@/assets/shirt-wolf.asset.json";
import shirtLiveLeak from "@/assets/shirt-liveleak.asset.json";

export const DROP = {
  name: "Drop Único — LIVE LEAKS by intit",
  totalUnits: 6,
  products: [
    {
      id: "wolf-2014",
      name: "Wolfman Footwork",
      price: 120000,
      currency: "COP",
      image: shirtWolf.url,
      stock: 4,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "liveleak-box",
      name: "LIVE LEAK Box Logo",
      price: 110000,
      currency: "COP",
      image: shirtLiveLeak.url,
      stock: 2,
      sizes: ["S", "M", "L", "XL"],
    },
  ],
};

export const CONTACT = {
  instagram: "https://instagram.com/intit",
  whatsappNumber: "573000000000",
  whatsappMessage: "Hola! Quiero apartar una camisa del drop LIVE LEAKS by intit.",
};

export const waLink = (extra = "") =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(CONTACT.whatsappMessage + (extra ? " " + extra : ""))}`;
