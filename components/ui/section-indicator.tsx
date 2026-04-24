"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "products", label: "Products" },
  { id: "contact", label: "Contact" },
];

export function SectionIndicator() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: [0.3], // Trigger when 30% visible
        rootMargin: "-20% 0px -20% 0px" // Narrow the focus area to the center of the viewport
      }
    );

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleDotClick = (id: string) => {
    const lenis = (window as any).lenis || (window as any).Lenis;
    if (lenis) {
      lenis.scrollTo(`#${id}`, {
        duration: 1.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-[9998] pointer-events-none">
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <div key={section.id} className="group flex items-center gap-4 pointer-events-auto cursor-pointer" onClick={() => handleDotClick(section.id)}>
            <div className="relative flex items-center justify-center">
               {/* Label (Visible on Hover or if Active) */}
               <motion.span 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: isActive ? 0.8 : 0, x: isActive ? 0 : -10 }}
                 className={`absolute left-8 text-[10px] uppercase tracking-[0.3em] font-medium whitespace-nowrap transition-colors duration-500 ${isActive ? "text-yellow-500" : "text-white/40 group-hover:opacity-100 group-hover:translate-x-0"}`}
                 style={{ opacity: isActive ? 1 : undefined }}
               >
                 {section.label}
               </motion.span>

               {/* The Dot */}
               <div className="relative">
                 <motion.div
                   className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${
                     isActive 
                       ? "bg-yellow-500 scale-150 shadow-[0_0_15px_rgba(234,179,8,1)]" 
                       : "bg-white/20 group-hover:bg-white/40"
                   }`}
                 />
                 {isActive && (
                   <motion.div
                     layoutId="active-dot-ring"
                     className="absolute -inset-2 border border-yellow-500/30 rounded-full"
                     transition={{ duration: 0.8, type: "spring", stiffness: 300, damping: 30 }}
                   />
                 )}
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
