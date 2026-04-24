"use client";

import { Instagram, Twitter, Facebook, ArrowUp } from "lucide-react";

export function Footer({ compact = false }: { compact?: boolean }) {
  const scrollToTop = () => {
    const lenis = (window as any).lenis || (window as any).Lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className={`text-white px-6 md:px-16 relative z-10 transition-all ${compact ? 'py-10' : 'py-20 border-t border-white/5'}`}>
      <div className={`max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center ${compact ? 'gap-8' : 'gap-12'}`}>
        {/* Left: Branding */}
        <div className="flex flex-col items-center md:items-start group">
          <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold tracking-[0.4em] uppercase ${compact ? 'mb-1 text-white/70 group-hover:text-white transition-colors duration-1000' : 'mb-3'}`}>WCB</h2>
          <p className={`${compact ? 'hidden md:block' : 'block'} text-xs text-white/40 uppercase tracking-[0.6em] font-medium`}>Wine Century Brothers</p>
        </div>

        {/* Center: Socials */}
        <div className={`flex items-center ${compact ? 'gap-8' : 'gap-10'}`}>
          <a href="#" className="p-2 bg-white/5 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all duration-300">
            <Instagram className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </a>
          <a href="#" className="p-2 bg-white/5 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all duration-300">
            <Twitter className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </a>
          <a href="#" className="p-2 bg-white/5 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all duration-300">
            <Facebook className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </a>
        </div>

        {/* Right: Back to top & Copyright */}
        <div className="flex flex-col items-center md:items-end">
          <button 
            onClick={scrollToTop}
            className={`group flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors duration-300 font-semibold ${compact ? 'mb-2' : 'mb-6'}`}
          >
            Back to Top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1.5 transition-transform" />
          </button>
          <p className="text-[11px] text-white/40 tracking-[0.3em] font-light">
            © 2024 WINE CENTURY BROTHERS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

      {!compact && (
        <div className="max-w-7xl mx-auto mt-16 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-x-16 gap-y-6">
          {["Privacy Policy", "Terms of Service", "Cookie Settings", "Sitemap"].map((link) => (
            <a key={link} href="#" className="text-[9px] uppercase tracking-[0.4em] text-white/10 hover:text-white/40 transition-all">
              {link}
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}
