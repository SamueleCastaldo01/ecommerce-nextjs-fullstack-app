import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";
import { db } from "@/lib/firebase-admin";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { STORE_SETTINGS } from "@/constants/settings";

export async function POST(req: Request) {
  const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${STORE_SETTINGS.LOGO_URL}`;
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

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

    const shippingDetails = session.shipping_details || session.customer_details?.shipping;
    const shippingAddress = shippingDetails?.address || session.customer_details?.address;
    const customerName = shippingDetails?.name || session.customer_details?.name || "Cliente";
    const customerEmail = session.customer_details?.email;

    // 1. RECUPERO ARTICOLI CON ESPANSIONE IMMAGINI
    // Aggiungiamo 'expand' per essere sicuri di ricevere i dati del prodotto (immagini incluse)
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });

    // 2. CREAZIONE OGGETTO ORDINE
    const orderData = {
      orderId: session.id,
      paymentIntentId: session.payment_intent,
      customerEmail: customerEmail || "email@sconosciuta.it",
      customerName: customerName,
      amountTotal: session.amount_total,
      currency: session.currency,
      status: "paid",
      createdAt: new Date().toISOString(),
      shippingAddress: {
        line1: shippingAddress?.line1 ?? "",
        city: shippingAddress?.city ?? "",
        postal_code: shippingAddress?.postal_code ?? "",
        country: shippingAddress?.country ?? "",
      },
      // FIX SINTASSI QUI SOTTO:
      items: lineItems.data.map((item) => {
        const product = item.price?.product as any; // Cast necessario perché Stripe può restituire string o object
        const productImage = product?.images?.[0] || null;

        return {
          description: item.description || "Prodotto 3D",
          quantity: item.quantity,
          amount: item.amount_total,
          image: productImage, // Ora salviamo l'immagine corretta
        };
      }),
      trackingCode: null,
    };

    try {
      await db.collection("orders").doc(session.id).set(orderData);

      // --- STILE COMUNE ---
      const mainFont = "font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;";
      const secondaryColor = "color: #71717a;";
      const accentColor = "color: #000000;";

      // --- HTML PRODOTTI ---
      const itemsHtml = orderData.items.map(item => `
        <tr style="border-bottom: 1px solid #e4e4e7;">
          <td style="padding: 16px 0; ${mainFont} font-size: 14px; ${accentColor}">
            <span style="font-weight: 800; text-transform: uppercase;">${item.description}</span><br/>
            <span style="${secondaryColor} font-size: 12px;">Quantità: ${item.quantity}</span>
          </td>
          <td style="padding: 16px 0; text-align: right; ${mainFont} font-weight: 700; font-size: 14px;">
            €${(item.amount / 100).toFixed(2)}
          </td>
        </tr>
      `).join('');

      // --- 1. EMAIL PER IL CLIENTE ---
      if (customerEmail) {
        await resend.emails.send({
          from: `${STORE_SETTINGS.NAME} <onboarding@resend.dev>`,
          to: customerEmail,
          subject: `Conferma Ordine #${session.id.slice(-6).toUpperCase()} - ${STORE_SETTINGS.NAME}`,
          html: `
            <div style="background-color: #ffffff; ${mainFont} padding: 40px 20px;">
              <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; padding: 40px; border-radius: 24px;">
                
                <table style="width: 100%; margin-bottom: 32px;">
                  <tr>
                    <td style="vertical-align: middle; width: 50px;">
                      <img src="${logoUrl}" alt="Logo" width="40" height="40" style="display: block; border-radius: 50%; object-fit: cover;" />
                    </td>
                    <td style="vertical-align: middle; padding-left: 12px;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; font-style: italic; color: #000;">
                        ${STORE_SETTINGS.NAME}
                      </h1>
                    </td>
                  </tr>
                </table>

                <p style="margin-top: 24px; font-size: 16px; font-weight: 500;">Grazie per il tuo ordine, ${customerName.split(' ')[0]}.</p>
                <p style="${secondaryColor} font-size: 14px; line-height: 1.6;">
                  Il tuo prodotto unico è entrato ufficialmente in coda di produzione. Lo stamperemo con cura e ti avviseremo appena sarà pronto per il viaggio.
                </p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 32px;">
                  <thead>
                    <tr style="border-bottom: 2px solid #000;">
                      <th style="text-align: left; padding-bottom: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Dettaglio</th>
                      <th style="text-align: right; padding-bottom: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Prezzo</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>

                <div style="margin-top: 24px; text-align: right;">
                  <p style="margin: 0; font-size: 12px; ${secondaryColor} text-transform: uppercase;">Totale Ordine</p>
                  <p style="margin: 0; font-size: 24px; font-weight: 900;">€${(orderData.amountTotal / 100).toFixed(2)}</p>
                </div>

                <div style="margin-top: 40px; padding: 24px; background-color: #f4f4f5; border-radius: 16px;">
                  <p style="margin: 0 0 8px 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Spedito a:</p>
                  <p style="margin: 0; font-size: 13px; line-height: 1.4; ${secondaryColor}">
                    ${orderData.customerName}<br/>
                    ${orderData.shippingAddress.line1}<br/>
                    ${orderData.shippingAddress.postal_code}, ${orderData.shippingAddress.city}
                  </p>
                </div>

                <p style="margin-top: 40px; font-size: 11px; ${secondaryColor} text-align: center; font-style: italic;">
                  Hai domande? Rispondi a questa email o scrivici a ${STORE_SETTINGS.SUPPORT_EMAIL}
                </p>
              </div>
            </div>
          `,
        });
      }

      // --- 2. EMAIL PER TE (ADMIN) ---
      await resend.emails.send({
        from: `${STORE_SETTINGS.NAME} <onboarding@resend.dev>`,
        to: "castaldo.samuele@gmail.com",
        subject: `🚀 NUOVA VENDITA - ${customerName}`,
        html: `
          <div style="${mainFont} background-color: #000000; padding: 40px 20px; color: #ffffff;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #333; padding: 40px;">
              
              <table style="width: 100%; margin-bottom: 32px;">
                <tr>
                   <td style="vertical-align: middle; width: 50px;">
                     <img src="${logoUrl}" alt="Logo" width="40" height="40" style="display: block; border-radius: 50%; object-fit: cover; border: 2px solid #fff;" />
                   </td>
                   <td style="vertical-align: middle; padding-left: 12px;">
                     <h1 style="font-size: 40px; font-weight: 900; letter-spacing: -2px; margin: 0; font-style: italic;">SOLD!</h1>
                   </td>
                </tr>
              </table>

              <p style="font-size: 18px; margin-top: 8px; opacity: 0.8;">Hai un nuovo ordine da produrre.</p>
              
              <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 24px;">
                <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #a1a1aa;">Cosa stampare:</p>
                <ul style="padding: 0; list-style: none;">
                  ${orderData.items.map(i => `<li style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">${i.quantity}x ${i.description}</li>`).join('')}
                </ul>
              </div>

              <div style="margin-top: 32px; background-color: #18181b; padding: 24px;">
                <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #a1a1aa; margin-bottom: 8px;">Logistica Spedizione:</p>
                <p style="font-size: 14px; margin: 0; line-height: 1.5;">
                  ${orderData.customerName}<br/>
                  ${orderData.shippingAddress.line1}<br/>
                  ${orderData.shippingAddress.postal_code}, ${orderData.shippingAddress.city} (${orderData.shippingAddress.country})
                </p>
                <p style="margin-top: 16px; font-size: 12px; font-weight: 700;">Email: ${customerEmail}</p>
              </div>

              <a href="https://dashboard.stripe.com/payments/${session.payment_intent}" style="display: inline-block; margin-top: 32px; background-color: #ffffff; color: #000000; padding: 16px 32px; font-weight: 900; text-decoration: none; text-transform: uppercase; font-size: 12px;">Vedi su Stripe</a>
            </div>
          </div>
        `,
      });

      console.log("✅ Ordine salvato e email inviate con stile.");

    } catch (error) {
      console.error("❌ Errore interno al Webhook:", error);
    }
  }

  return new NextResponse("Success", { status: 200 });
}