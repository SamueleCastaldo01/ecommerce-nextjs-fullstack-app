import { db } from "@/lib/firebase-admin";
import { Mail, MapPin } from "lucide-react";

export default async function AdminCustomersPage() {
  const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
  const orders = snapshot.docs.map(doc => doc.data());

  // Logica per raggruppare i clienti unici per Email
  const customersMap = new Map();

  orders.forEach((order: any) => {
    if (!customersMap.has(order.customerEmail)) {
      customersMap.set(order.customerEmail, {
        name: order.customerName,
        email: order.customerEmail,
        lastOrderDate: order.createdAt,
        totalSpent: 0,
        orderCount: 0,
        location: `${order.shippingAddress.city}, ${order.shippingAddress.country}`
      });
    }
    
    // Aggiorniamo i totali
    const customer = customersMap.get(order.customerEmail);
    customer.totalSpent += order.amountTotal;
    customer.orderCount += 1;
  });

  const customers = Array.from(customersMap.values());

  return (
    <div className="max-w-5xl">
      <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8">
        Clienti <span className="text-zinc-300">Database</span>
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {customers.map((c: any, i) => (
          <div key={i} className="bg-white border border-zinc-100 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center hover:border-black transition-all group">
            
            <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
              <div className="h-12 w-12 bg-zinc-100 rounded-full flex items-center justify-center text-lg font-black uppercase">
                {c.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none">{c.name}</h3>
                <div className="flex items-center gap-2 text-zinc-400 text-xs mt-1">
                  <Mail size={12} /> {c.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 text-right w-full md:w-auto justify-between md:justify-end">
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-300">Speso</p>
                <p className="font-bold">€ {(c.totalSpent / 100).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-300">Ordini</p>
                <p className="font-bold">{c.orderCount}</p>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-black uppercase text-zinc-300">Ultimo Ordine</p>
                <p className="text-xs font-medium">{new Date(c.lastOrderDate).toLocaleDateString()}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}