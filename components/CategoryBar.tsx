"use client";

import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";

interface CategoryBarProps {
  activeSlug: string;
}

export function CategoryBar({ activeSlug }: { activeSlug: string }) {
  return (
    <nav className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = activeSlug === cat.slug;
        
        return (
          <Link
            key={cat.slug}
            // Se la categoria è "all", rimandiamo alla home o alla pagina principale
            href={cat.slug === "all" ? "/" : `/${cat.slug}`}
            className={`
              px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap border
              ${isActive 
                ? "bg-black text-white border-black shadow-lg shadow-black/10" 
                : "bg-white text-neutral-400 border-neutral-100 hover:border-black hover:text-black"
              }
            `}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}