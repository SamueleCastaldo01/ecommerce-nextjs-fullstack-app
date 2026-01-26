"use server";

import { db } from "@/lib/firebase-admin";
import { resend } from "@/lib/resend";
import { STORE_SETTINGS } from "@/constants/settings";
import { revalidatePath } from "next/cache";

export async function shipOrderAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const trackingCode = formData.get("trackingCode") as string;
  const courierName = formData.get("courierName") as string;

  if (!orderId || !trackingCode) return;

  // 1. Recuperiamo i dati dell'ordine da Firebase
  const orderRef = db.collection("orders").doc(orderId);
  const doc = await orderRef.get();
  
  if (!doc.exists) return;
  const order = doc.data();

  // 2. Aggiorniamo lo stato su Firebase
  await orderRef.update({
    status: "shipped",
    courierName: courierName,
    trackingCode: trackingCode,
    shippedAt: new Date().toISOString(),
  });

  // 3. Mandiamo l'email di Tracking (Stiele Clean Studio)
  await resend.emails.send({
    from: `${STORE_SETTINGS.NAME} <onboarding@resend.dev>`,
    to: order?.customerEmail,
    subject: `Il tuo ordine ${STORE_SETTINGS.NAME} è in viaggio! 📦`,
    html: `
      <div style="font-family: sans-serif; padding: 40px; border: 1px solid #eee; max-width: 600px; margin: auto;">
        <h1 style="text-transform: uppercase; font-style: italic; font-weight: 900; letter-spacing: -1px;">In viaggio verso di te.</h1>
        <p>Ciao ${order?.customerName}, il tuo prodotto unico è stato stampato, controllato e affidato al corriere.</p>
        
        <div style="background: #000; color: #fff; padding: 30px; margin: 30px 0; border-radius: 12px;">
          <p style="margin: 0; font-size: 10px; text-transform: uppercase; opacity: 0.6;">Codice Tracking</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: 800; letter-spacing: 2px;">${trackingCode}</p>
        </div>

        <p style="font-size: 12px;">Puoi tracciare il pacco direttamente sul sito di ${courierName}.</p>
      </div>
    `,
  });

  // 4. Forza il refresh della pagina admin
  revalidatePath("/admin/orders");
}