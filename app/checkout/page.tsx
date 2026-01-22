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
  
  // Calcolo del totale prodotti
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // LOGICA SPEDIZIONE
  const threshold = 5000; // 50€ in centesimi
  const shippingCost = total >= threshold ? 0 : 600; // 0€ se >= 50€, altrimenti 6€
  const missingAmount = threshold - total;
  const progressPercentage = Math.min((total / threshold) * 100, 100);

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
      <h1 className="text-3xl font-bold mb-8 text-center tracking-tight italic">Il Tuo Ordine</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* BARRA PROGRESSO SPEDIZIONE GRATUITA */}
        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              {missingAmount > 0 ? (
                <>
                  <p className="text-sm font-medium text-neutral-500">
                    Ti mancano solo <span className="font-bold text-black">€{(missingAmount / 100).toFixed(2)}</span>
                  </p>
                  <p className="text-xs uppercase tracking-widest font-bold text-black">
                    Per la spedizione gratuita
                  </p>
                </>
              ) : (
                <p className="text-sm font-bold text-green-600 flex items-center gap-2 uppercase tracking-tight">
                  🎉 Spedizione gratuita ottenuta!
                </p>
              )}
            </div>
            <span className="text-[10px] font-bold text-neutral-300 uppercase">Target €50.00</span>
          </div>

          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ease-out ${missingAmount > 0 ? 'bg-black' : 'bg-green-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* CARD PRODOTTI */}
        <Card className="rounded-[2rem] shadow-xl border-neutral-100 overflow-hidden">
          <CardHeader className="bg-neutral-50/50 border-b py-6">
            <CardTitle className="text-sm font-black text-black uppercase tracking-[0.2em] text-center">
              Riepilogo Carrello
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => (
                <li key={`${item.id}-${item.variant}`} className="flex py-6 gap-6 first:pt-0 last:pb-0">
                  
                  {/* IMMAGINE */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                    <Image
                      src={item.imageUrl || item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* DETTAGLI */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-neutral-900 leading-none">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tighter bg-neutral-100 text-neutral-500 border border-neutral-200">
                            Color: {item.variant}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-black">
                        €{((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                    
                    {/* CONTROLLI */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-200">
                        <button
                          onClick={() => removeItem(item.id, item.variant)}
                          className="text-lg font-medium hover:text-red-500 transition-colors"
                        >
                          –
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => addItem({ ...item, quantity: 1 })}
                          className="text-lg font-medium hover:text-green-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* RIEPILOGO COSTI FINALI */}
            <div className="mt-8 pt-6 border-t border-neutral-200 space-y-3">
              <div className="flex justify-between text-sm font-medium text-neutral-500 italic">
                <span>Subtotale prodotti</span>
                <span>€{(total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-neutral-500 italic">
                <span>Costo Spedizione</span>
                <span className={shippingCost === 0 ? "text-green-600 font-bold" : ""}>
                  {shippingCost === 0 ? "GRATIS" : `€${(shippingCost / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 text-2xl font-black text-black border-t border-neutral-100">
                <span className="tracking-tighter uppercase">Totale</span>
                <span>€{((total + shippingCost) / 100).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AZIONI DI CHECKOUT */}
        <div className="space-y-4 pt-4">
          <SignedIn>
            <form action={checkoutAction}>
              <input type="hidden" name="items" value={JSON.stringify(items)} />
              <Button 
                type="submit" 
                className="w-full py-8 text-xl rounded-full bg-black hover:bg-neutral-800 text-white shadow-2xl transition-all transform active:scale-95 font-bold uppercase tracking-widest"
              >
                Completa Ordine
              </Button>
            </form>
            <p className="text-center text-[9px] text-neutral-400 uppercase tracking-[0.3em]">
              Safe & Secure Checkout via Stripe
            </p>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button 
                type="button" 
                className="w-full py-8 text-xl rounded-full bg-black hover:bg-neutral-800 text-white shadow-xl font-bold"
              >
                Accedi per Pagare
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}