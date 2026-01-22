import { getProducts } from "@/app/actions/get-products";
import { CATEGORIES } from "@/constants/categories";
import { CategoryBar } from "@/components/CategoryBar";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";

// In Next.js 15, params va tipizzato come Promise
export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  // FIX ERRORE: Dobbiamo fare l'await di params
  const { category } = await params;

  const currentCategory = CATEGORIES.find(c => c.slug === category);

  if (!currentCategory && category !== "all") {
    notFound();
  }

  const products = await getProducts(category);

  return (
    <div className="container mx-auto px-6 py-0">
      <div className="mb-16">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 text-black">
          {currentCategory?.name || "Collezione"}
        </h1>
        <p className="text-neutral-400 font-medium italic max-w-xl">
          {currentCategory?.description}
        </p>
      </div>

      {/* Usiamo la variabile 'category' appena estratta */}
      <CategoryBar activeSlug={category} />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
          {products.map((product) => (
            <ProductCard  product={product} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center border-2 border-dashed border-neutral-100 rounded-[3rem]">
          <p className="italic text-neutral-300 font-medium text-lg">
             Nessun pezzo disponibile in {currentCategory?.name}.
          </p>
        </div>
      )}
    </div>
  );
}