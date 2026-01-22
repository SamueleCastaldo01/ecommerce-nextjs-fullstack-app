"use client";

import { useState, useEffect } from "react"; // Aggiunto useEffect per gestire lo scroll se serve
import { useCartStore } from "@/store/cart-store";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import {
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { checkoutAction } from "@/app/checkout/checkout-action";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { SHIPPING_SETTINGS } from "@/constants/settings";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { CheckoutButton } from "./CheckoutButton";

export function CartSidebar() {
  const isOpen = useCartStore((state) => state.isCartOpen);
  const setIsOpen = useCartStore((state) => state.setCartOpen);
  const { items, removeItem, addItem } = useCartStore();
  const pathname = usePathname();
  
  const cartCount = items.length; // Definita per far funzionare il badge
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const threshold = SHIPPING_SETTINGS.THRESHOLD;
  const shippingCost = total >= threshold ? 0 : SHIPPING_SETTINGS.BASE_COST;
  const missingAmount = threshold - total;
  const progressPercentage = Math.min((total / threshold) * 100, 100);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 1. PULSANTE TRIGGER */}
      <button onClick={toggleSidebar} className="relative p-2 hover:scale-110 transition-transform group">
        <ShoppingCartIcon className="h-6 w-6 text-black" />
        {items.length > 0 && (
          <span className="absolute bottom-[24.6px] left-[21px] bg-black text-white text-[9px] font-black h-[20px] w-[20px] rounded-full flex items-center justify-center border-2 border-white">
            {items.length}
          </span>
        )}
      </button>

      {/* 2. OVERLAY */}
      <div 
        className={`fixed inset-0 bg-black/40 m-0 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* 3. PANNELLO SIDEBAR */}
      <aside className={`fixed top-0 me-0 right-0 h-full w-full sm:max-w-md bg-white z-[101] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        {/* HEADER */}
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h2 className="text-xl font-black italic tracking-tighter">Carrello</h2>
          <button onClick={toggleSidebar} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENUTO */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-neutral-400">
              <p className="italic font-medium">Il tuo carrello è vuoto.</p>
              <button onClick={toggleSidebar} className="mt-4 text-black font-bold border-b border-black text-sm">Inizia lo shopping</button>
            </div>
          ) : (
            <>
              {/* BARRA SPEDIZIONE */}
              <div className="px-6 py-6 bg-neutral-50/50 border-b border-neutral-100 space-y-4">
                <div className="flex flex-col gap-1">
                  {missingAmount > 0 ? (
                    <p className="text-sm font-medium text-neutral-600 italic">
                      Aggiungi altri <span className="font-black text-black not-italic">€{(missingAmount / 100).toFixed(2)}</span> per la consegna gratuita
                    </p>
                  ) : (
                    <p className="text-sm font-bold text-green-600 flex items-center gap-2">
                      <span className="text-lg">🎉</span> Spedizione GRATUITA sbloccata!
                    </p>
                  )}
                </div>

                <div className="relative pt-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Progresso</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
                      Obiettivo €{(threshold / 100).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
                        missingAmount > 0 ? 'bg-black' : 'bg-green-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-1 px-0.5">
                    <span className="text-[8px] font-bold text-neutral-500">€0</span>
                    <span className={`text-[8px] font-bold ${missingAmount > 0 ? 'text-neutral-500' : 'text-green-700'}`}>
                      €{(threshold / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* LISTA ARTICOLI */}
              <div className="p-6 space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex gap-4 items-center">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50 flex-shrink-0">
                      <Image src={item.imageUrl || item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* --- MODIFICA QUI: LINK SUL TITOLO --- */}
                      <Link href={`/products/${item.id}`} onClick={() => setIsOpen(false)}>
                        <h4 className="text-sm font-bold text-black truncate hover:underline">
                          {item.name}
                        </h4>
                      </Link>
                      {/* -------------------------------------- */}
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter truncate">{item.variant}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 border border-neutral-200 rounded-full px-2 py-0.5">
                          <button onClick={() => removeItem(item.id, item.variant)} className="hover:text-black"><Minus size={12} /></button>
                          <span className="text-xs font-black w-3 text-center">{item.quantity}</span>
                          <button onClick={() => addItem({ ...item, quantity: 1 })} className="hover:text-black"><Plus size={12} /></button>
                        </div>
                        <span className="text-sm font-black italic">€{((item.price * item.quantity) / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* FOOTER CON TOTALI */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-neutral-100 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-400 italic uppercase">
                <span>Spedizione</span>
                <span>{shippingCost === 0 ? "Gratuita" : `€${(shippingCost / 100).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-black italic tracking-tighter text-black">
                <span>TOTALE</span>
                <span>€{((total + shippingCost) / 100).toFixed(2)}</span>
              </div>
            </div>

            <SignedIn>
              <form action={checkoutAction}>
                <input type="hidden" name="items" value={JSON.stringify(items)} />
                <CheckoutButton />
              </form>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button className="w-full py-7 rounded-[1.5rem] bg-black text-white font-black uppercase tracking-widest">
                  Accedi per Pagare
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        )}
      </aside>
    </>
  );
}