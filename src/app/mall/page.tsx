"use client";

import React from "react";
import Footer from "@/components/sections/footer";
import LocationRequestMallPage from "@/components/LocationRequestMallPage";
import { Sparkles } from "lucide-react";

export default function MallPage() {
  return (
    <div className="min-h-screen bg-stone-50/40 pb-24 md:pb-0">
      {/* Luxury Digital Mall Title Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-neutral-900 to-stone-900 text-white py-14 sm:py-18 px-4 border-b border-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={13} className="text-amber-400" />
            Curated Local Boutiques
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Digital Mall
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Discover verified local malls, explore exclusive storefronts, and shop premium products near you.
          </p>
        </div>
      </div>

      {/* Nearby Malls or Location Request */}
      <LocationRequestMallPage />

      {/* Footer */}
      <Footer />
    </div>
  );
}
