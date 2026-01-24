import { getProducts } from "@/app/actions/get-products";
import { CATEGORIES } from "@/constants/categories";
import { CategoryBar } from "@/components/CategoryBar";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string; min?: string; max?: string; sort?: string; page?: string }>;
}) {
  const { category } = await params;
  const { sub, min, max, sort, page } = await searchParams;

  const currentPage = parseInt(page || "1");
  const currentCategory = CATEGORIES.find(c => c.slug === category);

  if (!currentCategory && category !== "all") {
    notFound();
  }

  // Recuperiamo prodotti e info paginazione
  const { products, totalPages } = await getProducts(category, sub, min, max, sort, currentPage, 8);

  // Helper per mantenere i filtri attivi negli URL della paginazione
  const createQueryString = (newPage: number) => {
    const params = new URLSearchParams();
    if (sub) params.set("sub", sub);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    if (sort) params.set("sort", sort);
    params.set("page", newPage.toString());
    return params.toString();
  };

  return (
    <div className="container mx-auto px-6 py-0">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 text-black leading-[0.8]">
          {currentCategory?.name || "Collezione"}
        </h1>
        <p className="text-neutral-400 font-medium italic max-w-xl text-sm">
          {currentCategory?.description || "Esplora tutta la produzione 3D di Clean Studio."}
        </p>
      </div>

      <CategoryBar activeSlug={category} />

      {/* FILTRI EXTRA */}
      <div className="mt-4 mb-12 flex flex-col gap-8 pt-0 border-t border-neutral-50">
        
        {/* SOTTOCATEGORIE */}
        {currentCategory?.subcategories && (
          <div className="flex flex-wrap gap-2">
            <Link 
              href={`/${category}`}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${!sub ? 'bg-black text-white border-black' : 'text-neutral-400 border-neutral-400 hover:border-black hover:text-black'}`}
            >
              Tutte
            </Link>
            {currentCategory.subcategories.map((s) => (
              <Link
                key={s}
                href={`/${category}?sub=${s}`}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${sub === s ? 'bg-black text-white border-black' : 'text-neutral-400 border-neutral-400 hover:border-black hover:text-black'}`}
              >
                {s}
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* RANGE PREZZO */}
          <div className="flex items-center gap-6">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-300 italic">Budget:</span>
            <div className="flex gap-4">
              <Link href={`/${category}?min=0&max=2000${sub ? `&sub=${sub}` : ''}`} className="text-[10px] font-bold uppercase hover:text-black text-neutral-400 underline-offset-4 hover:underline">Sotto i 20€</Link>
              <Link href={`/${category}?min=2000&max=5000${sub ? `&sub=${sub}` : ''}`} className="text-[10px] font-bold uppercase hover:text-black text-neutral-400 underline-offset-4 hover:underline">20€ - 50€</Link>
              <Link href={`/${category}`} className="text-[10px] font-bold uppercase text-red-500 hover:underline underline-offset-4">Reset</Link>
            </div>
          </div>

          {/* ORDINAMENTO */}
          <div className="flex items-center gap-6">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-300 italic">Ordina:</span>
            <div className="flex gap-4">
              <Link href={`/${category}?sort=price_asc${sub ? `&sub=${sub}` : ''}`} className={`text-[10px] font-bold uppercase ${sort === 'price_asc' ? 'text-black underline underline-offset-4' : 'text-neutral-400 hover:text-black'}`}>Prezzo ↓</Link>
              <Link href={`/${category}?sort=price_desc${sub ? `&sub=${sub}` : ''}`} className={`text-[10px] font-bold uppercase ${sort === 'price_desc' ? 'text-black underline underline-offset-4' : 'text-neutral-400 hover:text-black'}`}>Prezzo ↑</Link>
            </div>
          </div>
        </div>
      </div>

      {/* GRID PRODOTTI */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 mb-20">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* PAGINAZIONE */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-10 border-t border-neutral-100">
              <Link
                href={`/${category}?${createQueryString(currentPage - 1)}`}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 ${currentPage === 1 ? 'opacity-20 pointer-events-none' : 'hover:text-neutral-400'}`}
              >
                Indietro
              </Link>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <Link
                    key={i}
                    href={`/${category}?${createQueryString(i + 1)}`}
                    className={`h-8 w-8 flex items-center justify-center rounded-full text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-black text-white' : 'text-neutral-400 hover:bg-neutral-50'}`}
                  >
                    {i + 1}
                  </Link>
                ))}
              </div>

              <Link
                href={`/${category}?${createQueryString(currentPage + 1)}`}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 ${currentPage === totalPages ? 'opacity-20 pointer-events-none' : 'hover:text-neutral-400'}`}
              >
                Avanti
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="py-32 text-center border-2 border-dashed border-neutral-100 rounded-[3rem]">
          <p className="italic text-neutral-300 font-medium text-lg text-balance">
             Nessun pezzo corrisponde ai filtri selezionati in questa categoria.
          </p>
        </div>
      )}
    </div>
  );
}