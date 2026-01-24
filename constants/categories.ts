export const CATEGORIES = [
  {
    id: "all",
    name: "Tutti i Prodotti",
    slug: "all",
    description: "L'intera collezione Studio 3D."
  },
  // NUOVA: Per i portapenne e roba da scrivania
  {
    id: "office",
    name: "Ufficio",
    slug: "office",
    description: "Design funzionale per il tuo workspace.",
    subcategories: ["Portapenne", "Supporti Tech", "Organizer"]
  },
  // NUOVA: Per le statuette e regali
  {
    id: "regali",
    name: "Idee Regalo",
    slug: "regali",
    description: "Pensieri unici per momenti speciali.",
    subcategories: ["Festa del Papà", "Personalizzati", "Statuette"]
  }
];