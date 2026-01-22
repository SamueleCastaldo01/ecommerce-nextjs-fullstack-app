"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Forza lo scroll in cima ad ogni cambio di rotta
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      key={pathname} // Importante: forza il reset dell'animazione
      initial={{ opacity: 0, y: 5 }} // Riduciamo y per evitare balzi visivi
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] 
      }}
    >
      {children}
    </motion.div>
  );
}