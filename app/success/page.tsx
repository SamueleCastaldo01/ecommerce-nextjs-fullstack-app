"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, Mail } from "lucide-react";
import { STORE_SETTINGS } from "@/constants/settings";

export default function SuccessPage() {
  const { clearCart, setCartOpen } = useCartStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // 1. CHIUDI IL CARRELLO (se era rimasto aperto)
    if (setCartOpen) setCartOpen(false); 
    
    // 2. CONTROLLO SICUREZZA
    // Se qualcuno prova a entrare in /success senza aver comprato nulla, lo cacciamo
    if (!sessionId) {
      router.push("/");
      return;
    }

    // 3. SVUOTA IL CARRELLO
    clearCart();
  }, [clearCart, setCartOpen, sessionId, router]);

  // Se non c'è la sessione, non mostriamo nulla mentre reindirizziamo
  if (!sessionId) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        
        {/* ICONA ANIMATA (Semplice ma efficace) */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse opacity-50" />
            <CheckCircle2 size={80} className="text-black relative z-10" strokeWidth={1.5} />
          </div>
        </div>

        {/* TESTO PRINCIPALE */}
        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4 text-black">
          Ordine <br /> Confermato
        </h1>
        
        <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-[0.3em] italic mb-12">
          Grazie per aver scelto {STORE_SETTINGS.NAME}
        </p>

        {/* BOX INFORMATIVO */}
        <div className="bg-neutral-50 rounded-[2.5rem] p-8 border border-neutral-100 mb-12 space-y-4">
          <div className="flex items-center gap-4 text-left">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <Mail size={18} className="text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-600 leading-tight">
              A breve riceverai un&apos;email di conferma con il riepilogo e la ricevuta.
            </p>
          </div>
          <div className="flex items-center gap-4 text-left border-t border-neutral-200/50 pt-4">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <ShoppingBag size={18} className="text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-600 leading-tight">
              Inizieremo la produzione del tuo pezzo 3D nelle prossime 24 ore.
            </p>
          </div>
        </div>

        {/* AZIONI */}
        <div className="flex flex-col gap-4">
          <Link 
            href="/orders" 
            className="group bg-black text-white py-5 rounded-full font-black italic uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95"
          >
            Visualizza i miei ordini
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/shop" 
            className="text-neutral-400 font-black italic uppercase text-[10px] tracking-widest hover:text-black transition-colors py-2"
          >
            Torna allo shop
          </Link>
        </div>

        {/* FOOTERINA */}
        <p className="mt-16 text-[9px] text-neutral-300 font-bold uppercase tracking-[0.4em]">
          Design for a better living
        </p>
      </div>
    </div>
  );
}