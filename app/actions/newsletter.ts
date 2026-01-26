"use server";

import { db } from "@/lib/firebase-admin";

export async function subscribeNewsletterAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) return { error: "Email non valida" };

  try {
    const subscriberRef = db.collection("newsletter").doc(email.toLowerCase());
    const doc = await subscriberRef.get();

    if (doc.exists) {
      return { message: "Sei già dei nostri!" };
    }

    await subscriberRef.set({
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
    });

    return { success: true, message: "Benvenuto nello Studio!" };
  } catch (error) {
    return { error: "Errore durante l'iscrizione" };
  }
}