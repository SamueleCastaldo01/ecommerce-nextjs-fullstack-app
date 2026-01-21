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
    const customerName = session.shipping_details?.name || "Cliente"; // Prende il nome dalla spedizione
    const shipping = session.shipping_details?.address;

    // HTML dei prodotti
    const itemsHtml = lineItems.data.map(item => `
    <li style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; list-style: none;">
        <strong>${item.description}</strong><br />
        Quantità: ${item.quantity} - €${(item.amount_total / 100).toFixed(2)}
    </li>
    `).join('');

    if (customerEmail) {
    await resend.emails.send({
        from: "3D Store <onboarding@resend.dev>",
        to: customerEmail,
        subject: `Conferma Ordine - Store 3D`,
        html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
            <h2>Grazie per l'ordine, ${customerName}!</h2>
            
            <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            <h4 style="margin-top:0">Prodotti acquistati:</h4>
            <ul style="padding:0">${itemsHtml}</ul>
            <p><strong>Totale: €${(session.amount_total / 100).toFixed(2)}</strong></p>
            </div>
        </div>
        `,
    });
    }
  }

  return new NextResponse("Success", { status: 200 });
}