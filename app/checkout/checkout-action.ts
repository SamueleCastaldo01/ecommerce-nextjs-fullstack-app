"use server";

import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server"; 
import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
import { SHIPPING_SETTINGS } from "@/constants/settings";

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

  const cartSummary = items.map((i: any) => `${i.name} (${i.variant || 'No var'}) x${i.quantity}`).join(', ');

  //costi di spedizione condizionali
  const cartTotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const threshold = 5000; // 50€ in centesimi

  // 4. Creiamo la sessione di pagamento su Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "paypal"],
    line_items,
    mode: "payment",
    shipping_options: [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          // Se il totale è >= 50€, mette 0, altrimenti 6€
          amount: cartTotal >= SHIPPING_SETTINGS.THRESHOLD ? 0 : SHIPPING_SETTINGS.BASE_COST,
          currency: SHIPPING_SETTINGS.CURRENCY,
        },
        display_name: cartTotal >= SHIPPING_SETTINGS.THRESHOLD ? 'Spedizione Gratuita' : 'Spedizione Standard',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: SHIPPING_SETTINGS.MIN_DAYS },
          maximum: { unit: 'business_day', value: SHIPPING_SETTINGS.MAX_DAYS },
        },
      },
    },
  ],
    
    customer_email: user?.emailAddresses[0].emailAddress,
    
    // 1. Metadati sulla Sessione (quelli che hai già)
    metadata: {
      clerkUserId: userId,
      orderItems: cartSummary.substring(0, 500),
    },

    // 2. AGGIUNGI QUESTO: Metadati sul Pagamento effettivo
    payment_intent_data: {
      metadata: {
        clerkUserId: userId,
        orderItems: cartSummary.substring(0, 500),
      },
    },

    allow_promotion_codes: true,
    shipping_address_collection: {
      allowed_countries: SHIPPING_SETTINGS.ALLOWED_COUNTRIES as any,
    },
    phone_number_collection: {
      enabled: true,
    },

    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  // 6. Reindirizziamo l'utente alla pagina di pagamento di Stripe
  redirect(session.url!);
};