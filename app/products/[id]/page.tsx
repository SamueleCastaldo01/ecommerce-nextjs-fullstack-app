import { ProductDetail } from "@/components/product-detail";
import { stripe } from "@/lib/stripe";
import { PRODUCTS } from "@/constants/products"; // Importa i tuoi dati locali
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Cerchiamo il prodotto nei dati locali usando l'ID
  const localProduct = PRODUCTS.find((p) => p.id === id);

  // 2. Prendiamo i dati da Stripe per avere il prezzo aggiornato
  // Se non lo trova su Stripe, la pagina va in errore
  const stripeProduct = await stripe.products.retrieve(id, {
    expand: ["default_price"],
  });

  if (!stripeProduct) return notFound();

  // 3. Creiamo un oggetto unico che unisce i due mondi
  // Diamo priorità alle immagini locali se esistono
  const enrichedProduct = {
    ...JSON.parse(JSON.stringify(stripeProduct)),
    images: localProduct ? localProduct.images : stripeProduct.images,
    longDescription: localProduct?.longDescription || stripeProduct.description,
    variants: localProduct?.variants || [],
    hasSizes: localProduct?.hasSizes,
    salePrice: localProduct?.salePrice,
  };

  return <ProductDetail product={enrichedProduct} />;
}