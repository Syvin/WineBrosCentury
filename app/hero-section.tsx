"use client";

import Image from "next/image";
import { Sedan, Alex_Brush } from "next/font/google";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";

const sedan = Sedan({
  variable: "--font-sedan",
  subsets: ["latin"],
  weight: "400",
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: "400",
});

export function HeroSection({ id }: { id?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  const lastProgressRef = useRef(0);
  const hasAnimatedRef = useRef(false);
  const isFirstFrameRef = useRef(true);
  const mountTimestampRef = useRef(Date.now());

  useEffect(() => {
    // Entrance animation logic
    const playEntranceAnimation = () => {
      if (hasAnimatedRef.current || !overlayRef.current || !textRef.current) return;

      const tl = gsap.timeline();
      tl.fromTo(overlayRef.current, { opacity: 1 }, { opacity: 0.1, duration: 1.5, ease: "power4.inOut" });
      tl.fromTo(textRef.current, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }, "-=1.2");

      const children = Array.from(textRef.current.children);
      tl.fromTo(children, { opacity: 0, y: 40, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.15, ease: "power3.out" }, "-=0.8");

      hasAnimatedRef.current = true;
    };

    // Listen for the site-ready signal from the loading screen
    const handleSiteReady = () => playEntranceAnimation();
    window.addEventListener('site-ready', handleSiteReady);

    // Safety check if already ready
    if (document.readyState === "complete") {
      playEntranceAnimation();
    }

    let cleanupFunc: (() => void) | undefined;
    const checkLenis = () => {
      const lenis = (window as any).lenis || (window as any).Lenis;
      if (!lenis) {
        const timer = setTimeout(checkLenis, 50);
        return () => clearTimeout(timer);
      }

      let rafId: number | null = null;
      const updateProgress = () => {
        if (!sectionRef.current || !bgRef.current || !contentRef.current || !overlayRef.current) return;

        rafId = requestAnimationFrame(() => {
          const sectionHeight = sectionRef.current?.offsetHeight || window.innerHeight;
          const progress = Math.max(0, Math.min(1, lenis.scroll / sectionHeight));

          const isMobile = window.innerWidth < 768;

          if (!isMobile) {
            // Use transform3d for hardware acceleration
            bgRef.current!.style.transform = `scale3d(${1 + progress * 0.2}, ${1 + progress * 0.2}, 1)`;
            bgRef.current!.style.filter = `blur(${progress * 8}px)`; // Reduced blur for performance
            contentRef.current!.style.transform = `translate3d(0, ${progress * 80}px, 0) scale3d(${1 - progress * 0.1}, ${1 - progress * 0.1}, 1)`;
            contentRef.current!.style.opacity = String(1 - progress * 0.7);
            overlayRef.current!.style.opacity = String(progress * 0.7);

            const isScrollingDown = progress > lastProgressRef.current;
            const timeSinceMount = Date.now() - mountTimestampRef.current;

            if (!isFirstFrameRef.current && timeSinceMount > 2000) {
              if (progress > 0.3 && isScrollingDown && !isScrollingRef.current) {
                isScrollingRef.current = true;
                const nextSection = document.getElementById('about');
                if (nextSection) {
                  lenis.scrollTo(nextSection, { duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
                  setTimeout(() => { isScrollingRef.current = false; }, 1600);
                }
              }
            }
          } else {
            // Simplified mobile logic - just fade out content slightly
            contentRef.current!.style.opacity = String(1 - progress * 0.8);
            overlayRef.current!.style.opacity = String(progress * 0.8);
          }

          isFirstFrameRef.current = false;
          lastProgressRef.current = progress;
        });
      };

      lenis.on("scroll", updateProgress);
      updateProgress();

      return () => {
        lenis.off("scroll", updateProgress);
        if (rafId) cancelAnimationFrame(rafId);
      };
    };

    cleanupFunc = checkLenis();
    return () => {
      window.removeEventListener('site-ready', handleSiteReady);
      if (cleanupFunc) cleanupFunc();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id || "home"}
      data-lenis-snap-start
      className="bg-black h-screen px-6 flex items-center justify-center relative overflow-hidden"
      style={{
        minHeight: '100dvh'
      }}
    >
      {/* Background with parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: 'scale(1)',
          filter: 'blur(0px)',
          transformOrigin: 'center center',
          opacity: '50%',
          willChange: 'transform, filter'
        }}
      >
        <Image
          src="/background/background.jpg"
          alt="Vintage wine cellar background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {/* Dark overlay that fades in */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none bg-black"
        style={{
          willChange: 'opacity'
        }}
      />

      {/* Seamless Section Blender: Fades the Hero background into the About section's black base */}
      <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-black via-black/10 to-transparent pointer-events-none z-10" />

      <div
        ref={contentRef}
        className="max-w-7xl mx-auto w-full mt-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8 relative z-20"
        style={{
          willChange: 'transform, opacity'
        }}
      >
        <div
          ref={textRef}
          className="flex-1 text-left relative z-10 text-white space-y-6"
        >
          <p className="text-lg md:text-xl mb-4">
            ✦ 2010 — Binondo, Manila ✦
          </p>
          <h2 className={`${alexBrush.className} text-6xl md:text-7xl mb-[-20px]`}>
            The Art Of
          </h2>
          <h1 className={`${sedan.className} text-6xl md:text-8xl mb-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(250,204,21,0.8)]`}>
            FINE WINE
          </h1>
          <p className="text-lg md:text-xl max-w-2xl leading-relaxed">
            Savor the Heritage, Crafted with Enduring Dedication.
          </p>
        </div>
      </div>
    </section>
  );
}
