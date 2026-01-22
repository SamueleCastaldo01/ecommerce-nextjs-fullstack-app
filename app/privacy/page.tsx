import React from 'react';
import { STORE_SETTINGS } from "@/constants/settings";

export default function PrivacyPage() {
  const lastUpdate = "22 Gennaio 2026";

  return (
    <div className="container mx-auto px-6 py-0 max-w-4xl">
      {/* HEADER */}
      <div className="mb-20">
        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-black">
          Privacy <br /> Policy
        </h1>
        <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-[0.3em] italic">
          Ultimo aggiornamento: {lastUpdate}
        </p>
      </div>

      <div className="space-y-12 text-neutral-600 leading-relaxed font-medium">
        
        {/* TITOLARE DEL TRATTAMENTO */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            1. Titolare del Trattamento
          </h2>
          <p>
            Il titolare del trattamento dei dati è Clean Studio. Per qualsiasi domanda riguardante i tuoi dati personali, puoi contattarci all&apos;indirizzo: <span className="text-black font-bold">{STORE_SETTINGS.INFO_EMAIL}</span>.
          </p>
        </section>

        {/* DATI RACCOLTI TRAMITE CLERK */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            2. Autenticazione (Clerk)
          </h2>
          <p>
            Per la gestione degli account utente e l&apos;accesso sicuro, utilizziamo <strong>Clerk</strong>. Quando ti registri, Clerk raccoglie dati quali il tuo indirizzo email, nome e immagine del profilo. Questi dati servono esclusivamente per identificarti e permetterti di gestire i tuoi ordini. Puoi consultare la privacy policy di Clerk sul loro sito ufficiale.
          </p>
        </section>

        {/* DATI DI PAGAMENTO (STRIPE) */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            3. Pagamenti e Dati Bancari (Stripe)
          </h2>
          <p>
            Tutte le transazioni sono gestite da <strong>Stripe</strong>. Clean Studio <strong>non ha accesso e non memorizza</strong> i dati della tua carta di credito o altre informazioni di pagamento sensibili. Stripe raccoglie i dati necessari per processare il pagamento e prevenire frodi. I dati relativi all&apos;indirizzo di spedizione ci vengono forniti da Stripe solo per completare l&apos;invio dell&apos;ordine.
          </p>
        </section>

        {/* FINALITÀ DEL TRATTAMENTO */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            4. Perché trattiamo i tuoi dati
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Per creare e gestire il tuo account personale tramite Clerk.</li>
            <li>Per elaborare e spedire gli ordini effettuati sul sito.</li>
            <li>Per inviarti aggiornamenti sullo stato della spedizione (tramite email).</li>
            <li>Per adempiere agli obblighi di legge (fatturazione e contabilità).</li>
          </ul>
        </section>

        {/* COOKIE */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            5. Cookie e Tracking
          </h2>
          <p>
            Utilizziamo solo cookie tecnici essenziali per il funzionamento del sito (mantenimento della sessione di login tramite Clerk e gestione del carrello). Non utilizziamo cookie di profilazione di terze parti per scopi pubblicitari senza il tuo consenso.
          </p>
        </section>

        {/* DIRITTI DELL'UTENTE */}
        <section>
          <h2 className="text-black font-black italic uppercase tracking-tighter text-xl mb-4">
            6. I tuoi diritti (GDPR)
          </h2>
          <p>
            In conformità con il GDPR, hai il diritto di accedere ai tuoi dati, chiederne la rettifica, la cancellazione o la limitazione del trattamento. Puoi eliminare il tuo account in qualsiasi momento tramite le impostazioni del profilo gestite da Clerk o contattandoci direttamente.
          </p>
        </section>

        {/* SICUREZZA */}
        <section className="pt-12 border-t border-neutral-100 italic text-sm">
          <p>
            Ci impegniamo a proteggere i tuoi dati adottando le migliori tecnologie di sicurezza fornite dai nostri partner (Vercel, Clerk, Stripe). Navigando su questo sito, accetti le pratiche descritte in questa informativa.
          </p>
        </section>

      </div>
    </div>
  );
}