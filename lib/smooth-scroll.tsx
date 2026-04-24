"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Disable restoration as early as possible (before React mount)
if (typeof window !== "undefined") {
  history.scrollRestoration = 'manual';
  gsap.registerPlugin(ScrollTrigger);
  // Clear any existing GSAP scroll memory
  ScrollTrigger.clearScrollMemory('manual');
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initial hard reset to top
    window.scrollTo(0, 0);

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // Skip Lenis on mobile — native scroll + CSS scroll-snap is more reliable
    if (isMobile) {
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        window.scrollTo(0, 0);
      }, 100);
      return () => clearTimeout(refreshTimer);
    }

    // Initialize Lenis with autoRaf enabled to drive all scrolling (desktop only)
    lenisRef.current = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoRaf: true, 
    });

    // Reset scroll to top on mount
    lenisRef.current.scrollTo(0, { immediate: true });

    // Force a ScrollTrigger refresh after a small delay to handle layout shifts
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      window.scrollTo(0, 0);
    }, 100);

    // Expose Lenis instance on window for components to access
    (window as any).lenis = lenisRef.current;
    (window as any).Lenis = lenisRef.current;

    // Sync ScrollTrigger with Lenis
    lenisRef.current.on('scroll', () => {
      ScrollTrigger.update();
    });

    return () => {
      clearTimeout(refreshTimer);
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      delete (window as any).lenis;
      delete (window as any).Lenis;
    };
  }, []);

  return <>{children}</>;
}
