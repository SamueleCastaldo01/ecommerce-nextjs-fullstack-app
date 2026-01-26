"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    category: "Prodotti & Materiali",
    questions: [
      {
        q: "Come vengono realizzati i prodotti?",
        a: "Ogni prodotto è unico, progettato digitalmente e realizzato tramite stampa 3D ad alta precisione nel nostro studio. Questo processo ci permette di creare forme geometriche impossibili da ottenere con i metodi tradizionali."
      },
      {
        q: "Quali materiali utilizzate?",
        a: "Utilizziamo principalmente PLA di alta qualità, una bioplastica derivata da risorse rinnovabili come l'amido di mais. È biodegradabile in condizioni industriali, leggero e molto resistente."
      },
      {
        q: "Posso richiedere un colore personalizzato?",
        a: "Assolutamente sì. Se hai bisogno di una tonalità specifica non presente a catalogo, contattaci via mail o sui social e verificheremo la disponibilità dei filamenti."
      }
    ]
  },
  {
    category: "Spedizioni & Tempi",
    questions: [
      {
        q: "Quanto tempo ci vuole per la produzione?",
        a: "Non lavoriamo con grandi magazzini: ogni prodotto viene stampato su ordinazione per evitare sprechi. Il tempo di produzione varia da 2 a 5 giorni lavorativi a seconda della complessità del modello."
      },
      {
        q: "Quali sono i tempi di spedizione?",
        a: "Una volta completata la produzione, la spedizione impiega solitamente 24/48 ore per l'Italia tramite corriere espresso. Riceverai il tracking via mail appena il pacco lascia lo studio."
      },
      {
        q: "Cosa succede se il prodotto arriva danneggiato?",
        a: "Nonostante i nostri imballaggi siano molto resistenti, può capitare. Inviaci una foto del prodotto danneggiato entro 24 ore dalla ricezione e provvederemo a stamparne uno nuovo e rispedirtelo gratuitamente."
      }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="container mx-auto px-6 py-0 max-w-3xl">
      {/* HEADER */}
      <div className="mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-black">
          Domande <br /> Frequenti
        </h1>
        <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-[0.3em] italic">
          Tutto quello che devi sapere su Studio 3D
        </p>
      </div>

      {/* LISTA FAQ */}
      <div className="space-y-16">
        {FAQS.map((section, sIdx) => (
          <div key={sIdx}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-8 border-b border-neutral-100 pb-4">
              {section.category}
            </h2>
            <div className="divide-y divide-neutral-100">
              {section.questions.map((faq, qIdx) => {
                const id = `${sIdx}-${qIdx}`;
                const isOpen = openIndex === id;

                return (
                  <div key={id} className="py-6">
                    <button
                      onClick={() => toggleFaq(id)}
                      className="w-full flex justify-between items-center text-left group outline-none"
                    >
                      <span className={`text-lg md:text-xl font-black italic tracking-tighter uppercase transition-colors ${isOpen ? 'text-black' : 'text-neutral-400 group-hover:text-black'}`}>
                        {faq.q}
                      </span>
                      <ChevronDown 
                        className={`text-neutral-300 transition-transform duration-500 ${isOpen ? 'rotate-180 text-black' : ''}`} 
                        size={20} 
                      />
                    </button>
                    
                    <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-medium italic pr-12">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CONTATTI RAPIDI */}
      <div className="mt-24 p-12 bg-neutral-50 rounded-[3rem] text-center border border-neutral-100">
        <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4">Hai altre domande?</h3>
        <p className="text-neutral-400 text-sm mb-8 font-medium">
          Se non hai trovato quello che cercavi, scrivici direttamente. <br /> Siamo sempre disponibili per chiarimenti o progetti su misura.
        </p>
        <Link 
          href="mailto:info@cleanstudio.com"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-black italic uppercase text-xs tracking-widest hover:scale-105 transition-transform"
        >
          <MessageCircle size={16} /> Contattaci ora
        </Link>
      </div>
    </div>
  );
}