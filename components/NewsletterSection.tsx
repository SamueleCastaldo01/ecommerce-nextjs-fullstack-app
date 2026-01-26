"use client";

import { useState } from "react";
import { subscribeNewsletterAction } from "@/app/actions/newsletter";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

export default function NewsletterSection() {
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  async function handleSubmit(formData: FormData) {
    setStatus({ type: "loading", message: "" });
    
    const res = await subscribeNewsletterAction(formData);

    if (res.error) {
      setStatus({ type: "error", message: res.error });
    } else {
      setStatus({ type: "success", message: res.message || "Benvenuto nello Studio!" });
    }
  }

  return (
    <section className="pt-10 pb-0 px-4">
      <div className="max-w-4xl mx-auto bg-white border-2 border-zinc-100 rounded-[3rem] p-8 md:p-16 shadow-sm hover:border-black transition-all duration-500 group">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* TESTO */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-zinc-100 px-3 py-1 rounded-full mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-2 rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest">Early Access</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">
              Join the <br />
              <span className="text-zinc-300 group-hover:text-black transition-colors duration-500">Studio List</span>
            </h2>
            <p className="text-zinc-500 font-medium text-sm md:text-base max-w-sm mx-auto md:mx-0">
              Ricevi notifiche istantanee sui nuovi drop 3D e sulle release in edizione limitata.
            </p>
          </div>

          {/* FORM */}
          <div className="flex-1 w-full max-w-md">
            <form action={handleSubmit} className="relative group/form">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    name="email"
                    type="email"
                    placeholder="Il tuo indirizzo email..."
                    className="w-full bg-zinc-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none transition-all"
                    disabled={status.type === "loading" || status.type === "success"}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status.type === "loading" || status.type === "success"}
                  className="w-full bg-black text-white rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
                >
                  {status.type === "loading" ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      Iscriviti Ora <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

              {/* MESSAGGIO DI FEEDBACK */}
              {status.message && (
                <p className={`mt-4 text-[10px] font-black uppercase tracking-widest text-center italic ${
                  status.type === "error" ? "text-red-500" : "text-zinc-400"
                }`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}