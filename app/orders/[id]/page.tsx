export const dynamic = "force-dynamic";
export const revalidate = 0;
import { format } from "date-fns";
import { it } from "date-fns/locale";
import Link from "next/link";
import { ChevronLeft, Box, CheckCircle2, Truck } from "lucide-react";
import { getOrderDetail } from "../get-order-detail";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderDetail(params.id);
  const address = order.shipping_details?.address;

  // 1. RECUPERO DATI DAI METADATA (Quelli che scrivi tu su Stripe)
  const trackingCode = order.metadata?.tracking_number;
  const carrierName = order.metadata?.carrier || "Standard Express"; 
  const isShipped = !!trackingCode;

  return (
    <div className="container mx-auto px-4 py-0 sm:py-0 max-w-3xl">
      {/* TORNA INDIETRO */}
      <Link href="/orders" className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors mb-8 font-bold uppercase text-[10px] tracking-widest outline-none">
        <ChevronLeft size={16} /> Torna ai miei ordini
      </Link>

      {/* HEADER ORDINE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2 text-black">Dettaglio Ordine</h1>
          <p className="text-neutral-400 font-mono text-[10px] uppercase tracking-widest">ID: {order.id.slice(-12)}</p>
        </div>
        
        {/* BADGE STATO */}
        <div className="flex items-center gap-2">
          {isShipped ? (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full font-black uppercase italic text-[11px] shadow-sm">
              <Truck size={14} /> Spedito
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-full font-black uppercase italic text-[11px] shadow-sm">
              <CheckCircle2 size={14} /> Pagato & In Elaborazione
            </div>
          )}
        </div>
      </div>

      {/* TRACKING BOX (Solo se esiste il codice nei metadata) */}
      {isShipped && (
        <div className="mb-12 p-8 bg-black text-white rounded-[2rem] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.3em] mb-2">Tracking Ordine</p>
              <p className="text-2xl font-mono font-bold tracking-tighter mb-1">{trackingCode}</p>
              <p className="text-[10px] text-neutral-400 italic font-medium">Corriere: <span className="text-white uppercase">{carrierName}</span></p>
            </div>
            <div className="h-14 w-14 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
              <Box size={24} />
            </div>
        </div>
      )}

      {/* GRIGLIA INFO INDIRIZZO E DATI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* INDIRIZZO DI SPEDIZIONE */}
        <div className="bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">Indirizzo di Spedizione</h3>
          <div className="text-sm font-bold text-black space-y-1 italic">
            <p className="not-italic font-black text-base mb-2">{order.shipping_details?.name}</p>
            <p>{address?.line1}</p>
            {address?.line2 && <p>{address.line2}</p>}
            <p>{address?.postal_code} {address?.city} ({address?.state})</p>
            <p className="uppercase">{address?.country}</p>
          </div>
        </div>

        {/* INFO PAGAMENTO */}
        <div className="p-8 border border-neutral-100 rounded-[2rem]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">Riepilogo Informazioni</h3>
          <div className="text-sm font-bold text-black space-y-4 italic">
            <div>
              <p className="text-[9px] font-black uppercase text-neutral-300 not-italic tracking-widest">Data Acquisto</p>
              <p>{format(new Date(order.created * 1000), "d MMMM yyyy", { locale: it })}</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-neutral-300 not-italic tracking-widest">Contatto Email</p>
              <p className="not-italic">{order.customer_details?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* LISTA PRODOTTI */}
      <div className="border-t border-neutral-100 pt-8 mb-12">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-8">Articoli nel pacco</h3>
        <div className="space-y-8">
          {order.line_items?.data.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center group">
              <div className="flex gap-6 items-center">
                <div className="h-20 w-20 bg-neutral-50 rounded-[1.5rem] border border-neutral-100 flex-shrink-0 flex items-center justify-center text-neutral-200">
                   <Box size={30} />
                </div>
                <div>
                  <p className="text-base font-black text-black italic uppercase leading-tight tracking-tighter">{item.description}</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mt-1">Quantità: {item.quantity}</p>
                </div>
              </div>
              <p className="text-lg font-black italic text-black font-mono">€{(item.amount_total / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TOTALE FINALE */}
        <div className="bg-neutral-950 rounded-[2.5rem] p-10 text-white shadow-2xl">
        <div className="space-y-3 mb-6">
            {/* SUBTOTALE (Totale meno Spedizione) */}
            <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
            <span>Subtotale Articoli</span>
            <span>€{((order.amount_total! - (order.shipping_cost?.amount_total || 0)) / 100).toFixed(2)}</span>
            </div>

            {/* SPEDIZIONE REALE DA STRIPE */}
            <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
            <span>Spedizione</span>
            {order.shipping_cost?.amount_total && order.shipping_cost.amount_total > 0 ? (
                <span>€{(order.shipping_cost.amount_total / 100).toFixed(2)}</span>
            ) : (
                <span className="text-green-400 underline decoration-2 underline-offset-4">Gratuita</span>
            )}
            </div>
        </div>

        <div className="flex justify-between items-center border-t border-white/10 pt-6">
            <span className="text-2xl font-black italic tracking-tighter uppercase underline decoration-white/20 decoration-4">Totale Ordine</span>
            <span className="text-3xl font-black italic tracking-tighter">€{(order.amount_total! / 100).toFixed(2)}</span>
        </div>
        </div>
    </div>
  );
}