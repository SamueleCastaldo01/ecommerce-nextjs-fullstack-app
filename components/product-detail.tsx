"use client";

import Stripe from "stripe";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import ProductGallery from "./ProductGallery";
import { useState } from "react";

interface Props {
  product: Stripe.Product & {
    longDescription?: string;
    variants?: any[];
  };
}

export const ProductDetail = ({ product }: Props) => {
  const { items, addItem, removeItem } = useCartStore();
  
  const price = product.default_price as Stripe.Price;
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Inizializziamo con la prima variante o "Standard"
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 
      ? product.variants[0].name 
      : "Standard"
  );

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: (product.default_price as Stripe.Price).unit_amount as number,
      imageUrl: product.images[0] || "",
      image: product.images[0] || "",  
      quantity: 1,
      variant: selectedVariant,      
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || "",
        url: window.location.href,
      });
    } else {
      alert("Link copiato negli appunti!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* LATO SINISTRO: GALLERIA */}
        <div className="w-full md:w-1/2">
          <ProductGallery 
            images={product.images} 
            productName={product.name}
            onShare={handleShare}
          />
        </div>

        {/* LATO DESTRO: INFO PRODOTTO */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">{product.name}</h1>
          
          {price && price.unit_amount && (
            <p className="text-2xl font-semibold text-zinc-900 mb-6">
              €{(price.unit_amount / 100).toFixed(2)}
            </p>
          )}

          <div className="prose prose-zinc text-gray-600 mb-8 max-w-none">
            <p className="whitespace-pre-line">
              {product.longDescription || product.description}
            </p>
          </div>

          {/* Varianti con Feedback Visivo */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Colori / Materiali</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v: any) => {
                  const isSelected = selectedVariant === v.name;
                  return (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedVariant(v.name)}
                      className={`px-6 py-2 rounded-full border-2 transition-all text-sm font-medium ${
                        isSelected 
                          ? "bg-black text-white border-black shadow-md scale-105" 
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
              {/* Messaggio di conferma selezione */}
              <p className="mt-4 text-sm text-zinc-500">
                Opzione selezionata: <span className="text-black font-bold">{selectedVariant}</span>
              </p>
            </div>
          )}

          {/* Sezione Acquisto */}
          <div className="mt-auto border-t pt-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-zinc-100 rounded-full p-1 shadow-inner">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full hover:bg-white transition-colors"
                  onClick={() => removeItem(product.id)}
                  disabled={quantity === 0}
                >
                  –
                </Button>
                <span className="text-lg font-bold w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full hover:bg-white transition-colors"
                  onClick={onAddItem}
                >
                  +
                </Button>
              </div>
              
              <Button 
                className="flex-1 bg-black text-white hover:bg-zinc-800 rounded-full h-12 text-lg font-bold transition-all transform active:scale-95"
                onClick={onAddItem}
              >
                Aggiungi al Carrello
              </Button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};