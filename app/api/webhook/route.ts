import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    

    const customerEmail = session.customer_details?.email;
    const customerName = session.shipping_details?.name || "Cliente";
    const shipping = session.shipping_details?.address;
    const shippingCost = session.total_details?.amount_shipping || 0;

    // HTML dei prodotti per l'email
    const itemsHtml = lineItems.data.map(item => `
    <li style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; list-style: none;">
        <strong>${item.description}</strong><br />
        Quantità: ${item.quantity} - €${(item.amount_total / 100).toFixed(2)}
    </li>
    `).join('');

    // --- 1. INVIO EMAIL AL CLIENTE ---
    if (customerEmail) {
      await resend.emails.send({
        from: "Clean Studio <onboarding@resend.dev>",
        to: customerEmail,
        subject: `Conferma Ordine - Clean Studio 3D`,
        html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
            <h2>Grazie per l'ordine, ${customerName}!</h2>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
              <h4 style="margin-top:0">Prodotti acquistati:</h4>
              <ul style="padding:0">${itemsHtml}</ul>
              <p><strong>Totale: €${(session.amount_total / 100).toFixed(2)}</strong></p>
              <p>Spedizione: ${shippingCost === 0 ? 'GRATIS' : `€${(shippingCost / 100).toFixed(2)}`}</p>
            </div>
            <p style="font-size: 12px; color: #666;">Riceverai una notifica quando il pacco sarà spedito.</p>
        </div>
        `,
      });
    }

    // --- 2. INVIO NOTIFICA A TE (PROPRIETARIO) ---
    // Inserisci qui la tua email personale
    await resend.emails.send({
      from: "Clean Studio <onboarding@resend.dev>",
      to: "castaldo.samuele@gmail.com",
      subject: `🚀 Nuovo Ordine da produrre! - ${customerName}`,
      html: `
      <div style="font-family: sans-serif; padding: 20px; border: 2px solid #000;">
          <h1 style="color: #000;">Nuova vendita effettuata!</h1>
          <p>Hai un nuovo pezzo da stampare per <strong>${customerName}</strong>.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Dettagli Ordine:</h3>
            <ul style="padding:0">${itemsHtml}</ul>
            <p><strong>Incasso totale: €${(session.amount_total / 100).toFixed(2)}</strong></p>
          </div>

          <div style="background: #fff; border: 1px solid #ddd; padding: 15px;">
            <h3>Indirizzo di Spedizione:</h3>
            <p>
              ${shipping?.line1}<br>
              ${shipping?.postal_code} ${shipping?.city} (${shipping?.country})
            </p>
            <p><strong>Email Cliente:</strong> ${customerEmail}</p>
          </div>

          <p style="margin-top: 20px;">Vai sulla Dashboard di Stripe per gestire la spedizione.</p>
      </div>
      `,
    });
  }

  return new NextResponse("Success", { status: 200 });
}