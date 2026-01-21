import { ProductList } from "@/components/product-list";
import { stripe } from "@/lib/stripe";
import { PRODUCTS } from "@/constants/products";

export default async function ProductsPage() {
  // 1. Prendiamo i prodotti da Stripe
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });

  // 2. Uniamo i dati di Stripe con quelli locali
  const enrichedProducts = products.data.map((stripeProduct) => {
    // Cerchiamo se questo prodotto Stripe ha un corrispettivo locale
    const localProduct = PRODUCTS.find((p) => p.id === stripeProduct.id);

    return {
      ...stripeProduct,
      // Se esiste il prodotto locale, usiamo le sue immagini, 
      // altrimenti teniamo quella di Stripe (fallback)
      images: localProduct ? localProduct.images : stripeProduct.images,
    };
  });

  // Convertiamo in un oggetto semplice per evitare problemi di serializzazione Next.js
  const plainProducts = JSON.parse(JSON.stringify(enrichedProducts));

  return (
    <div className="pb-8">
      <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground text-center mb-8">
        Tutti i Prodotti
      </h1>
      {/* Passiamo la lista arricchita al componente ProductList */}
      <ProductList products={plainProducts} />
    </div>
  );
}