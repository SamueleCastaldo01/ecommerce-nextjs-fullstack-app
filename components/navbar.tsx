"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/constants/categories";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { STORE_SETTINGS } from "@/constants/settings";
import { CartSidebar } from "./CartSidebar";
import { SearchModal } from "./SearchModal";

export const Navbar = () => {
  const pathname = usePathname(); // 2. Inizializziamo il hook
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3. Funzione helper per definire lo stile dei link
  const linkStyles = (path: string) => {
  const isCategoryPage = CATEGORIES.some(cat => pathname === `/${cat.slug}`);
  
  const isActive = path === "/all" 
    ? (pathname === "/all" || isCategoryPage) 
    : pathname === path;

  return `${
    isActive 
      ? "text-black font-bold border-b-2 border-black" 
      : "text-neutral-500 hover:text-black font-medium"
  } transition-all duration-200 pb-1`;
};

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-neutral-100">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Image
            src= {STORE_SETTINGS.LOGO_URL} 
            alt="Clean Studio Logo" 
            width={35}  
            height={35} 
            className="object-contain"
            priority 
          />
          <span>{STORE_SETTINGS.NAME}</span>
        </Link>

        {/* Links Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={linkStyles("/")}>Home</Link>
          {/* Cambiato in /all per coerenza con il href */}
          <Link href="/all" className={linkStyles("/all")}>Prodotti</Link>
        </div>

        <div className="flex items-center space-x-5">
          {/* SEZIONE AUTENTICAZIONE */}
          <div className="flex items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 text-sm font-bold bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition shadow-sm">
                  <UserIcon className="h-4 w-4" />
                  <span>Accedi</span>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9 border-2 border-neutral-100"
                  }
                }}
              >
                {/* Questo è il prodotto da aggiungere */}
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="I miei Ordini"
                    labelIcon={<Package size={16} />}
                    href="/orders"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>

          <SearchModal />

          <CartSidebar />

          {/* MENU MOBILE TOGGLE */}
          <Button
            variant="ghost"
            className="md:hidden p-1"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-neutral-100">
          <ul className="flex flex-col p-6 space-y-6">
            <li>
              <Link 
                href="/" 
                className={`text-lg ${pathname === '/' ? 'font-bold text-black' : 'text-neutral-500'}`} 
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/all" 
                className={`text-lg ${
                  (pathname === "/all" || CATEGORIES.some(cat => pathname === `/${cat.slug}`)) 
                  ? 'font-bold text-black' 
                  : 'text-neutral-500'
                }`} 
                onClick={() => setMobileOpen(false)}
              >
                Prodotti
              </Link>
            </li>
            <SignedIn>
              <li>
                <Link 
                  href="/orders" 
                  className={`text-lg ${pathname === '/orders' ? 'font-bold text-black' : 'text-neutral-500'}`} 
                  onClick={() => setMobileOpen(false)}
                >
                  My Orders
                </Link>
              </li>
            </SignedIn>
            <li>
              <Link 
                href="/checkout" 
                className={`text-lg ${pathname === '/checkout' ? 'font-bold text-black' : 'text-neutral-500'}`} 
                onClick={() => setMobileOpen(false)}
              >
                Checkout ({cartCount})
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </nav>
  );
};