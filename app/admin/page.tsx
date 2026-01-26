import { db } from "@/lib/firebase-admin";

export default async function AdminDashboard() {
  // Recuperiamo tutti gli ordini per le statistiche
  const snapshot = await db.collection("orders").get();
  const orders = snapshot.docs.map(doc => doc.data());

  const totalRevenue = orders.reduce((acc, o) => acc + o.amountTotal, 0) / 100;
  const activeOrders = orders.filter((o: any) => o.status === "paid").length;
  
  // Calcolo clienti unici
  const uniqueCustomers = new Set(orders.map((o: any) => o.customerEmail)).size;

  return (
    <div className="max-w-5xl">
      <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8">
        Panoramica
      </h2>

      {/* CARDS STATISTICHE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-black text-white p-8 rounded-[2rem] shadow-xl">
          <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-2">Incasso Totale</p>
          <p className="text-4xl font-black">€ {totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white border border-zinc-200 p-8 rounded-[2rem]">
          <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-2">Da Produrre</p>
          <p className="text-4xl font-black text-orange-500">{activeOrders}</p>
        </div>

        <div className="bg-white border border-zinc-200 p-8 rounded-[2rem]">
          <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-2">Clienti Totali</p>
          <p className="text-4xl font-black">{uniqueCustomers}</p>
        </div>
      </div>

      {/* SEZIONE AZIONI RAPIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-100 rounded-[2rem] p-8">
          <h3 className="font-bold text-lg mb-4">Note di produzione</h3>
          <p className="text-zinc-500 text-sm">Qui potrai aggiungere note o todo list in futuro.</p>
        </div>
        {/* Altro widget */}
      </div>
    </div>
  );
}