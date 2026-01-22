export const STORE_SETTINGS = {
  NAME: "Clean Studio",
  SUPPORT_EMAIL: "support@cleanstudio.it", 
  INFO_EMAIL: "info@cleanstudio.it",
  LOGO_URL: "/logo.png",
  CURRENCY: "eur",
  LOCALE: "it-IT",
};

export const SHIPPING_SETTINGS = {
  THRESHOLD: 5000,      // Spedizione gratis sopra i 50€ (in centesimi)
  BASE_COST: 600,       // Costo base 6€ (in centesimi)
  MIN_DAYS: 3,          
  MAX_DAYS: 5,          
  CURRENCY: "eur",
  ALLOWED_COUNTRIES: ['IT'], // Solo Italia (aggiungi altri codici ISO se serve)
};

export const UI_MESSAGES = {
  FREE_SHIPPING_PROMO: "Spedizione gratuita per ordini superiori a €50!",
  SUCCESS_MESSAGE: "Il tuo prodotto unico è in coda di stampa!",
  EMPTY_CART: "Il tuo carrello è vuoto. Inizia a creare il tuo stile.",
};

export const PROMO_SETTINGS = {
  IS_SALE_ACTIVE: false,
  GLOBAL_DISCOUNT_PERCENTAGE: 10,
};


// Varianti prodotto con sovrapprezzi
export const PRODUCT_VARIANTS = {
  // Sovrapprezzi per il Colore (fissi)
  COLORS: {
    "Standard": 0,
    "Bianco": 0,
    "Nero": 0,
    "Oro": 500,     // +5€
    "Marmo": 300,   // +3€
    "Glow": 600,    // +6€
  },
  
  // Sovrapprezzi per l'Altezza
  SIZES: {
    "(10cm)": 0,
    "(12cm)": 200,   // +2€
    "(14cm)": 300,  // +3€
    "(16cm)": 400, // +4€
  }
};