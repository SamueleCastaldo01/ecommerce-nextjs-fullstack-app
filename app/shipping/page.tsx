import React from 'react';
import { STORE_SETTINGS } from "@/constants/settings"; // Regola il percorso in base a dove hai il file
import { Truck, RotateCcw, ShieldCheck, Clock } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-6 py-0 max-w-4xl">
      {/* HEADER */}
      <div className="mb-20">
        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-black">
          Spedizioni <br /> & Resi
        </h1>
        <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-[0.3em] italic text-balance">
          Trasparenza totale sulla logistica di {STORE_SETTINGS.NAME}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* TEMPI DI PRODUZIONE */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-black">
            <Clock size={20} />
            <h2 className="font-black italic uppercase tracking-tighter text-xl">Produzione On-Demand</h2>
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed font-medium">
            Non abbiamo magazzini polverosi. Ogni prodotto viene stampato 3D appositamente per te dopo l&apos;ordine. 
            Il processo di stampa e rifinitura richiede solitamente <strong>2-5 giorni lavorativi</strong>.
          </p>
        </div>

        {/* TEMPI DI SPEDIZIONE */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-black">
            <Truck size={20} />
            <h2 className="font-black italic uppercase tracking-tighter text-xl">Consegna Express</h2>
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed font-medium">
            Una volta completato, il tuo ordine viene affidato ai nostri corrieri partner. 
            La consegna in Italia avviene mediamente in <strong>24/48 ore</strong>. Riceverai il tracking via email non appena il pacco parte dallo studio.
          </p>
        </div>
      </div>

      <div className="space-y-16">
        {/* POLITICA RESI */}
        <section className="bg-neutral-50 rounded-[3rem] p-10 border border-neutral-100">
          <div className="flex items-center gap-3 text-black mb-6">
            <RotateCcw size={24} />
            <h2 className="font-black italic uppercase tracking-tighter text-2xl">Resi e Rimborsi</h2>
          </div>
          <div className="space-y-6 text-neutral-600 text-sm font-medium">
            <p>
              Hai il diritto di cambiare idea. Puoi restituire i prodotti acquistati entro <strong>14 giorni</strong> dalla ricezione. 
              Gli articoli devono essere integri.
            </p>
            <div className="p-6 bg-white rounded-2xl border border-neutral-100">
              <p className="text-black font-black uppercase text-[10px] tracking-widest mb-2 text-orange-500">Attenzione: Prodotti Personalizzati</p>
              <p className="italic">
                Il diritto di recesso <strong>non si applica</strong> ai prodotti realizzati su misura o con colori personalizzati richiesti esplicitamente dal cliente, come previsto dalle norme vigenti sui beni personalizzati.
              </p>
            </div>
          </div>
        </section>

        {/* DANNI DA TRASPORTO */}
        <section className="px-10">
          <div className="flex items-center gap-3 text-black mb-6">
            <ShieldCheck size={24} />
            <h2 className="font-black italic uppercase tracking-tighter text-2xl">Garanzia di Arrivo</h2>
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed font-medium mb-6">
            La stampa 3D può essere delicata. Se il tuo prodotto arriva danneggiato a causa del trasporto, lo sostituiremo a nostre spese.
          </p>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <p className="text-black font-black uppercase text-[9px] tracking-[0.2em] mb-2">Procedura</p>
              <p className="text-sm text-neutral-400 italic font-medium leading-relaxed">
                Scatta una foto al prodotto e all&apos;imballaggio entro 24 ore dalla consegna e inviala a <strong>{STORE_SETTINGS.SUPPORT_EMAIL}</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* CURA DEL PRODOTTO (Cruciale per il 3D) */}
        <section className="p-10 border-t border-neutral-100">
          <h2 className="font-black italic uppercase tracking-tighter text-2xl mb-6 text-black">Cura del materiale</h2>
          <p className="text-neutral-500 text-sm leading-relaxed font-medium italic">
            I nostri pezzi sono realizzati in PLA. Per evitare deformazioni, non esporre i prodotti a temperature elevate (sopra i 50°C) o a luce solare diretta prolungata all&apos;interno di veicoli. Questi danni non sono coperti dalla garanzia di reso.
          </p>
        </section>
      </div>

      {/* CONTATTO FINALE */}
      <div className="mt-20 text-center">
        <p className="text-neutral-500 font-bold uppercase text-[9px] tracking-[0.4em] mb-4 italic">Hai bisogno di aiuto con una spedizione?</p>
        <a 
          href={`mailto:${STORE_SETTINGS.SUPPORT_EMAIL}`}
          className="text-black font-black italic uppercase tracking-tighter text-lg border-b-2 border-black pb-1 hover:text-neutral-400 hover:border-neutral-400 transition-all"
        >
          Contatta lo Staff
        </a>
      </div>
    </div>
  );
}