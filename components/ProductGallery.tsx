"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { IoShareOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";
import Image from "next/image";

type Props = {
  images: string[];
  productName: string;
  activeImage?: string; // Nuova prop per forzare il cambio immagine
  onShare?: () => void;
  className?: string;
};

export default function ProductGallery({
  images,
  productName,
  activeImage,
  onShare,
  className,
}: Props) {
  const [active, setActive] = useState(0);
  const thumbRefs = useRef<HTMLButtonElement[]>([]);

  const normalized = useMemo(
    () => (images || []).map((src) => src || ""),
    [images]
  );

  // SINCRONIZZAZIONE: Se il padre cambia activeImage, la gallery si sposta
  useEffect(() => {
    if (activeImage) {
      const index = normalized.findIndex((img) => img === activeImage);
      if (index !== -1) {
        setActive(index);
      }
    }
  }, [activeImage, normalized]);

  const hasImages = normalized.length > 0;
  const activeSrc = normalized[active] ?? "";

  const nextImage = useCallback(
    () => setActive((prev) => (prev + 1) % normalized.length),
    [normalized.length]
  );
  const prevImage = useCallback(
    () => setActive((prev) => (prev - 1 + normalized.length) % normalized.length),
    [normalized.length]
  );

  useEffect(() => {
    const btn = thumbRefs.current[active];
    if (btn) btn.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  if (!hasImages) return null;

  return (
    <div className={`flex flex-col gap-4 ${className || ""}`}>
      
      {/* 1. IMMAGINE PRINCIPALE */}
      <div className="relative w-full aspect-[3/2] rounded-2xl bg-white border border-gray-100 overflow-hidden group shadow-sm">
        <Image
          src={activeSrc}
          alt={productName}
          fill
          priority
          className="object-cover select-none transition-all duration-500 ease-in-out"
          draggable={false}
        />

        {onShare && (
          <button
            onClick={onShare}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all active:scale-95"
          >
            <IoShareOutline size={20} />
          </button>
        )}

        {normalized.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <IoChevronBack size={22} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <IoChevronForward size={22} />
            </button>
          </>
        )}
      </div>

      {/* 2. MINIATURE */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1">
        {normalized.map((url, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              ref={(el) => { if (el) thumbRefs.current[i] = el; }}
              onMouseEnter={() => setActive(i)} 
              onClick={() => setActive(i)}
              className={`
                relative shrink-0 rounded-xl overflow-hidden border-2 transition-all
                w-24 aspect-[3/2] bg-gray-50
                ${isActive 
                  ? "border-black ring-2 ring-black/5 scale-105 z-10 opacity-100 shadow-sm" 
                  : "border-transparent opacity-50 hover:opacity-100 hover:border-gray-200"}
              `}
            >
              <Image
                src={url}
                alt={`${productName} thumbnail ${i}`}
                fill
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .no-scrollbar { scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}