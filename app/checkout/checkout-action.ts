"use server";

import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server"; 
import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const checkoutAction = async (formData: FormData): Promise<void> => {
  // 1. Recuperiamo l'utente loggato da Clerk
  const { userId } = await auth();
  const user = await currentUser();

  // Controllo di sicurezza: se non c'è l'utente, blocchiamo tutto
  if (!userId) {
    throw new Error("Devi essere loggato per fare un acquisto");
  }

  // 2. Recuperiamo i prodotti dal carrello inviati dal form
  const itemsJson = formData.get("items") as string;

  const items = JSON.parse(formData.get("items") as string);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const isDevelopment = process.env.NODE_ENV === 'development';

    // 3. Mappiamo i prodotti nel formato richiesto da Stripe
  const line_items = await Promise.all(
    items.map(async (item: any) => {
      // 1. Recuperiamo comunque i dati da Stripe per avere la "officialImage"
      const stripeProduct = await stripe.products.retrieve(item.id);
      const officialImage = stripeProduct.images[0];
      
      // 2. Prepariamo l'URL della tua immagine locale (quella nel codice)
      const localImageUrl = `${baseUrl}${item.image}`;

      // 3. LOGICA CONDIZIONALE RICHIESTA
      let finalCheckoutImage;

      if (isDevelopment) {
        // SE SIAMO IN LOCALE: 
        // Priorità a Stripe (così la vedi nel checkout), altrimenti locale
        finalCheckoutImage = officialImage ? officialImage : localImageUrl;
      } else {
        // SE SIAMO IN PRODUZIONE (Vercel): 
        // Priorità alla tua immagine locale, altrimenti Stripe come backup
        finalCheckoutImage = localImageUrl ? localImageUrl : officialImage;
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.variant ? `${item.name} (${item.variant})` : item.name,
            images: [finalCheckoutImage], // Stripe vuole sempre un array
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      };
    })
  );

  // 4. Creiamo la sessione di pagamento su Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "paypal"],
    line_items,
    mode: "payment",
    
    customer_email: user?.emailAddresses[0].emailAddress,
    
    // 1. Metadati sulla Sessione (quelli che hai già)
    metadata: {
      clerkUserId: userId,
    },

    // 2. AGGIUNGI QUESTO: Metadati sul Pagamento effettivo
    payment_intent_data: {
      metadata: {
        clerkUserId: userId,
      },
    },

    allow_promotion_codes: true,
    shipping_address_collection: {
      allowed_countries: ['IT'], 
    },
    phone_number_collection: {
      enabled: true,
    },

    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  // 6. Reindirizziamo l'utente alla pagina di pagamento di Stripe
  redirect(session.url!);
};