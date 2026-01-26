import Image from "next/image";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PRODUCTS } from "@/constants/products"; 
import { ProductCard } from "@/components/product-card";
import NewsletterSection from "@/components/NewsletterSection";

export default async function Home() {
  // Recupero prodotti da Stripe
  const stripeProducts = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 8, // Mostriamo fino a 8 prodotti nella home
    active: true,
  });

  // Arricchimento dati con costanti locali
  const products = stripeProducts.data.map((stripeProduct) => {
    const localProduct = PRODUCTS.find((p) => p.id === stripeProduct.id);
    return {
      ...stripeProduct,
      images: localProduct ? localProduct.images : stripeProduct.images,
      shortDescription: localProduct?.shortDescription || "Design Sostenibile",
      salePrice: localProduct?.salePrice,
      variants: localProduct?.variants,
    };
  });

  return (
    <div className="space-y-20 pb-16">
      
      {/* SECTION HERO - GLASSMORPHISM DESIGN */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/30 py-16 backdrop-blur-xl sm:py-24 shadow-[0_0_40px_-14px_rgba(0,0,0,0.7)] mx-2">
        {/* Riflessi di luce soffusi dietro il vetro */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-neutral-200/40 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-neutral-100/30 blur-[100px]" />

        <div className="relative mx-auto grid grid-cols-1 items-center justify-items-center gap-12 px-8 sm:px-16 md:grid-cols-2">
          {/* Testo Hero */}
          <div className="max-w-md space-y-8 text-left">
            <h1 className="text-5xl font-extrabold tracking-tighter md:text-7xl text-black leading-[0.9]">
              Minimalist <br /> 3D Decor
            </h1>
            <p className="text-xl text-neutral-800/70 leading-relaxed font-medium">
              Arredamento moderno stampato in 3D. Pezzi unici per la tua casa, 
              progettati per durare e stupire.
            </p>
            <Button
              asChild
              className="rounded-full px-10 py-7 bg-black text-white hover:bg-neutral-800 transition-all text-lg shadow-xl hover:scale-105 active:scale-95"
            >
              <Link href="/products">Scopri la Collezione</Link>
            </Button>
          </div>

          {/* Immagine Hero con effetto profondità */}
          <div className="relative group w-full max-w-lg mx-auto lg:max-w-xl">
            <div className="absolute -inset-1 bg-white/40 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <Image
              alt="Collezione Principale"
              src={"/images/felpa.png"}
              width={600} 
              height={400}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
              className="relative rounded-2xl shadow-[0_0_40px_-14px_rgba(0,0,0,0.7)] transition-all duration-700 group-hover:scale-[1.03] object-cover aspect-[3/2] w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* SECTION TRENDING PRODUCTS */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black italic">Prodotti di Tendenza</h2>
            <p className="text-neutral-500 font-medium text-lg">I più scelti dalla nostra community.</p>
          </div>
          <Link 
            href="/products" 
            className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-neutral-500 hover:border-neutral-300 transition-all"
          >
            Vedi tutti
          </Link>
        </div>

        {/* GRID PRODOTTI */}
        <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}