import { db } from "@/lib/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { shipOrderAction } from "../actions"; // Importa la tua action
import { ArrowLeft, Box, Calendar, CreditCard, ExternalLink, MapPin, Truck, User } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_CLERK_ID) redirect("/");

  // Fetch Ordine
  const doc = await db.collection("orders").doc(id).get();
  if (!doc.exists) return <div>Ordine non trovato</div>;
  const order = { id: doc.id, ...doc.data() } as any;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* NAVIGAZIONE */}
      <div className="mb-8">
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-black transition-colors mb-4">
          <ArrowLeft size={14} /> TORNA ALLA LISTA
        </Link>
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Ordine #{order.id.slice(-6)}</h1>
          
          <div className="flex gap-2">
            {order.paymentIntentId && (
              <a 
                href={`https://dashboard.stripe.com/${process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID || ''}/test/payments/${order.paymentIntentId}`}
                target="_blank"
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors flex items-center gap-2"
              >
                <CreditCard size={14} /> Vedi su Stripe
              </a>
            )}
            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${order.status === 'paid' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
              {order.status === 'paid' ? 'In Produzione' : 'Spedito'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNA SINISTRA: Prodotti */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">
              <Box size={14} /> Articoli ({order.items.length})
            </h3>
            
            <div className="space-y-6">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-4 items-start border-b border-zinc-50 pb-6 last:pb-0 last:border-0">
                  {/* FOTO PRODOTTO */}
                  <div className="h-20 w-20 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 shrink-0">
                    {item.image ? (
                      <img src={item.image} alt="Product" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-zinc-300 font-bold text-xs">NO IMG</div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-bold text-lg leading-tight">{item.description}</p>
                    {/* Se hai varianti salvate nel description tipo "Nome (Variante)", sono già qui */}
                    <div className="flex items-center gap-4 mt-2">
                       <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded text-zinc-600">x{item.quantity}</span>
                       <span className="text-sm font-bold">€ {(item.amount / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center">
              <span className="text-zinc-400 font-bold text-sm">Totale Ordine</span>
              <span className="text-3xl font-black tracking-tighter">€ {(order.amountTotal / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* BOX SPEDIZIONE (Se pagato, mostra form. Se spedito, mostra info) */}
          <div className="bg-zinc-900 text-white rounded-[2rem] p-8 shadow-xl">
             <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">
              <Truck size={14} /> Gestione Spedizione
            </h3>

            {order.status === 'paid' ? (
              <form action={shipOrderAction} className="space-y-4">
                 <input type="hidden" name="orderId" value={order.id} />
                 
                 <div className="grid grid-cols-2 gap-4">
                    <select name="courierName" className="bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm font-bold outline-none" required>
                      <option value="">Seleziona Corriere</option>
                      <option value="BRT">BRT</option>
                      <option value="GLS">GLS</option>
                      <option value="DHL">DHL</option>
                      <option value="SDA">SDA</option>
                      <option value="Poste Italiane">Poste</option>
                    </select>
                    <input name="trackingCode" placeholder="Codice Tracking" className="bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm font-bold outline-none placeholder:text-zinc-600" required />
                 </div>
                 
                 <button className="w-full bg-white text-black rounded-xl py-4 text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                    Conferma e Invia Email
                 </button>
              </form>
            ) : (
              <div className="bg-zinc-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                   <p className="text-[10px] text-zinc-400 font-bold uppercase">Spedito con {order.courierName}</p>
                   <p className="text-xl font-mono font-bold mt-1">{order.trackingCode}</p>
                   <p className="text-[10px] text-zinc-500 mt-1">il {new Date(order.shippedAt).toLocaleDateString()}</p>
                </div>
                <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-black">
                  <Truck size={20} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLONNA DESTRA: Dettagli Cliente */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
             <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">
              <User size={14} /> Cliente
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-zinc-100 rounded-full flex items-center justify-center font-black text-lg">
                {order.customerName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-lg leading-none">{order.customerName}</p>
                <p className="text-xs text-zinc-400 mt-1">{order.customerEmail}</p>
              </div>
            </div>
            <div className="text-xs font-medium text-zinc-500 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
               <Calendar size={12} className="inline mr-2"/>
               Ordinato il: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
             <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">
              <MapPin size={14} /> Indirizzo
            </h3>
            <p className="font-bold text-lg leading-tight mb-1">{order.shippingAddress.line1}</p>
            <p className="text-zinc-500 font-medium">
              {order.shippingAddress.postal_code}, {order.shippingAddress.city}<br/>
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}