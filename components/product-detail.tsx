"use client";

import Stripe from "stripe";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import ProductGallery from "./ProductGallery";
import { useState, useEffect } from "react";
import { PRODUCT_VARIANTS, PROMO_SETTINGS } from "@/constants/settings";

interface Props {
  product: Stripe.Product & {
    longDescription?: string;
    variants?: any[];
    hasSizes?: boolean;
    salePrice?: number;
  };
}

export const ProductDetail = ({ product }: Props) => {
  const { addItem, setCartOpen } = useCartStore();
  
  // Recuperiamo le chiavi delle taglie per evitare errori di battitura
  const sizeKeys = Object.keys(PRODUCT_VARIANTS.SIZES);
  const defaultSize = sizeKeys[0]; // Prende "S (10cm)" o la prima definita

  const stripePrice = (product.default_price as Stripe.Price).unit_amount as number;

  // 1. STATI INIZIALI
  const [selectedColor, setSelectedColor] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0].name : null
  );
  
  // Inizializziamo selectedSize con il valore esatto della prima chiave
  const [selectedSize, setSelectedSize] = useState(
    product.hasSizes !== false ? defaultSize : null
  );
  
  const [localQuantity, setLocalQuantity] = useState(1);

  // 2. LOGICA SCONTO
  let basePrice = stripePrice;
  let isOnSale = false;

  if (PROMO_SETTINGS.IS_SALE_ACTIVE) {
    basePrice = stripePrice * (1 - PROMO_SETTINGS.GLOBAL_DISCOUNT_PERCENTAGE / 100);
    isOnSale = true;
  } else if (product.salePrice) {
    basePrice = product.salePrice;
    isOnSale = true;
  }

  // 3. CALCOLO EXTRA
  const colorExtra = selectedColor ? (PRODUCT_VARIANTS.COLORS as any)[selectedColor] || 0 : 0;
  const sizeExtra = selectedSize ? (PRODUCT_VARIANTS.SIZES as any)[selectedSize] || 0 : 0;
  
  const finalPrice = Math.round(basePrice + colorExtra + sizeExtra);
  const finalOriginalPrice = isOnSale ? stripePrice + colorExtra + sizeExtra : null;

  const variantLabel = [selectedColor, selectedSize].filter(Boolean).join(" / ") || "Standard";

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      imageUrl: product.images[0] || "",
      image: product.images[0] || "",  
      quantity: localQuantity,
      variant: variantLabel,      
    });
    setCartOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-1/2">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 tracking-tighter italic">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <p className="text-3xl font-black text-zinc-900">
              €{(finalPrice / 100).toFixed(2)}
            </p>
            {finalOriginalPrice && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                  {PROMO_SETTINGS.IS_SALE_ACTIVE ? `-${PROMO_SETTINGS.GLOBAL_DISCOUNT_PERCENTAGE}%` : 'Offerta'}
                </span>
                <p className="text-lg text-zinc-400 line-through font-medium leading-none">
                  €{(finalOriginalPrice / 100).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <div className="prose prose-zinc text-gray-600 mb-8 border-l-2 border-zinc-100 pl-4 italic">
            {product.longDescription || product.description}
          </div>

          {/* SEZIONE TAGLIA - CORRETTA PER EVIDENZIARE IL DEFAULT */}
          {product.hasSizes !== false && (
            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
                Seleziona Dimensione
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {sizeKeys.map((size) => {
                  // Confronto rigoroso per la classe active
                  const isSizeSelected = selectedSize === size;
                  
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-xl border-2 text-xs font-bold transition-all duration-200 ${
                        isSizeSelected 
                          ? "border-black bg-black text-white shadow-lg scale-[1.02]" 
                          : "border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SEZIONE COLORE */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Colore</h3>
              <div className="flex flex-wrap gap-4">
                {product.variants.map((v: any) => {
                  const isSelected = selectedColor === v.name;
                  return (
                    <button 
                      key={v.id} 
                      type="button"
                      onClick={() => setSelectedColor(v.name)} 
                      className="group flex flex-col items-center gap-2"
                    >
                      <div className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${isSelected ? "border-black scale-110 shadow-md" : "border-transparent"}`}>
                        <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: v.colorCode }} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-tighter ${isSelected ? "text-black" : "text-zinc-400"}`}>
                        {v.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SEZIONE ACQUISTO */}
          <div className="mt-auto border-t pt-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center bg-zinc-100 rounded-2xl p-1 w-full sm:w-auto justify-between border border-zinc-200 shadow-sm">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setLocalQuantity(q => Math.max(1, q - 1))} 
                  className="h-12 w-12 text-xl hover:bg-white rounded-xl"
                >–</Button>
                <span className="text-lg font-black w-12 text-center">{localQuantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setLocalQuantity(q => q + 1)} 
                  className="h-12 w-12 text-xl hover:bg-white rounded-xl"
                >+</Button>
              </div>
              <Button 
                onClick={onAddItem} 
                className="flex-1 w-full bg-black text-white hover:bg-zinc-800 rounded-2xl h-14 text-base font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95"
              >
                Aggiungi al Carrello
              </Button>
            </div>
            <p className="text-[9px] text-zinc-400 mt-4 text-center uppercase tracking-[0.2em]">
              Ogni ordine è un pezzo unico stampato per te
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};