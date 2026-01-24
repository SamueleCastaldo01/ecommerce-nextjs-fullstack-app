"use client";
import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";

export function CategoryBar({ activeSlug }: { activeSlug: string }) {
  return (
    <nav className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/${cat.slug}`}
          className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
            activeSlug === cat.slug
              ? "bg-black text-white border-black"
              : "bg-white text-neutral-400 border-neutral-400 hover:border-black hover:text-black"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}