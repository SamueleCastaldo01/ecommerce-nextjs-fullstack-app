"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit"
      disabled={pending}
      className="w-full py-7 rounded-[1.5rem] bg-black text-white font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:bg-neutral-400 disabled:cursor-not-allowed"
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Elaborazione...</span>
        </div>
      ) : (
        "Acquista Ora"
      )}
    </Button>
  );
}