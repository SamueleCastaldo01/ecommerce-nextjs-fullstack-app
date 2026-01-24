"use client";

import Stripe from "stripe";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import ProductGallery from "./ProductGallery";
import { useState, useMemo } from "react";
// Importiamo tutte le tue impostazioni
import { 
  PRODUCT_VARIANTS, 
  PROMO_SETTINGS, 
  SHIPPING_SETTINGS, 
  STORE_SETTINGS 
} from "@/constants/settings";
import { Truck, Clock, RotateCcw, ShieldCheck } from "lucide-react";

interface Props {
  product: Stripe.Product & {
    longDescription?: string;
    variants?: any[];
    hasSizes?: boolean;
    salePrice?: number;
    price?: number; 
  };
}

export const ProductDetail = ({ product }: Props) => {
  const { addItem, setCartOpen } = useCartStore();
  
  // Helper per formattare i prezzi (es: € 50,00)
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(STORE_SETTINGS.LOCALE, {
      style: "currency",
      currency: STORE_SETTINGS.CURRENCY,
    }).format(amount / 100);
  };

  const sizeKeys = Object.keys(PRODUCT_VARIANTS.SIZES);
  const defaultSize = sizeKeys[0];

  const stripePrice = product.default_price 
    ? (product.default_price as Stripe.Price).unit_amount as number 
    : (product.price as number || 0);

  const [selectedColor, setSelectedColor] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0].name : null
  );
  const [selectedSize, setSelectedSize] = useState(
    product.hasSizes !== false ? defaultSize : null
  );
  const [localQuantity, setLocalQuantity] = useState(1);

  const activeImage = useMemo(() => {
    if (!product.variants) return product.images[0];
    const match = product.variants.find(
      (v) => v.name === selectedColor && v.imageUrl
    );
    return match ? match.imageUrl : product.images[0];
  }, [selectedColor, product.variants, product.images]);

  // LOGICA SCONTI (PROMO_SETTINGS)
  let basePrice = stripePrice;
  let isOnSale = false;

  if (PROMO_SETTINGS.IS_SALE_ACTIVE) {
    basePrice = stripePrice * (1 - PROMO_SETTINGS.GLOBAL_DISCOUNT_PERCENTAGE / 100);
    isOnSale = true;
  } else if (product.salePrice) {
    basePrice = product.salePrice;
    isOnSale = true;
  }

  // CALCOLO EXTRA (PRODUCT_VARIANTS)
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
      imageUrl: activeImage,
      image: activeImage,  
      quantity: localQuantity,
      variant: variantLabel,      
    });
    setCartOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-1/2">
          <ProductGallery 
            images={product.images} 
            productName={product.name} 
            activeImage={activeImage} 
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 tracking-tighter italic uppercase">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <p className={`text-4xl font-black tracking-tighter ${isOnSale ? 'text-red-600' : 'text-zinc-900'}`}>
              {formatPrice(finalPrice)}
            </p>
            
            {isOnSale && finalOriginalPrice && (
              <div className="flex flex-col">
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase italic w-fit">
                  {PROMO_SETTINGS.IS_SALE_ACTIVE ? `-${PROMO_SETTINGS.GLOBAL_DISCOUNT_PERCENTAGE}%` : 'Offerta'}
                </span>
                <p className="text-lg text-zinc-300 line-through font-bold leading-none mt-1">
                  {formatPrice(finalOriginalPrice)}
                </p>
              </div>
            )}
          </div>

          <div className="prose prose-zinc text-neutral-500 mb-8 border-l-2 border-zinc-100 pl-4 italic leading-relaxed text-sm">
            {product.longDescription || product.description}
          </div>

          {/* VARIANTI TAGLIA */}
          {product.hasSizes !== false && (
            <div className="mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 italic">Seleziona Dimensione</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizeKeys.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl border-2 text-[11px] font-black uppercase transition-all duration-300 ${
                      selectedSize === size ? "border-black bg-black text-white shadow-lg" : "border-zinc-50 bg-zinc-50 text-zinc-400 hover:border-zinc-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VARIANTI COLORE */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 italic">Configura Colore</h3>
              <div className="flex flex-wrap gap-5">
                {product.variants.map((v: any) => {
                  const isSelected = selectedColor === v.name;
                  return (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedColor(v.name)} 
                      className="group flex flex-col items-center gap-2 outline-none"
                    >
                      <div className={`w-12 h-12 rounded-full border-2 transition-all p-1 ${isSelected ? "border-black scale-110 shadow-md" : "border-transparent"}`}>
                        <div className="w-full h-full rounded-full border border-black/5" style={{ backgroundColor: v.colorCode }} />
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? "text-black" : "text-zinc-300"}`}>
                        {v.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

               {/* SEZIONE INFO DINAMICA DAI SETTINGS */}
            <div className="grid grid-cols-1 gap-4 bg-zinc-50/50 rounded-[2rem] p-6 border border-zinc-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-full border border-zinc-100"><Truck size={16} /></div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-tighter">
                    {finalPrice >= SHIPPING_SETTINGS.THRESHOLD 
                      ? "Spedizione Gratuita Attiva" 
                      : `Spedizione ${formatPrice(SHIPPING_SETTINGS.BASE_COST)} (Gratis sopra ${formatPrice(SHIPPING_SETTINGS.THRESHOLD)})`}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium italic">Consegna Express tracciata in tutta Italia.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-full border border-zinc-100"><Clock size={16} /></div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-tighter uppercase">Tempi di consegna</p>
                  <p className="text-[10px] text-zinc-400 font-medium italic">
                    Ricevi il tuo ordine in {SHIPPING_SETTINGS.MIN_DAYS}-{SHIPPING_SETTINGS.MAX_DAYS} giorni lavorativi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-full border border-zinc-100"><RotateCcw size={16} /></div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-tighter uppercase">Reso e Supporto</p>
                  <p className="text-[10px] text-zinc-400 font-medium italic">Hai domande? Scrivici a {STORE_SETTINGS.SUPPORT_EMAIL}</p>
                </div>
              </div>
            </div>

          {/* AZIONI DI ACQUISTO */}
          <div className="mt-auto border-t border-zinc-50 pt-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="flex items-center bg-zinc-50 rounded-2xl p-1 border border-zinc-100 w-full sm:w-auto justify-between">
                <button onClick={() => setLocalQuantity(q => Math.max(1, q - 1))} className="h-12 w-12 font-black text-xl hover:bg-white rounded-xl">–</button>
                <span className="text-lg font-black w-12 text-center">{localQuantity}</span>
                <button onClick={() => setLocalQuantity(q => q + 1)} className="h-12 w-12 font-black text-xl hover:bg-white rounded-xl">+</button>
              </div>
              <Button onClick={onAddItem} className="flex-1 w-full bg-black text-white hover:bg-zinc-800 rounded-2xl h-14 text-sm font-black uppercase tracking-[0.2em] shadow-2xl">
                Aggiungi al Carrello
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};