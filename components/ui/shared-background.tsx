"use client";

import React from "react";

const PALETTE = {
  amber: "#d4a04a",
  walnut: "#4a2510",
  espresso: "#1a0c04",
  glow: "rgba(212, 160, 74, 0.35)",
  glowSoft: "rgba(212, 160, 74, 0.12)",
} as const;

export const SharedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">
    {/* Base radial gradient — walnut → espresso */}
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse 80% 70% at 50% 45%, ${PALETTE.walnut} 0%, ${PALETTE.espresso} 60%, #0a0300 100%)`,
      }}
    />

    {/* Golden spotlight behind the bottle area */}
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[55%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full"
      style={{
        background: `radial-gradient(circle, ${PALETTE.glow} 0%, ${PALETTE.glowSoft} 35%, transparent 70%)`,
      }}
    />
    
    {/* Overlay noise or texture if needed — subtle */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
  </div>
);
