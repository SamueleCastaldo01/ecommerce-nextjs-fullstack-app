"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { checkoutAction } from "./checkout-action";
// 1. Importiamo i componenti di Clerk
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function CheckoutPage() {
  const { items, removeItem, addItem } = useCartStore();
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Il tuo carrello è vuoto</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <Card className="max-w-md mx-auto mb-8 shadow-lg border-neutral-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black">Riepilogo Ordine</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-neutral-900 font-semibold">{item.name}</span>
                    <span className="font-bold">
                      €{((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-black hover:bg-black hover:text-white transition-colors"
                      onClick={() => removeItem(item.id)}
                    >
                      –
                    </Button>
                    <span className="text-md font-bold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-black hover:bg-black hover:text-white transition-colors"
                      onClick={() => addItem({ ...item, quantity: 1 })}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t pt-4 text-xl font-extrabold text-black">
            <span>Totale</span>
            <span>€{(total / 100).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-md mx-auto">
        {/* 2. SE L'UTENTE È LOGGATO: Mostriamo il form normale per Stripe */}
        <SignedIn>
          <form action={checkoutAction}>
            <input type="hidden" name="items" value={JSON.stringify(items)} />
            <Button type="submit" variant="default" className="w-full py-6 text-lg rounded-full bg-black hover:bg-neutral-800 text-white shadow-md">
              Procedi al Pagamento
            </Button>
          </form>
        </SignedIn>

        {/* 3. SE L'UTENTE NON È LOGGATO: Mostriamo il pulsante che apre il MODAL */}
        <SignedOut>
          <div className="text-center space-y-4">
            <p className="text-sm text-neutral-500 font-medium">Accedi per completare l'ordine in sicurezza</p>
            <SignInButton mode="modal">
              <Button type="button" className="w-full py-6 text-lg rounded-full bg-black hover:bg-neutral-800 text-white shadow-md">
                Accedi per Continuare
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}