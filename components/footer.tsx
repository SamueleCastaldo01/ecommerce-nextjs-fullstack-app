import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-neutral-800 pb-12">
          
          {/* Colonna 1: Brand & Bio */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tighter">My Ecommerce</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Design futuristico e manifattura digitale. 
              Creiamo pezzi unici in stampa 3D per trasformare 
              il tuo spazio in una galleria d'arte moderna.
            </p>
          </div>

          {/* Colonna 2: Shop */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Negozio</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link href="/products" className="hover:text-white transition">Tutti i Prodotti</Link></li>
              <li><Link href="/#trending" className="hover:text-white transition">Pezzi di Tendenza</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-white transition">Nuovi Arrivi</Link></li>
              <li><Link href="/collections" className="hover:text-white transition">Collezioni</Link></li>
            </ul>
          </div>

          {/* Colonna 3: Supporto */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Supporto</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link href="/spedizioni" className="hover:text-white transition">Spedizioni & Resi</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">Domande Frequenti</Link></li>
              <li><Link href="/termini" className="hover:text-white transition">Termini e Condizioni</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Colonna 4: Social & Contatti */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Seguici</h4>
            <div className="flex space-x-4 mb-4">
               {/* Sostituisci con le tue icone se le hai, qui uso testo per semplicità */}
               <Link href="#" className="text-neutral-400 hover:text-white">IG</Link>
               <Link href="#" className="text-neutral-400 hover:text-white">FB</Link>
               <Link href="#" className="text-neutral-400 hover:text-white">TK</Link>
            </div>
            <p className="text-sm text-neutral-400">info@myecommerce.it</p>
          </div>
        </div>

        {/* Copyright & Bottom */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} My Ecommerce. Tutti i diritti riservati.</p>
          <div className="flex space-x-4">
            <span>P.IVA 12345678901</span>
            <span>Made with passion & 3D Printers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}