"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { checkoutAction } from "./checkout-action";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, removeItem, addItem } = useCartStore();
  
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Il tuo carrello è vuoto</h2>
        <p className="text-neutral-500 mb-8">Aggiungi qualche pezzo unico alla tua collezione.</p>
        <Button asChild className="rounded-full px-8">
          <Link href="/products">Torna allo Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">Il Tuo Ordine</h1>
      
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="shadow-xl border-neutral-100 overflow-hidden">
          <CardHeader className="bg-neutral-50/50 border-b">
            <CardTitle className="text-lg font-bold text-black uppercase tracking-wider">
              Riepilogo Prodotti
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => (
                // Usiamo ID + Variante come chiave unica per evitare conflitti
                <li key={`${item.id}-${item.variant}`} className="flex py-6 gap-6 first:pt-0 last:pb-0">
                  
                  {/* IMMAGINE PRODOTTO */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                    <Image
                      src={item.imageUrl || item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  
                  {/* DETTAGLI PRODOTTO */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-neutral-900 leading-none">
                          {item.name}
                        </h3>
                        
                        {/* --- VARIANTE SELEZIONATA --- */}
                        {item.variant && (
                          <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-neutral-100 text-neutral-600 border border-neutral-200">
                            Colore: {item.variant}
                          </div>
                        )}
                        {/* ---------------------------- */}
                        
                      </div>
                      <p className="text-base font-bold text-black">
                        €{((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                    
                    {/* CONTROLLI QUANTITÀ */}
                    <div className="mt-auto flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-200">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-lg font-medium hover:text-red-500 transition-colors px-1"
                        >
                          –
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => addItem({ ...item, quantity: 1 })}
                          className="text-lg font-medium hover:text-green-600 transition-colors px-1"
                        >
                          +
                        </button>
                      </div>
                      <button 
                         onClick={() => removeItem(item.id)} // Qui potresti aggiungere una funzione "clearItem" specifica
                         className="text-xs text-neutral-400 hover:underline transition-all"
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* TOTALE */}
            <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-between items-center text-2xl font-black text-black">
              <span className="tracking-tighter">TOTALE ORDINE</span>
              <span>€{(total / 100).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* AZIONI DI CHECKOUT */}
        <div className="space-y-4">
          <SignedIn>
            <form action={checkoutAction}>
              {/* Passiamo gli items serializzati a Stripe */}
              <input type="hidden" name="items" value={JSON.stringify(items)} />
              <Button 
                type="submit" 
                className="w-full py-8 text-xl rounded-full bg-black hover:bg-neutral-800 text-white shadow-xl transition-all transform active:scale-95 font-bold"
              >
                Procedi al Pagamento Sicuro
              </Button>
            </form>
            <p className="text-center text-[10px] text-neutral-400 uppercase tracking-widest">
              Pagamento crittografato gestito da Stripe
            </p>
          </SignedIn>

          <SignedOut>
            <div className="bg-neutral-50 rounded-3xl p-8 border border-dashed border-neutral-300 text-center space-y-6">
              <p className="text-neutral-600 font-medium italic">
                "Accedi per salvare il tuo indirizzo di spedizione e completare l'acquisto."
              </p>
              <SignInButton mode="modal">
                <Button 
                  type="button" 
                  className="w-full py-8 text-xl rounded-full bg-black hover:bg-neutral-800 text-white shadow-xl font-bold"
                >
                  Accedi per Pagare
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}