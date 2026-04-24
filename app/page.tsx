"use client";

import { HeroSection } from "@/app/hero-section";
import { AboutSection } from "@/app/about-us";
import { CollectionsSection } from "@/app/collections-section";
import { ProductSection } from "@/app/product-section";
import { ContactSection } from "@/app/contact-section";
import { SharedBackground } from "@/components/ui/shared-background";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"]
  });

  // Finish bottle movement quickly so it's gone before About section starts its horizontal pin
  const bottleY = useTransform(scrollYProgress, [0, 0.2], [0, -800]);
  const bottleScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.5]);

  const isMobile = useIsMobile();

  return (
    <>
      <main
        ref={mainRef}
        className={`relative overflow-x-hidden ${isMobile ? 'h-[100dvh] overflow-y-auto snap-y snap-mandatory' : 'overflow-hidden'}`}
      >
        <div id="home" data-section="hero" className={isMobile ? 'snap-start h-[100dvh]' : ''}>
          <HeroSection />
        </div>
        {!isMobile && (
          <motion.div
            className="absolute right-0 pointer-events-none z-40 hidden md:block"
            style={{
              top: '15vh',
              y: bottleY,
              scale: bottleScale,
              marginRight: '15rem',
            }}
          >
            <motion.img
              src="/bottles/wine_bottle.webp"
              alt="Wine Bottle"
              className="w-[500%] md:w-[500%] h-auto drop-shadow-2xl -mr-10 md:-mr-32"
              animate={{
                rotate: [0, 2, 0, -2, 0],
                y: [0, -10, 0, -10, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
        <div id="about" data-section="about">
          <AboutSection />
        </div>
        <div id="collections" data-section="collections" className={isMobile ? 'snap-start h-[100dvh]' : ''}>
          <CollectionsSection />
        </div>
        {/* Dwell spacer — gives collections section scroll room without pinSpacing (desktop only) */}
        <div className="hidden md:block" style={{ height: "150vh" }} aria-hidden="true" />
        <div id="products" data-section="product" className={isMobile ? 'snap-start h-[100dvh]' : ''}>
          <ProductSection />
        </div>
        <div id="contact" data-section="contact" className={isMobile ? 'snap-start h-[100dvh]' : ''}>
          <ContactSection />
        </div>
      </main>

      <SharedBackground />
    </>
  );
}
