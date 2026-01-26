// components/product-card.tsx
import Link from "next/link";
import Stripe from "stripe";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { PROMO_SETTINGS } from "@/constants/settings";

interface Props {
  // Accettiamo sia il tipo di Stripe che il tuo tipo locale
  product: any; 
}

export const ProductCard = ({ product }: Props) => {
  // LOGICA PREZZO: Se è Stripe prende unit_amount, altrimenti prende il price locale
  const stripePrice = product.default_price 
    ? (product.default_price as Stripe.Price).unit_amount as number
    : product.price as number;

  // 1. LOGICA PREZZI (Identica ai tuoi dettagli)
  let finalPrice = stripePrice;
  let isOnSale = false;

  if (PROMO_SETTINGS.IS_SALE_ACTIVE) {
    finalPrice = stripePrice * (1 - PROMO_SETTINGS.GLOBAL_DISCOUNT_PERCENTAGE / 100);
    isOnSale = true;
  } 
  else if (product.salePrice) {
    finalPrice = product.salePrice;
    isOnSale = true;
  }

  const finalOriginalPrice = isOnSale ? stripePrice : null;

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="h-full flex flex-col bg-white border border-neutral-100 rounded-[1rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1 p-0">
        
        {/* AREA IMMAGINE */}
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* ANTEPRIMA COLORI */}
          {product.variants && product.variants.length > 0 && (
            <div className="absolute bottom-4 right-4 flex -space-x-1.5">
              {product.variants.slice(0, 3).map((v: any) => (
                <div 
                  key={v.id}
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: v.colorCode }}
                />
              ))}
            </div>
          )}
        </div>

        {/* CONTENUTO INFO */}
        <CardContent className="p-6 pt-5 flex flex-col flex-grow">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-neutral-900 tracking-tighter leading-tight mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-neutral-400 font-medium italic leading-relaxed">
              {product.shortDescription || "prodotto unico stampato in 3D"}
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              {finalOriginalPrice && (
                <span className="text-sm text-neutral-300 line-through font-bold mb-[-2px]">
                  €{(finalOriginalPrice / 100).toFixed(2)}
                </span>
              )}
              <span className={`text-2xl font-black tracking-tighter ${isOnSale ? 'text-red-600' : 'text-black'}`}>
                €{(Math.round(finalPrice) / 100).toFixed(2)}
              </span>
            </div>
            
            <div className="h-9 w-9 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100 group-hover:bg-black group-hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-45">
                    <path d="M12 3L3 12M12 3H5M12 3V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};