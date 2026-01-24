import { PRODUCTS, Product } from "@/constants/products";

export async function getProducts(
  categorySlug?: string, 
  subcategory?: string, 
  minPrice?: string, 
  maxPrice?: string, 
  sort?: string,
  page: number = 1,
  limit: number = 8
) {
  let filtered = [...PRODUCTS];

  // 1. Filtro Categoria
  if (categorySlug && categorySlug !== "all") {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === categorySlug.toLowerCase()
    );
  }

  // 2. Filtro Sottocategoria
  if (subcategory) {
    filtered = filtered.filter(
      (p) => p.subcategory?.toLowerCase() === subcategory.toLowerCase()
    );
  }

  // 3. Filtro Prezzo (converte stringa in numero centesimi)
  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= parseInt(maxPrice));
  }

  // 4. Ordinamento
  if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);

  // 5. Paginazione
  const totalProducts = filtered.length;
  const totalPages = Math.ceil(totalProducts / limit);
  const offset = (page - 1) * limit;
  const paginatedItems = filtered.slice(offset, offset + limit);

  return {
    products: paginatedItems,
    totalPages,
    totalProducts,
  };
}

export async function getRelatedProducts(currentProduct: Product, limit: number = 4) {
  let related: Product[] = [];

  // 1. PRIORITÀ: Scelti a mano (Se esistono)
  if (currentProduct.relatedIds && currentProduct.relatedIds.length > 0) {
    related = PRODUCTS.filter(p => 
      currentProduct.relatedIds?.includes(p.id) && p.id !== currentProduct.id
    );
  }

  // 2. BACKUP: Se non abbiamo ancora raggiunto il limite, cerchiamo nella Sottocategoria
  if (related.length < limit) {
    const bySubcategory = PRODUCTS.filter(p => 
      p.subcategory === currentProduct.subcategory && 
      p.id !== currentProduct.id && 
      !related.find(r => r.id === p.id) // Evitiamo duplicati
    );
    related = [...related, ...bySubcategory].slice(0, limit);
  }

  // 3. ULTIMA SPIAGGIA: Se siamo ancora sotto il limite, cerchiamo nella Categoria generale
  if (related.length < limit) {
    const byCategory = PRODUCTS.filter(p => 
      p.category === currentProduct.category && 
      p.id !== currentProduct.id && 
      !related.find(r => r.id === p.id)
    );
    related = [...related, ...byCategory].slice(0, limit);
  }

  return related.slice(0, limit);
}