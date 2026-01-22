// constants/products.ts

export interface ProductVariant {
  id: string;
  name: string; // es: "PLA Bianco", "PETG Nero"
  colorCode: string; // es: "#FFFFFF"
}

export interface Product {
  id: string;
  stripePriceId: string; // Il collegamento con Stripe
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number; // in centesimi, es: 2500 = 25.00€
  salePrice?: number; // Prezzo in saldo, se applicabile
  images: string[]; // Array di percorsi: ["/images/products/vaso-1.jpg", ...]
  variants?: ProductVariant[];
  category: string;
  hasSizes?: boolean; // Se il prodotto ha opzioni di taglia
}

export const PRODUCTS: Product[] = [
  {
    id: "prod_TpnM3L9BAE6mlr",
    stripePriceId: "price_1Ss7luPS0wKGamkbzVtpmGJe", 
    name: "Prova prodotto",
    shortDescription: "Vaso stampato in 3D con design a spirale.",
    longDescription: "Questo vaso è stato progettato per massimizzare la rifrazione della luce. Stampato con un'altezza layer di 0.2mm per una finitura liscia e resistente.",
    price: 1000,
    salePrice: 800,
    images: [
      "/images/products/Copertina.png",
      "/images/products/Copertina.png",
      "/images/products/Copertina.png",
    ],
    variants: [
      { id: "v1", name: "Bianco", colorCode: "#f0f0f0" },
      { id: "v2", name: "Nero", colorCode: "#333333" }
    ],
    category: "Home Decor"
  },
  {
    id: "prod_portachiavi_semplice",
    stripePriceId: "price_1Ss7luPS0wKGamkbzVtpmGJf",
    name: "Portachiavi",
    shortDescription: "Portachiavi pratico stampato in 3D.",
    longDescription: "Un portachiavi leggero e durevole, perfetto per organizzare le tue chiavi con stile.",
    price: 500,
    images: [
      "/images/products/portachiavi-1.jpg",
    ],
    category: "Accessories",
    hasSizes: false, 
    variants: [], 
  }
];