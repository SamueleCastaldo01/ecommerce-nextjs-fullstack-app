"use client";

import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon, // Aggiungiamo un'icona utente per stile
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
// --- IMPORT DI CLERK ---
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
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

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="font-bold text-xl tracking-tighter">
          My Ecommerce
        </Link>

        {/* Links Desktop */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-neutral-600 transition">Home</Link>
          <Link href="/products" className="hover:text-neutral-600 transition">Products</Link>
          <Link href="/checkout" className="hover:text-neutral-600 transition">Checkout</Link>
        </div>

        <div className="flex items-center space-x-5">

          {/* --- SEZIONE AUTENTICAZIONE --- */}
          <div className="flex items-center">
            {/* Se NON sono loggato: Mostra tasto Accedi con Modal */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition">
                  <UserIcon className="h-4 w-4" />
                  <span>Accedi</span>
                </button>
              </SignInButton>
            </SignedOut>

            {/* Se SONO loggato: Mostra l'avatar dell'utente */}
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9 border border-neutral-200"
                  }
                }}
              />
            </SignedIn>
          </div>


          {/* ICONA CARRELLO */}
          <Link href="/checkout" className="relative p-1">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* MENU MOBILE TOGGLE */}
          <Button
            variant="ghost"
            className="md:hidden p-1"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-neutral-100">
          <ul className="flex flex-col p-4 space-y-4 font-medium">
            <li><Link href="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
            <li><Link href="/products" onClick={() => setMobileOpen(false)}>Products</Link></li>
            <li><Link href="/checkout" onClick={() => setMobileOpen(false)}>Checkout</Link></li>
          </ul>
        </nav>
      )}
    </nav>
  );
};