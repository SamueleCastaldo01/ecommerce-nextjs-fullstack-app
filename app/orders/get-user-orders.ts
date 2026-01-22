"server-only";

import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function getUserOrders(days?: string) {
  const { userId } = await auth();
  if (!userId) return [];

  // Calcoliamo il timestamp di partenza se c'è un filtro
  let startTime: number | undefined = undefined;
  if (days && days !== "all") {
    const date = new Date();
    date.setDate(date.getDate() - parseInt(days));
    startTime = Math.floor(date.getTime() / 1000);
  }

  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: startTime ? { gte: startTime } : undefined,
    });

    return sessions.data.filter(
      (session) =>
        session.metadata?.clerkUserId === userId &&
        session.payment_status === "paid"
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}