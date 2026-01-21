import Image from "next/image";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PRODUCTS } from "@/constants/products"; // 1. Importa i tuoi prodotti locali

export default async function Home() {
  const stripeProducts = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 5,
    active: true,
  });

  // 2. Arricchiamo i prodotti Stripe con i dati locali
  const products = stripeProducts.data.map((stripeProduct) => {
    const localProduct = PRODUCTS.find((p) => p.id === stripeProduct.id);
    return {
      ...stripeProduct,
      // Se esiste il prodotto locale, usa le sue immagini, altrimenti quelle di Stripe
      images: localProduct ? localProduct.images : stripeProduct.images,
      shortDescription: localProduct?.shortDescription || ""
    };
  });

  return (
    <div className="space-y-16 pb-16">
      {/* SECTION HERO */}
      <section className="rounded-xl bg-neutral-50 py-12 sm:py-20 border border-neutral-200/50">
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-12 px-8 sm:px-16 md:grid-cols-2">
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl text-black">
              Minimalist <br /> 3D Decor
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed">
              Arredamento moderno stampato in 3D. Pezzi unici per la tua casa, 
              progettati per durare e stupire.
            </p>
            <Button
              asChild
              className="rounded-full px-8 py-6 bg-black text-white hover:bg-neutral-800 transition-all text-md"
            >
              <Link href="/products">Scopri la Collezione</Link>
            </Button>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <Image
              alt="Hero Image"
              // Usa la prima immagine del prodotto arricchito
              src={products[0]?.images[0] || "/placeholder.png"}
              className="relative rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] object-cover aspect-[3/2]"
              width={500}
              height={333} // Adattato per il 3:2
              priority
            />
          </div>
        </div>
      </section>

      {/* SECTION TRENDING PRODUCTS */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">Pezzi di Tendenza</h2>
            <p className="text-neutral-500">I più scelti dalla nostra community.</p>
          </div>
          <Link href="/products" className="text-sm font-medium underline underline-offset-4 hover:text-neutral-600">
            Vedi tutti
          </Link>
        </div>

        {/* GRID PRODOTTI */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => {
            const price = product.default_price as any;
            return (
              <div key={product.id} className="group relative">
                {/* 3. CAMBIATO ASPECT-SQUARE IN ASPECT-[3/2] */}
                <div className="aspect-[3/2] w-full overflow-hidden rounded-lg bg-neutral-100 group-hover:opacity-90 transition-opacity border border-neutral-200">
                  <Image
                    src={product.images[0]} // Questa ora è l'immagine locale!
                    alt={product.name}
                    width={400}
                    height={267} // Adattato per il 3:2
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="mt-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      <Link href={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      {product.shortDescription || "Decorazione 3D"}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-black">
                    {(price.unit_amount / 100).toLocaleString("it-IT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}