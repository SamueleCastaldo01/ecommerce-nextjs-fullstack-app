import { db } from "@/lib/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { shipOrderAction } from "./actions";
import Link from "next/link";
import { ExternalLink, Filter } from "lucide-react";
import SearchInput from "@/components/admin/SearchInput"; // Il componente creato sopra

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { userId } = await auth();
  // Aspettiamo i parametri
  const params = await searchParams;
  
  // LOGICA FILTRI: Se non c'è status e non c'è ricerca, metti "paid" (da spedire)
  const statusFilter = params.status || (params.q ? undefined : "paid");
  const searchQuery = params.q?.toLowerCase();

  if (userId !== process.env.ADMIN_CLERK_ID) redirect("/");

  // 1. Fetch Iniziale (Limitiamo a 50 per performance)
  let query = db.collection("orders").orderBy("createdAt", "desc");
  
  // Applichiamo il filtro status su Firebase solo se richiesto
  if (statusFilter) {
    query = query.where("status", "==", statusFilter);
  }

  const snapshot = await query.limit(50).get();
  let orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[];

  // 2. Filtro Ricerca (Firebase non ha "LIKE", lo facciamo in memoria sui 50 risultati o cerchiamo ID specifico)
  if (searchQuery) {
    orders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(searchQuery) ||
        o.customerName.toLowerCase().includes(searchQuery) ||
        o.customerEmail.toLowerCase().includes(searchQuery)
    );
  }

  // Calcolo Statistiche Rapide
  const revenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.amountTotal : 0), 0) / 100;

  return (
    <div className="min-h-screen bg-zinc-50/50 p-4 md:p-8 pt-0">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Gestione Ordini</h1>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">
              Visualizzati: {orders.length} | Incasso vista: €{revenue.toFixed(2)}
            </p>
          </div>
          <SearchInput />
        </div>

        {/* BARRA FILTRI */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="flex bg-white p-1.5 rounded-xl border border-zinc-200 shadow-sm">
            <FilterLink label="Da Spedire" value="paid" active={statusFilter === "paid"} />
            <FilterLink label="Spediti" value="shipped" active={statusFilter === "shipped"} />
            <FilterLink label="Tutti" value="" active={!statusFilter && !params.q} />
          </div>
          {/* Qui potresti aggiungere un Dropdown per la Data in futuro */}
        </div>

        {/* LISTA ORDINI */}
        <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-zinc-400 tracking-widest">ID & Data</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-zinc-400 tracking-widest">Cliente</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-zinc-400 tracking-widest">Anteprima</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-zinc-400 tracking-widest">Logistica</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-zinc-400 tracking-widest">Azione</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors group">
                    
                    {/* DATA & ID */}
                    <td className="px-6 py-6 align-top w-32">
                      <Link href={`/admin/orders/${order.id}`} className="block hover:underline">
                        <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] font-mono text-zinc-400 uppercase mt-1">#{order.id.slice(-6)}</p>
                      </Link>
                      {order.paymentIntentId && (
                         <a 
                         href={`https://dashboard.stripe.com/${process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID || ''}/test/payments/${order.paymentIntentId}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-2 hover:bg-blue-100 transition-colors"
                       >
                         Stripe <ExternalLink size={8} />
                       </a>
                      )}
                    </td>

                    {/* CLIENTE */}
                    <td className="px-6 py-6 align-top">
                      <Link href={`/admin/orders/${order.id}`} className="group-hover:text-zinc-600 transition-colors">
                        <p className="font-black text-sm uppercase leading-none">{order.customerName}</p>
                        <p className="text-xs text-zinc-500 mt-1">{order.customerEmail}</p>
                      </Link>
                    </td>

                    {/* PRODOTTI (Semplificato) */}
                    <td className="px-6 py-6 align-top">
                      <div className="flex flex-col gap-1">
                        {order.items?.slice(0, 3).map((item: any, i: number) => (
                          <span key={i} className="text-xs font-medium text-zinc-600">
                            <span className="font-bold text-black">{item.quantity}x</span> {item.description}
                          </span>
                        ))}
                        {order.items?.length > 3 && (
                          <span className="text-[10px] text-zinc-400 font-bold">+{order.items.length - 3} altri...</span>
                        )}
                      </div>
                    </td>

                    {/* LOGISTICA */}
                    <td className="px-6 py-6 align-top">
                       <p className="text-xs font-bold text-zinc-700">
                        {order.shippingAddress.city}, {order.shippingAddress.country}
                      </p>
                      {order.courierName && (
                        <span className="inline-block mt-1 text-[9px] font-black uppercase bg-zinc-100 px-2 py-1 rounded text-zinc-500">
                          {order.courierName}
                        </span>
                      )}
                    </td>

                    {/* AZIONE RAPIDA */}
                    <td className="px-6 py-6 text-right align-top">
                      {order.status === "paid" ? (
                        <div className="flex flex-col gap-2 items-end">
                          <Link 
                            href={`/admin/orders/${order.id}`}
                            className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                          >
                            Gestisci
                          </Link>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-green-600 text-[9px] font-black uppercase tracking-widest border border-green-200 bg-green-50 px-2 py-1 rounded-md">
                            Spedito
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 mt-1 select-all">
                            {order.trackingCode}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {orders.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="h-12 w-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">?</div>
              <p className="text-zinc-500 font-bold">Nessun ordine trovato.</p>
              <p className="text-xs text-zinc-400 mt-1">Prova a cambiare i filtri.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterLink({ label, value, active }: any) {
  return (
    <Link 
      href={`/admin/orders${value ? `?status=${value}` : ""}`}
      className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
        active ? "bg-black text-white shadow-md" : "text-zinc-400 hover:bg-zinc-50 hover:text-black"
      }`}
    >
      {label}
    </Link>
  );
}