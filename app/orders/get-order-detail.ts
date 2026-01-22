"server-only";

import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function getOrderDetail(sessionId: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("Non autorizzato");

  // Recuperiamo la sessione specifica espandendo i line_items (i prodotti)
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  // Controllo sicurezza: l'ordine appartiene all'utente loggato?
  if (session.metadata?.clerkUserId !== userId) {
    throw new Error("Ordine non trovato");
  }

  return session;
}