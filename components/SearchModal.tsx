"use client";

import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PRODUCTS } from "@/constants/products"; 
import { PROMO_SETTINGS } from "@/constants/settings";
import Link from "next/link";
import Image from "next/image";

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = searchQuery.trim() === "" 
    ? [] 
    : PRODUCTS.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );

useEffect(() => {
    // Funzione per aprire con CMD+K o CTRL+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      // Il trucco: un piccolissimo timeout (anche 10ms) assicura che il 
      // browser abbia iniziato a renderizzare il modal prima del focus
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 50); 
      
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
      setSearchQuery("");
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1 text-black hover:text-black transition-colors outline-none"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>

      <div
        className={`fixed me-0 inset-0 z-[999] flex items-start justify-center pt-12 sm:pt-24 px-4 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div className={`relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-neutral-100 overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95"
        }`}>
          
          <div className="p-5 sm:p-7 border-b border-neutral-50 flex items-center gap-4 bg-white">
            <MagnifyingGlassIcon className="h-6 w-6 text-neutral-400" />
            <input
              ref={inputRef}
              autoFocus
              type="text"
              placeholder="Cerca un prodotto..."
              className="flex-1 bg-transparent text-lg sm:text-xl font-bold outline-none text-black placeholder:text-neutral-300 italic tracking-tighter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-neutral-50 rounded-full">
              <XMarkIcon className="h-5 w-5 text-neutral-500" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto bg-white">
            {searchQuery.length > 0 && filteredProducts.length === 0 && (
              <div className="py-16 text-center text-neutral-400 font-medium italic uppercase text-xs tracking-widest">
                Nessun risultato trovato
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="p-3 sm:p-5 grid grid-cols-1 gap-1">
                {filteredProducts.map((product) => {
                  const basePrice = product.price;
                  let finalPrice = basePrice;
                  let isOnSale = false;

                  if (PROMO_SETTINGS.IS_SALE_ACTIVE) {
                    finalPrice = basePrice * (1 - PROMO_SETTINGS.GLOBAL_DISCOUNT_PERCENTAGE / 100);
                    isOnSale = true;
                  } else if (product.salePrice) {
                    finalPrice = product.salePrice;
                    isOnSale = true;
                  }

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-5 p-3 rounded-[1.8rem] hover:bg-neutral-50 transition-all group"
                    >
                      {/* IMMAGINE 3:2 ORIZZONTALE */}
                      <div className="relative aspect-[3/2] w-20 sm:w-28 rounded-md overflow-hidden bg-neutral-100 border border-neutral-100 flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-black italic text-black leading-tight tracking-tighter text-sm sm:text-base">
                          {product.name}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-neutral-400 font-bold tracking-widest mt-0.5 truncate uppercase">
                          {product.shortDescription}
                        </p>
                      </div>

                      <div className="text-right flex flex-col items-end shrink-0">
                        <span className={`text-sm sm:text-base font-black italic tracking-tighter ${isOnSale ? 'text-red-600' : 'text-black'}`}>
                          €{(finalPrice / 100).toFixed(2)}
                        </span>
                        {isOnSale && (
                          <span className="text-[10px] text-neutral-300 line-through font-bold">
                            €{(basePrice / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {searchQuery.length === 0 && (
              <div className="p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-5">Ricerche suggerite</p>
                <div className="flex flex-wrap gap-2">
                  {["Vaso", "Lampada", "Nero", "Oro"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-5 py-2 rounded-full bg-neutral-50 border border-neutral-100 text-[11px] font-black uppercase tracking-tighter hover:bg-black hover:text-white transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}