// app/products/[id]/page.tsx

import { notFound } from "next/navigation";
import { PRODUCTS } from "@/constants/products";
import { getRelatedProducts } from "@/app/actions/get-products";
import { ProductCard } from "@/components/product-card";
import { ProductDetail } from "@/components/product-detail";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) notFound();

  // Recuperiamo i correlati
  const relatedProducts = await getRelatedProducts(product as any);

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Dettaglio Prodotto */}
      <ProductDetail product={product as any} />

      {/* 2. Sezione Correlati */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-6 py-24 border-t border-neutral-100">
            <h3 className="text-3xl font-black italic uppercase mb-12">Potrebbe interessarti</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
            </div>
        </section>
        )}
    </main>
  );
}