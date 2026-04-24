"use client";

import { Home, Info, Layers, ShoppingBag, Contact } from "lucide-react";
import { useMemo, useState } from "react";
import { Cinzel_Decorative } from "next/font/google";
import GlassSurface from "./glass-surface";

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export function MobileNavigation() {
  const [activeTab, setActiveTab] = useState("#home");

  const links = useMemo(() => [
    { title: "Home", icon: <Home className="w-[22px] h-[22px]" />, href: "#home" },
    { title: "About", icon: <Info className="w-[22px] h-[22px]" />, href: "#about" },
    { title: "Collections", icon: <Layers className="w-[22px] h-[22px]" />, href: "#collections" },
    { title: "Products", icon: <ShoppingBag className="w-[22px] h-[22px]" />, href: "#products", dot: true },
    { title: "Contact", icon: <Contact className="w-[22px] h-[22px]" />, href: "#contact" },
  ], []);

  const handleLinkClick = (href: string) => {
    setActiveTab(href);
    const sectionName = href.replace('#', '');
    const element = document.querySelector(href);
    
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('play-section-intro', { detail: sectionName }));
      }, 600);
    }
  };

  return (
    <div className="block md:hidden">
      {/* Mobile Top Brand */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <h1 className={`${cinzelDecorative.className} text-white font-bold text-xl text-center text-glow drop-shadow-md`}>
          Wine Century Brothers
        </h1>
      </div>

      {/* Mobile Bottom Navigation Bar (Instagram Style Pill) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 pointer-events-none flex justify-center">
        <div className="pointer-events-auto w-max">
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={999}
            brightness={20}
            opacity={0.9}
            blur={30}
            backgroundOpacity={0.6}
            saturation={1.2}
            className="border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="flex justify-center items-center gap-1.5">
              {links.map((link) => {
                const isActive = activeTab === link.href;
                return (
                  <a
                    key={link.title}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className={`relative flex items-center justify-center w-14 h-12 rounded-full transition-all duration-300 active:scale-90 ${isActive ? "bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" : "text-white/50 hover:text-white/80"
                      }`}
                  >
                    {link.icon}

                    {/* Optional Decorative Notification Dot */}
                    {link.dot && !isActive && (
                      <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-yellow-500 rounded-full drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]" />
                    )}
                  </a>
                );
              })}
            </div>
          </GlassSurface>
        </div>
      </div>
    </div>
  );
}
