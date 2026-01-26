import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Package 
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // 1. SICUREZZA CENTRALIZZATA
  // Se non sei l'admin, vieni cacciato via da TUTTA la sezione /admin
  if (userId !== process.env.ADMIN_CLERK_ID) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* --- SIDEBAR SINISTRA --- */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed h-full z-10 hidden md:flex">
        
        {/* Logo Area */}
        <div className="p-8 border-b border-zinc-100">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            Clean<br/><span className="text-zinc-300">Studio</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 mt-1 tracking-widest uppercase">Admin Platform</p>
        </div>

        {/* Menu Navigazione */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <AdminLink href="/admin" icon={LayoutDashboard} label="Dashboard" />
          <AdminLink href="/admin/orders" icon={ShoppingBag} label="Ordini" />
          <AdminLink href="/admin/customers" icon={Users} label="Clienti" />
          {/* Aggiungi qui altre pagine se vuoi */}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-xl">
            <UserButton />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Admin</p>
              <p className="text-[10px] text-zinc-400 truncate">Log out</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- CONTENUTO PRINCIPALE (A DESTRA) --- */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        {/* Questo children cambia in base alla pagina in cui sei */}
        {children}
      </main>
    </div>
  );
}

// Piccolo componente per i link attivi
function AdminLink({ href, icon: Icon, label }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-black hover:text-white transition-all group"
    >
      <Icon size={18} className="group-hover:scale-110 transition-transform" />
      {label}
    </Link>
  );
}