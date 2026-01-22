import { PRODUCTS } from "@/constants/products"; // Importa il tuo array locale

export async function getProducts(categorySlug?: string) {
  // Invece di chiamare Stripe, usiamo i dati del tuo file PRODUCTS
  if (!categorySlug || categorySlug === "all") {
    return PRODUCTS;
  }

  // Filtriamo l'array locale
  return PRODUCTS.filter(
    (product) => product.category.toLowerCase() === categorySlug.toLowerCase()
  );
}