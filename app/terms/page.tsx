import React from 'react';
import { STORE_SETTINGS } from "@/constants/settings";

export default function TermsPage() {
  const lastUpdate = "22 Gennaio 2026";

  return (
    <div className="container mx-auto px-6 py-0 max-w-4xl">
      {/* HEADER */}
      <div className="mb-20">
        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-black">
          Termini & <br /> Condizioni
        </h1>
        <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-[0.3em] italic">
          Ultimo aggiornamento: {lastUpdate}
        </p>
      </div>

      <div className="space-y-12 text-neutral-600 leading-relaxed font-medium">
        
        {/* SEZIONE 1 */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            1. Oggetto del Servizio
          </h2>
          <p>
            Clean Studio offre prodotti realizzati tramite tecnologia di produzione additiva (stampa 3D). Ogni pezzo è realizzato su ordinazione o in piccole serie. A causa della natura della stampa 3D, piccole variazioni superficiali o micro-imperfezioni sono caratteristiche intrinseche del processo produttivo e non costituiscono difetti di conformità.
          </p>
        </section>

        {/* SEZIONE 2 */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            2. Ordini e Produzione
          </h2>
          <p>
            L&apos;ordine viene preso in carico solo dopo la conferma del pagamento tramite Stripe. Essendo prodotti On-Demand, i tempi di produzione possono variare da 2 a 7 giorni lavorativi. Eventuali ritardi dovuti a picchi di produzione o manutenzione macchine verranno comunicati tempestivamente.
          </p>
        </section>

        {/* SEZIONE 3 */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            3. Prezzi e Pagamenti
          </h2>
          <p>
            Tutti i prezzi sono indicati in Euro (€). Il pagamento avviene esclusivamente tramite circuiti sicuri Stripe (Carte di credito, Apple Pay, Google Pay). Clean Studio non memorizza i dati della tua carta di credito.
          </p>
        </section>

        {/* SEZIONE 4 */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            4. Diritto di Recesso
          </h2>
          <p>
            Ai sensi del Codice del Consumo, il cliente ha diritto di recedere dal contratto entro 14 giorni dal ricevimento della merce. 
            <strong> Nota bene:</strong> Il diritto di recesso è escluso per i prodotti chiaramente personalizzati o realizzati su specifiche richieste del cliente (colori o dimensioni fuori catalogo).
          </p>
        </section>

        {/* SEZIONE 5 */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            5. Utilizzo e Responsabilità
          </h2>
          <p>
            I nostri prodotti sono realizzati in PLA (bioplastica). Il PLA ha una bassa resistenza termica: non esporre i prodotti a temperature superiori a 50°C (es. interno auto al sole, lavastoviglie, vicinanza a fonti di calore) poiché potrebbero deformarsi. Clean Studio non è responsabile per danni derivanti da un uso improprio del prodotto.
          </p>
        </section>

        {/* SEZIONE 6 */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            6. Proprietà Intellettuale
          </h2>
          <p>
            Tutti i design, i loghi e i contenuti presenti sul sito sono di proprietà di Clean Studio o dei rispettivi designer licenziatari. È vietata la riproduzione o la rivendita dei modelli fisici o dei file digitali senza autorizzazione scritta.
          </p>
        </section>

        {/* SEZIONE 7 */}
        <section className="pt-12 border-t border-neutral-100">
          <p className="text-sm italic">
            Per qualsiasi controversia è competente il Foro di residenza del venditore. Per comunicazioni legali: <span className="text-black font-bold">{STORE_SETTINGS.INFO_EMAIL}</span>
          </p>
        </section>

      </div>
    </div>
  );
}