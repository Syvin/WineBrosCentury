"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useVelocity, useTransform, useSpring } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sedan } from "next/font/google";
import { useIsMobile } from "@/hooks/use-mobile";

const sedan = Sedan({
  subsets: ["latin"],
  weight: "400",
});

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "products", label: "Products" },
  { id: "contact", label: "Inquiry" },
];

export function CustomScrollbar() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMobile = useIsMobile();

  const [isSiteReady, setIsSiteReady] = useState(false);
  const scrollProgressMotion = useMotionValue(0);
  const scrollVelocity = useVelocity(scrollProgressMotion);
  const scrollTilt = useTransform(scrollVelocity, [-0.05, 0, 0.05], [-15, 0, 15]);
  const smoothTilt = useSpring(scrollTilt, { stiffness: 50, damping: 15 });

  const sectionOffsets = useRef<{ id: string; top: number }[]>([]);

  useEffect(() => {
    const handleSiteReady = () => setIsSiteReady(true);
    window.addEventListener('site-ready', handleSiteReady);
    
    if (document.readyState === "complete") {
      setIsSiteReady(true);
    }

    const calculateOffsets = () => {
      sectionOffsets.current = SECTIONS.map(s => {
        const el = document.getElementById(s.id);
        return { id: s.id, top: el ? el.offsetTop : 0 };
      });
    };

    calculateOffsets();
    window.addEventListener('resize', calculateOffsets);

    return () => {
      window.removeEventListener('site-ready', handleSiteReady);
      window.removeEventListener('resize', calculateOffsets);
    };
  }, []);

  useEffect(() => {
    scrollProgressMotion.set(scrollProgress);
    setMounted(true);

    let rafId: number | null = null;
    const handleScroll = () => {
      if (typeof document === 'undefined' || !isSiteReady) return;

      rafId = requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const progress = Math.max(0, Math.min(1, window.scrollY / totalHeight));
          setScrollProgress(progress);

          // Active section logic using cached offsets
          const currentScroll = window.scrollY + window.innerHeight / 2;
          let current = activeSection;
          let minDistance = Infinity;

          sectionOffsets.current.forEach((s) => {
            const dist = Math.abs(s.top - currentScroll);
            if (dist < minDistance) {
              minDistance = dist;
              current = s.id;
            }
          });
          if (current !== activeSection) setActiveSection(current);
        }

        setIsVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsVisible(false), 3000);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    initTimeoutRef.current = setTimeout(() => {
      if (isSiteReady) handleScroll();
    }, 2000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
    };
  }, [activeSection, isSiteReady]);

  if (!mounted || isMobile) return null;

  const mlValue = Math.round(scrollProgress * 750);
  const activeLabel = SECTIONS.find(s => s.id === activeSection)?.label || "Home";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="refined-scrollbar"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed right-12 bottom-12 z-[9999] pointer-events-none flex items-center gap-6 will-change-transform"
        >
          {/* Readout */}
          <div className="flex flex-col items-end">
             <motion.span
                key={`label-${activeSection}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${sedan.className} text-xl uppercase tracking-[0.5em] text-white/90 leading-none mb-2`}
              >
                {activeLabel}
              </motion.span>

            <div className="flex items-baseline gap-1 font-mono text-[9px] text-white/30 uppercase tracking-[0.3em]">
              <span className="text-white/60">{mlValue}</span>
              <span>/ 750 ML</span>
            </div>
          </div>

          {/* Wine Bottle Scroll Indicator */}
          <div className="relative w-16 h-28 flex items-center justify-center">
            <svg 
              viewBox="0 0 100 300" 
              className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              {/* Bottle Outline/Base (Gray) - Thickened Silhouette */}
              <path
                d="M20 280 C20 295 80 295 80 280 L80 120 C80 100 70 90 62 80 L62 20 C62 10 38 10 38 20 L38 80 C30 90 20 100 20 120 Z"
                fill="rgba(255, 255, 255, 0.15)"
                className="stroke-white/10"
                strokeWidth="1"
              />

              {/* Fluid Masking Logic - Animated Wave Surface */}
              <defs>
                <clipPath id="bottle-shape">
                  <path d="M20 280 C20 295 80 295 80 280 L80 120 C80 100 70 90 62 80 L62 20 C62 10 38 10 38 20 L38 80 C30 90 20 100 20 120 Z" />
                </clipPath>
                
                <clipPath id="fluid-clip">
                  {/* Moving Sine Wave Path */}
                  <motion.path
                    animate={{ 
                      y: 10 + (scrollProgress * 275),
                      x: [-20, 0, -20] // Horizontal wave motion
                    }}
                    transition={{ 
                      y: { type: "spring", stiffness: 100, damping: 20, mass: 0.5 },
                      x: { repeat: Infinity, duration: 4, ease: "linear" }
                    }}
                    d="M 0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 V 400 H 0 Z"
                  />
                </clipPath>
              </defs>

              {/* Clipped Fluid and Wave Group with Dynamic Slosh Physics */}
              <motion.g 
                clipPath="url(#bottle-shape)"
                style={{ 
                  rotate: smoothTilt,
                  transformOrigin: `50% ${10 + (scrollProgress * 275)}px`
                }}
              >
                {/* Secondary 'Back' Wave with faster oscillation during slosh */}
                <motion.path
                  animate={{ 
                    y: 12 + (scrollProgress * 275),
                    x: [0, -25, 0] 
                  }}
                  transition={{ 
                    y: { type: "spring", stiffness: 100, damping: 20, mass: 0.5 },
                    x: { repeat: Infinity, duration: 3.5, ease: "linear" }
                  }}
                  d="M 0 15 Q 25 30 50 15 T 100 15 T 150 15 T 200 15 V 400 H 0 Z"
                  fill="rgba(255, 255, 255, 0.3)"
                />

                {/* Main White Fluid with High-Amplitude Wavy Clip */}
                <path
                  d="M20 280 C20 295 80 295 80 280 L80 120 C80 100 70 90 62 80 L62 20 C62 10 38 10 38 20 L38 80 C30 90 20 100 20 120 Z"
                  fill="white"
                  clipPath="url(#fluid-clip)"
                  className="drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                />

                {/* High-Intensity Surface Wave Sparkle */}
                <motion.path
                  animate={{ 
                    y: 10 + (scrollProgress * 275),
                    x: [-25, 0, -25],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    y: { type: "spring", stiffness: 100, damping: 20, mass: 0.5 },
                    x: { repeat: Infinity, duration: 3.5, ease: "linear" },
                    opacity: { repeat: Infinity, duration: 1.5 }
                  }}
                  d="M 0 10 Q 25 -2 50 10 T 100 10 T 150 10 T 200 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  className="drop-shadow-[0_0_18px_rgba(255,255,255,1)]"
                />
              </motion.g>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
