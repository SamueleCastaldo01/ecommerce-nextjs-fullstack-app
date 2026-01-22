import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { getUserOrders } from "./get-user-orders";
import Link from "next/link";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  // Prendiamo il filtro dai parametri dell'URL, default "all"
  const currentFilter = searchParams.filter || "30";
  const orders = await getUserOrders(currentFilter);

  const filterOptions = [
    { label: "Tutti", value: "all" },
    { label: "Ultimi 30 giorni", value: "30" },
    { label: "90 giorni", value: "90" },
    { label: "180 giorni", value: "180" },
  ];

  return (
    <div className="container mx-auto px-4 py-0 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
            I miei Ordini
          </h1>
          <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest italic">
            Storico acquisti e spedizioni
          </p>
        </div>

        {/* BARRA FILTRI */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <Link
              key={opt.value}
              href={`/orders?filter=${opt.value}`}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${
                currentFilter === opt.value
                  ? "bg-black text-white shadow-lg scale-105"
                  : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed border-neutral-100 rounded-[3rem] bg-neutral-50/30">
          <p className="text-neutral-400 italic font-medium">
            Nessun ordine trovato per questo periodo.
          </p>
          <Link href="/shop" className="mt-4 inline-block text-black font-black border-b-2 border-black text-sm uppercase tracking-tighter">
            Vai allo shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Link href={`/orders/${order.id}`} key={order.id} className="block group outline-none">
              <Card className="rounded-[2rem] border-neutral-100 shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-neutral-300 group-active:scale-[0.98]">
                <div className="bg-neutral-50 px-8 py-5 border-b border-neutral-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest mb-1">Data</p>
                      <p className="text-sm font-bold text-black italic">
                        {format(new Date(order.created * 1000), "d MMM yyyy", { locale: it })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest mb-1">Totale</p>
                      <p className="text-sm font-bold text-black italic">€{(order.amount_total! / 100).toFixed(2)}</p>
                    </div>
                    <div>
                    <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest mb-1">Stato</p>
                    <div>
                    <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest mb-1">Stato</p>
                    {order.shipping_details?.tracking_number ? (
                        <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full font-black uppercase italic shadow-sm">
                        Spedito
                        </span>
                    ) : (
                        <span className="text-[9px] bg-green-50 border border-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase italic shadow-sm">
                        Pagato & In Elaborazione
                        </span>
                    )}
                    </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-mono text-neutral-300">#{order.id.slice(-8).toUpperCase()}</p>
                    <div className="h-8 w-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-45">
                        <path d="M12 3L3 12M12 3H5M12 3V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}