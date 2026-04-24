"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, useEffect, useMemo, useCallback, useTransition } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassSurface from "@/components/ui/glass-surface";
import { ChevronLeft, ChevronRight, Wine } from "lucide-react";
import { InquiryModal } from "@/components/ui/inquiry-modal";
import { preloadAllImages } from "@/lib/image-cache";
import { BRAND_LOGOS } from "@/lib/constants";
import type { Inventory } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   COLOR TOKENS — Extracted from reference image (warm walnut/amber)
   ═══════════════════════════════════════════════════════════════ */
const PALETTE = {
  amber: "#D4A04A",
  honey: "#c88b32",
  walnut: "#4a2510",
  espresso: "#1a0c04",
  warmWhite: "#f5e6d0",
  glow: "rgba(212, 160, 74, 0.15)",
  glowSoft: "rgba(212, 160, 74, 0.12)",
  bg: "#050403",
  categories: {
    "RED": { accent: "#1a0505", glow: "rgba(180, 20, 20, 0.3)" },
    "WHITE": { accent: "#0a0a03", glow: "rgba(212, 160, 74, 0.25)" },
    "SPARKLING": { accent: "#050608", glow: "rgba(200, 210, 255, 0.2)" },
    "SPIRITS": { accent: "#0d0703", glow: "rgba(245, 158, 11, 0.25)" },
    "DEFAULT": { accent: "#050403", glow: "rgba(212, 160, 74, 0.2)" }
  }
};
/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENT: BottleImage
   Image with shimmer skeleton until loaded.
   ═══════════════════════════════════════════════════════════════ */
const BottleImage = ({ bottle, isActive }: { bottle: Inventory; isActive: boolean }) => {
  const [loaded, setLoaded] = useState(false);
  const prevSrc = useRef<string | null>(null);
  const src = bottle.image_url || "https://placehold.co/400x1200/1a1a1a/666666?text=BOTTLE";

  // Reset loaded state only when src actually changes
  useEffect(() => {
    if (prevSrc.current !== src) {
      prevSrc.current = src;
      setLoaded(false);
    }
  }, [src]);

  return (
    <div className="relative flex items-center justify-center h-[45vh] md:h-[50vh] max-h-full max-w-full aspect-[3/4]">
      {/* Shimmer skeleton — only for active bottle to avoid overlap */}
      {!loaded && isActive && (
        <motion.div
          key="img-skeleton"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-[32px] overflow-hidden bg-white/[0.04]"
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      <Image
        src={src}
        alt={bottle.name}
        width={240}
        height={500}
        priority={isActive}
        draggable={false}
        crossOrigin="anonymous"
        onLoad={() => setLoaded(true)}
        className="relative z-10 h-full w-full object-cover rounded-[32px] drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] pointer-events-none select-none will-change-transform"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENT: HeroBottleCarousel
   Draggable horizontal carousel of bottles.
   ═══════════════════════════════════════════════════════════════ */
interface HeroBottleCarouselProps {
  bottles: Inventory[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  activeColor: { base: string; mid: string; glow: string };
}

const HeroBottleCarousel = ({ bottles, activeIndex, onIndexChange, activeColor }: HeroBottleCarouselProps) => {
  const CARD_WIDTH = 240;
  const CARD_GAP = 20;
  const STEP = CARD_WIDTH + CARD_GAP;

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const direction = offset + velocity * 0.2 < 0 ? 1 : -1;

    if (Math.abs(offset) > 30 || Math.abs(velocity) > 150) {
      let next = activeIndex + direction;
      if (next < 0) next = bottles.length - 1;
      if (next >= bottles.length) next = 0;
      onIndexChange(next);
    }
  };

  const getOffset = (i: number, active: number, total: number) => {
    if (total <= 2) return i - active;
    let diff = i - active;
    const half = Math.floor(total / 2);
    if (diff > half) diff -= total;
    if (diff < -half) diff += total;
    return diff;
  };

  if (bottles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/20 text-sm tracking-widest uppercase font-light">
        <Wine className="w-5 h-5 mr-3 opacity-30" />
        No bottles match these filters
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Navigation Arrows — Desktop only */}
      {bottles.length > 1 && (
        <>
          <button
            aria-label="Previous bottle"
            onClick={() => {
              let next = activeIndex - 1;
              if (next < 0) next = bottles.length - 1;
              onIndexChange(next);
            }}
            className="absolute top-1/2 -translate-y-1/2 left-4 md:left-[320px] 2xl:left-[380px] z-30 w-10 h-10 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:border-[#D4A04A]/40 hover:bg-black/50 opacity-60 hover:opacity-100 will-change-transform"
          >
            <ChevronLeft className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          </button>
          <button
            aria-label="Next bottle"
            onClick={() => {
              let next = activeIndex + 1;
              if (next >= bottles.length) next = 0;
              onIndexChange(next);
            }}
            className="absolute top-1/2 -translate-y-1/2 right-4 md:right-[420px] 2xl:right-[480px] z-30 w-10 h-10 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:border-[#D4A04A]/40 hover:bg-black/50 opacity-60 hover:opacity-100 will-change-transform"
          >
            <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          </button>
        </>
      )}

      {/* Draggable Area - Infinite Loop Rendering */}
      <motion.div
        onPanEnd={(_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
          const threshold = 50;
          const velocityThreshold = 500;
          if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
            onIndexChange((activeIndex + 1) % bottles.length);
          } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
            onIndexChange((activeIndex - 1 + bottles.length) % bottles.length);
          }
        }}
        className="absolute inset-0 z-10 flex items-center justify-center outline-none will-change-transform"
      >
        {bottles.map((bottle, i) => {
          const distance = getOffset(i, activeIndex, bottles.length);
          const isActive = distance === 0;
          const absDist = Math.abs(distance);

          return (
            <motion.div
              key={bottle.id}
              className="absolute left-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center select-none"
              style={{ width: CARD_WIDTH, marginLeft: -(CARD_WIDTH / 2) }}
              onClick={(e) => {
                if (!isActive) {
                  e.stopPropagation();
                  onIndexChange(i);
                }
              }}
              animate={{
                x: distance * STEP,
                scale: isActive ? 1 : 0.7,
                opacity: isActive ? 1 : absDist === 1 ? 0.4 : 0,
                zIndex: bottles.length - absDist
              }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
            >
              <BottleImage bottle={bottle} isActive={isActive} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dot Indicators */}
      {bottles.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-none">
          {bottles.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${i === activeIndex
                  ? `w-6 h-1.5 bg-[#D4A04A]`
                  : "w-1.5 h-1.5 bg-white/20"
                }`}
              style={i === activeIndex ? { backgroundColor: "#D4A04A" } : {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};
/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENT: BottleDetailCard
   Glassmorphism overlay with wine info and inquiry button.
   ═══════════════════════════════════════════════════════════════ */
interface BottleDetailCardProps {
  bottle: Inventory | null;
  onInquire: () => void;
}

// Skeleton shimmer for individual lines
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded bg-white/[0.06] ${className}`}>
    <motion.div
      className="absolute inset-0"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)" }}
      animate={{ x: ["-100%", "100%"] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const BottleDetailCard = ({ bottle, onInquire }: BottleDetailCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const prevBottleId = useRef<string | null>(null);

  // Trigger skeleton briefly when bottle changes
  useEffect(() => {
    if (!bottle) return;
    if (prevBottleId.current === bottle.id) return;
    prevBottleId.current = bottle.id;
    setIsLoaded(false);
    const t = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(t);
  }, [bottle?.id]);

  const description = (bottle?.metadata as any)?.description ||
    "An exquisite selection from one of the world's most celebrated estates, distinguished by exceptional terroir expression.";

  return (
    // Card shell never unmounts — no slide-in/out animation on brand switch
    <div className="product-detail-card w-full max-w-sm">
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={24}
        backgroundOpacity={0.06}
        blur={20}
        displace={0}
        className="border border-white/[0.07] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
      >
        <div className="flex flex-col gap-5 p-6 md:p-8 w-full">
          {/* Category Badge */}
          <div className="flex items-center gap-3 h-6">
            <AnimatePresence mode="wait">
              {!isLoaded || !bottle ? (
                <motion.div key="skel-badge" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 w-full">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-20" />
                </motion.div>
              ) : (
                <motion.div key="badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="flex items-center gap-3">
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.4em] px-3 py-1 rounded-full border"
                    style={{ color: "#D4A04A", borderColor: "#D4A04A33", backgroundColor: "#D4A04A0D" }}
                  >
                    {bottle.category}
                  </span>
                  {bottle.stock > 0 && (
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-medium">
                      {bottle.stock} available
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wine Name */}
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="wait">
              {!isLoaded || !bottle ? (
                <motion.div key="skel-name" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </motion.div>
              ) : (
                <motion.div key="name" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: 0.05 }}>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight leading-tight" style={{ color: "#f5e6d0" }}>
                    {bottle.name}
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.35em] mt-2 font-medium" style={{ color: "#D4A04A99" }}>
                    {bottle.brand || "Wine Century Brothers"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-4 border-t border-b border-white/[0.06]">
            <AnimatePresence mode="wait">
              {!isLoaded || !bottle ? (
                <motion.div key="skel-specs" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex flex-col gap-1"><Skeleton className="h-2 w-10" /><Skeleton className="h-3 w-16" /></div>
                  <div className="flex flex-col gap-1"><Skeleton className="h-2 w-10" /><Skeleton className="h-3 w-12" /></div>
                  <div className="col-span-2 flex flex-col gap-1"><Skeleton className="h-2 w-8" /><Skeleton className="h-4 w-20" /></div>
                </motion.div>
              ) : (
                <motion.div key="specs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: 0.1 }} className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/25 block mb-1 font-medium">Region</span>
                    <span className="text-xs text-white/80 font-light">{bottle.region}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/25 block mb-1 font-medium">Vintage</span>
                    <span className="text-xs text-white/80 font-light">{bottle.vintage}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/25 block mb-1 font-medium">Price</span>
                    <span className="text-sm font-medium" style={{ color: "#D4A04A" }}>₱{bottle.price.toLocaleString()}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Description */}
          <div className="min-h-[48px]">
            <AnimatePresence mode="wait">
              {!isLoaded || !bottle ? (
                <motion.div key="skel-desc" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-4/6" />
                </motion.div>
              ) : (
                <motion.p key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: 0.15 }}
                  className="text-xs text-white/50 font-light leading-relaxed line-clamp-3"
                >
                  {description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Inquire Button — always visible */}
          <button
            onClick={onInquire}
            className="w-full py-4 rounded-full border transition-all duration-500 uppercase tracking-[0.3em] text-[11px] font-bold flex items-center justify-center gap-2 group/inquire hover:shadow-lg"
            style={{ borderColor: "#D4A04A40", backgroundColor: "#D4A04A15", color: "#D4A04A" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D4A04A30";
              e.currentTarget.style.color = "#f5e6d0";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(212, 160, 74, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#D4A04A15";
              e.currentTarget.style.color = "#D4A04A";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Inquire
            <Wine className="w-3.5 h-3.5 transition-transform duration-500 group-hover/inquire:scale-110" />
          </button>
        </div>
      </GlassSurface>
    </div>
  );
};
/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT: ProductSection
   Pinned full-viewport showcase with bottle carousel.
   ═══════════════════════════════════════════════════════════════ */

export function ProductSection({ id }: { id?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [activeBottleIndex, setActiveBottleIndex] = useState(0);
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [, startTransition] = useTransition();

  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterVintage, setFilterVintage] = useState<number | null>(null);
  const [filterLimited, setFilterLimited] = useState<boolean>(false);

  // Get unique brands from inventory
  const brands = useMemo(() => {
    return Array.from(new Set(inventory.map(b => b.brand).filter(Boolean))) as string[];
  }, [inventory]);

  const activeBrand = brands[activeBrandIndex] ?? null;

  // Batch brand + bottle index change to avoid double render
  const switchBrand = useCallback((newIndex: number) => {
    startTransition(() => {
      setActiveBrandIndex(newIndex);
      setActiveBottleIndex(0);
    });
  }, []);

  // Fetch inventory on mount
  useEffect(() => {
    import("@/lib/actions/inventory")
      .then((m) => m.getInventory().then(setInventory).catch(console.error));
  }, []);

  // Filter inventory based on active filters
  const filteredBottles = useMemo(() => {
    return inventory.filter((b: Inventory) => {
      if (activeBrand && b.brand?.toUpperCase() !== activeBrand.toUpperCase()) return false;
      if (filterCategory && b.category !== filterCategory) return false;
      if (filterVintage && b.vintage !== filterVintage) return false;
      if (filterLimited && !(b.metadata as any)?.limited) return false;
      return true;
    });
  }, [inventory, activeBrand, filterCategory, filterVintage, filterLimited]);

  useEffect(() => {
    if (activeBottleIndex >= filteredBottles.length && filteredBottles.length > 0) {
      setActiveBottleIndex(0);
    }
  }, [filteredBottles.length, activeBottleIndex]);

  const activeBottle = filteredBottles[activeBottleIndex] || null;

  // Color cache — keyed by image_url, never recomputed for the same image
  const colorCache = useRef<Map<string, { base: string; mid: string; glow: string }>>(new Map());

  const [extractedColor, setExtractedColor] = useState<{ base: string; mid: string; glow: string }>({
    base: "#050403",
    mid: "rgba(212, 160, 74, 0.15)",
    glow: "rgba(212, 160, 74, 0.3)"
  });

  // Preload all bottle images when inventory loads so switching brands is instant
  useEffect(() => {
    const urls = inventory.map(b => b.image_url).filter(Boolean) as string[];
    preloadAllImages(urls);
  }, [inventory]);

  useEffect(() => {
    if (!activeBottle?.image_url) {
      setExtractedColor({ base: "#050403", mid: "rgba(212, 160, 74, 0.15)", glow: "rgba(212, 160, 74, 0.2)" });
      return;
    }

    const url = activeBottle.image_url;

    // Return cached result immediately — no canvas work needed
    if (colorCache.current.has(url)) {
      setExtractedColor(colorCache.current.get(url)!);
      return;
    }

    // Debounce: wait 150ms so rapid brand switching doesn't queue canvas work
    const debounce = setTimeout(() => {
      const colorImg = new window.Image();
      colorImg.crossOrigin = "anonymous";
      colorImg.src = url;

      colorImg.onload = () => {
        requestAnimationFrame(() => {
          const canvas = document.createElement("canvas");
          canvas.width = 10;
          canvas.height = 10;
          const ctx = canvas.getContext("2d")
          if (!ctx) return;

          ctx.drawImage(colorImg, 0, 0, 10, 10);
          const data = ctx.getImageData(0, 0, 10, 10).data;

          let r = 0, g = 0, b = 0, count = 0;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 50) {
              r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
            }
          }

          const fallback = { base: "#0a0805", mid: "rgba(212, 160, 74, 0.15)", glow: "rgba(212, 160, 74, 0.3)" };
          if (count === 0) { colorCache.current.set(url, fallback); setExtractedColor(fallback); return; }

          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);

          const result = {
            base: `rgb(${Math.max(8, Math.round(r * 0.15))}, ${Math.max(6, Math.round(g * 0.15))}, ${Math.max(4, Math.round(b * 0.15))})`,
            mid: `rgba(${r}, ${g}, ${b}, 0.2)`,
            glow: `rgba(${r}, ${g}, ${b}, 0.45)`
          };

          colorCache.current.set(url, result);
          setExtractedColor(result);
        });
      };

      colorImg.onerror = () => {
        const fallback = { base: "#050403", mid: "rgba(212, 160, 74, 0.1)", glow: "rgba(212, 160, 74, 0.2)" };
        colorCache.current.set(url, fallback);
        setExtractedColor(fallback);
      };
    }, 150);

    return () => clearTimeout(debounce);
  }, [activeBottle?.image_url]);

  const activeColor = extractedColor;

  // Reset bottle index when filters change
  const handleFilterChange = useCallback(() => {
    setActiveBottleIndex(0);
  }, []);

  // GSAP ScrollTrigger — pinned section with entrance/exit animations
  useLayoutEffect(() => {
    let ctx: gsap.Context;
    let timer: NodeJS.Timeout;

    // Nav click intro animation defined here to be added/removed properly
    const handleNavIntro = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail !== "product") return;

      const introTl = gsap.timeline();
      introTl.fromTo(
        ".product-hero-carousel",
        { y: 200, scale: 0.7, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1, ease: "power2.out" }
      );
      introTl.fromTo(
        ".product-detail-wrapper",
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
      introTl.fromTo(
        ".product-sidebar",
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.8"
      );
    };

    const initAnimation = () => {
      const lenis = (window as any).lenis || (window as any).Lenis;
      if (!lenis) {
        timer = setTimeout(initAnimation, 50);
        return;
      }

      ctx = gsap.context(() => {
        if (!wrapperRef.current || !sectionRef.current) return;

        gsap.config({ force3D: true });
        let mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          const masterTl = gsap.timeline({
          scrollTrigger: {
            scroller: window,
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${sectionRef.current!.offsetWidth * 1.5}`,
            refreshPriority: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.config({ force3D: true });

        // --- PHASE 1: INTRO ---
        masterTl.to({}, { duration: 1 });
        masterTl.addLabel("intro");

        // Bottle carousel
        masterTl.fromTo(
          ".product-hero-carousel",
          { y: 200, opacity: 0, scale: 0.85 },
          { y: 0, opacity: 1, scale: 1, duration: 2.5, ease: "expo.out", force3D: true, lazy: true },
          "intro+=0.2"
        );

        // Detail card & Sidebar
        masterTl.fromTo(
          ".product-detail-wrapper",
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.5, ease: "power3.out", force3D: true },
          "intro+=0.6"
        );
        masterTl.fromTo(
          ".product-sidebar",
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.5, ease: "power3.out", force3D: true },
          "intro+=0.6"
        );

        // --- PHASE 2: DWELL ---
        masterTl.to({}, { duration: 1.5 });

        // --- PHASE 3: OUTRO ---
        masterTl.addLabel("outro");

        masterTl.to(
          ".product-hero-carousel",
          { y: 120, opacity: 0, scale: 0.9, duration: 3, ease: "power2.inOut", force3D: true, lazy: true },
          "outro"
        );

        masterTl.to(
          ".product-detail-wrapper",
          { x: 80, opacity: 0, duration: 2.5, ease: "power2.inOut", force3D: true, lazy: true },
          "outro"
        );
        masterTl.to(
          ".product-sidebar",
          { x: -80, opacity: 0, duration: 2.5, ease: "power2.inOut", force3D: true, lazy: true },
          "outro"
        );
        }); // End desktop matchMedia

        // Simple animation for mobile
        mm.add("(max-width: 767px)", () => {
          gsap.fromTo(
            ".product-detail-wrapper",
            { opacity: 0, y: 30 },
            { 
              opacity: 1, y: 0, duration: 1, ease: "power3.out",
              scrollTrigger: {
                trigger: ".product-detail-wrapper",
                start: "top 85%"
              }
            }
          );
        });
      }, sectionRef);

      window.addEventListener("play-section-intro", handleNavIntro);
    };

    initAnimation();

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
      window.removeEventListener("play-section-intro", handleNavIntro);
    };
  }, []);

  return (
    <motion.section
      id={id || "product"}
      ref={sectionRef}
      className="h-[100dvh] md:h-screen w-full relative overflow-hidden z-20"
      animate={{ backgroundColor: activeColor.base }}
      transition={{ duration: 1.5 }}
    >
      {/* GLOBAL PRODUCT SPOTLIGHT - No Clipping */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        animate={{
          background: `radial-gradient(circle at 50% 50%, ${activeColor.glow} 0%, ${activeColor.mid} 35%, ${activeColor.base} 70%)`
        }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Secondary glass frosting layer (optimised blur out to save composite load) */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ opacity: 1 }}
      />

      <div
        ref={wrapperRef}
        className="relative z-10 flex flex-col h-full w-full pt-16 md:pt-24 pb-4 px-4 md:px-12"
      >
        {/* Main Content Area */}
        <div className={`flex-1 w-full relative min-h-0 ${isMobile ? '' : 'isolate'}`}>
          {/* Bottle Selection Sidebar — Left (Desktop only) */}
          <div
            className="product-sidebar absolute z-30 left-0 lg:left-4 xl:left-12 top-1/2 -translate-y-1/2 w-[280px] hidden lg:flex flex-col gap-2 max-h-[75vh] items-start will-change-[transform,opacity,filter]"
            style={{ maskImage: "linear-gradient(to bottom, transparent, black 2%, black 95%, transparent)", paddingBlock: "10px" }}
          >
            {/* Filter Controls */}
            <div className="w-full flex flex-col gap-3 mb-2 pb-4 border-b border-white/10 shrink-0">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 mb-1">Selections Filters</h3>

              <div className="flex bg-black/30 border border-white/10 rounded-lg overflow-hidden relative group">
                <select
                  aria-label="Filter by Category"
                  className={`w-full bg-transparent text-white/80 text-[10px] uppercase tracking-widest px-3 py-2.5 outline-none appearance-none cursor-pointer focus:border-[#D4A04A] transition-colors`}
                  value={filterCategory || ""}
                  onChange={(e) => { setFilterCategory(e.target.value || null); setActiveBottleIndex(0); }}
                >
                  {Array.from(new Set(inventory.map(b => b.category))).map(cat => (
                    <option key={cat} value={cat} className="text-black">{cat}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>

              <div className="flex bg-black/30 border border-white/10 rounded-lg overflow-hidden relative group">
                <select
                  aria-label="Filter by Vintage"
                  className={`w-full bg-transparent text-white/80 text-[10px] uppercase tracking-widest px-3 py-2.5 outline-none appearance-none cursor-pointer focus:border-[#D4A04A] transition-colors`}
                  value={filterVintage || ""}
                  onChange={(e) => { setFilterVintage(e.target.value ? Number(e.target.value) : null); setActiveBottleIndex(0); }}
                >
                  <option value="" className="text-black">All Vintages</option>
                  {Array.from(new Set(inventory.map(b => b.vintage))).sort().map(vin => (
                    <option key={vin} value={vin} className="text-black">{vin}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>

              <label className="flex items-center gap-3 mt-1 cursor-pointer group">
                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${filterLimited ? `bg-[#D4A04A] border-[#D4A04A]` : 'border-white/20 group-hover:border-white/50 bg-black/20'}`}>
                  {filterLimited && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input type="checkbox" className="hidden" checked={filterLimited} onChange={(e) => { setFilterLimited(e.target.checked); setActiveBottleIndex(0); }} />
                <span className="text-[10px] uppercase tracking-widest text-white/60 group-hover:text-white/90">Limited Edition</span>
              </label>
            </div>

            <div className="w-full overflow-y-auto scrollbar-none flex flex-col gap-2 pr-2 pb-8 flex-1">
              {filteredBottles.map((bottle, idx) => (
                <button
                  key={bottle.id}
                  onClick={() => setActiveBottleIndex(idx)}
                  className={`text-left px-4 py-3 rounded-xl text-xs font-serif tracking-wider transition-all duration-300 w-full truncate ${idx === activeBottleIndex
                      ? "font-bold border shadow-[0_0_15px_rgba(212,160,74,0.15)]"
                      : "text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent"
                    }`}
                  style={
                    idx === activeBottleIndex
                      ? { color: "#D4A04A", borderColor: "#D4A04A55", backgroundColor: "#D4A04A15" }
                      : {}
                  }
                >
                  {bottle.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Layout Redesign */}
          {isMobile && (
            <div className="relative z-20 flex flex-col w-full h-full pb-2 overflow-hidden">
               {/* Minimalist Filter Pills */}
               <div className="flex flex-wrap justify-center gap-1.5 w-full pb-3 px-2 mt-0">
                 <button onClick={() => { setFilterCategory(null); setActiveBottleIndex(0); }} className={`px-3 py-1.5 rounded-full border text-[9px] font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-colors ${filterCategory === null ? 'border-[#D4A04A] text-black bg-[#D4A04A]' : 'border-white/10 text-white/60 bg-white/5'}`}>All</button>
                 {Array.from(new Set(inventory.map(b => b.category))).map(cat => (
                   <button key={cat} onClick={() => { setFilterCategory(cat); setActiveBottleIndex(0); }} className={`px-3 py-1.5 rounded-full border text-[9px] font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-colors ${filterCategory === cat ? 'border-[#D4A04A] text-black bg-[#D4A04A]' : 'border-white/10 text-white/60 bg-white/5'}`}>{cat}</button>
                 ))}
                 <div className="w-px h-5 bg-white/10 my-auto shrink-0 mx-0.5" />
                 <select aria-label="Vintage" value={filterVintage || ""} onChange={(e) => { setFilterVintage(e.target.value ? Number(e.target.value) : null); setActiveBottleIndex(0); }} className="px-3 py-1.5 rounded-full border border-white/10 text-white/60 bg-white/5 text-[9px] font-bold tracking-[0.2em] uppercase outline-none appearance-none cursor-pointer text-center min-w-[70px]">
                   <option value="" className="text-black">Year</option>
                   {Array.from(new Set(inventory.map(b => b.vintage))).sort().map(vin => (
                     <option key={vin} value={vin} className="text-black">{vin}</option>
                   ))}
                 </select>
               </div>

               {/* Minimalist Bottle Display */}
               <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full relative overflow-hidden touch-pan-y">
                 <AnimatePresence mode="wait" initial={false}>
                   {activeBottle ? (
                     <motion.div
                       key={activeBottle.id}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       transition={{ type: "spring", stiffness: 300, damping: 30 }}
                       drag="x"
                       dragConstraints={{ left: 0, right: 0 }}
                       dragElastic={0.4}
                       onDragEnd={(_, info) => {
                         const threshold = 50;
                         if (info.offset.x < -threshold) {
                           setActiveBottleIndex(Math.min(filteredBottles.length - 1, activeBottleIndex + 1));
                         } else if (info.offset.x > threshold) {
                           setActiveBottleIndex(Math.max(0, activeBottleIndex - 1));
                         }
                       }}
                       className="relative w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                     >
                       <div className="h-[45vh] w-full flex items-center justify-center shrink-0">
                         <BottleImage bottle={activeBottle} isActive={true} />
                       </div>

                       {/* Swipe Indicator & Pagination */}
                       <div className="flex items-center gap-3 mt-4">
                         <button aria-label="Previous" onClick={() => setActiveBottleIndex(Math.max(0, activeBottleIndex - 1))} className="p-2 opacity-50 active:scale-90"><ChevronLeft className="w-4 h-4" /></button>
                         <span className="text-[9px] text-white/40 tracking-[0.3em] uppercase font-bold min-w-[60px] text-center">
                           {activeBottleIndex + 1} / {filteredBottles.length}
                         </span>
                         <button aria-label="Next" onClick={() => setActiveBottleIndex(Math.min(filteredBottles.length - 1, activeBottleIndex + 1))} className="p-2 opacity-50 active:scale-90"><ChevronRight className="w-4 h-4" /></button>
                       </div>
                     </motion.div>
                   ) : (
                     <div className="text-white/40 text-xs tracking-widest uppercase flex flex-col items-center gap-3">
                        <Wine className="w-8 h-8 opacity-20" />
                        No selections
                     </div>
                   )}
                 </AnimatePresence>
               </div>

               {/* Sleek Info & Action Sheet */}
               {activeBottle && (
                 <div className="w-full shrink-0 flex flex-col items-center px-4 mt-2">
                    <h3 className="text-2xl font-serif font-bold text-center text-[#f5e6d0] leading-tight mb-2 truncate w-full px-2">{activeBottle.name}</h3>
                    <div className="flex items-center justify-center gap-2 text-[9px] text-[#D4A04A]/80 uppercase tracking-widest font-bold mb-4 w-full truncate px-2">
                      <span>{activeBottle.vintage}</span>
                      <span className="w-1 h-1 rounded-full bg-[#D4A04A]/40" />
                      <span className="truncate max-w-[120px]">{activeBottle.region}</span>
                      <span className="w-1 h-1 rounded-full bg-[#D4A04A]/40" />
                      <span>₱{activeBottle.price.toLocaleString()}</span>
                    </div>
                    
                    <button onClick={() => setIsModalOpen(true)} className="w-full max-w-[280px] py-3.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg">
                      Inquire Now <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                 </div>
               )}
            </div>
          )}

          {/* Hero Bottle Carousel - Desktop Only */}
          {!isMobile && (
            <div className="product-hero-carousel absolute inset-0 z-10 flex items-center justify-center">
              <HeroBottleCarousel
                bottles={filteredBottles}
                activeIndex={activeBottleIndex}
                onIndexChange={setActiveBottleIndex}
                activeColor={activeColor}
              />
            </div>
          )}

          {/* Detail Card — floating right - Desktop Only */}
          {!isMobile && (
            <div className="absolute inset-y-0 right-0 z-20 flex items-center pr-6 lg:pr-12 xl:pr-16 pointer-events-none">
              <div className="product-detail-wrapper w-[90vw] lg:w-[380px] pointer-events-auto will-change-[transform,opacity,filter]">
                <BottleDetailCard
                  bottle={activeBottle}
                  onInquire={() => setIsModalOpen(true)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Brand Selection at Bottom Center */}
        <div className="product-brand-selector w-full mt-4 md:mt-6 flex flex-col items-center z-20 relative select-none mb-16 md:mb-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 w-full justify-center">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, #D4A04A44)` }} />
            <span className="text-[10px] uppercase tracking-[0.5em] font-semibold" style={{ color: "#D4A04A99" }}>
              Select Brand
            </span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, #D4A04A44)` }} />
          </div>

          {/* Brand Carousel — looping, same pan logic as bottle carousel */}
          <div className="relative w-full h-24 overflow-hidden touch-pan-y">
            {/* Carousel Content */}

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              onPanEnd={(_, info) => {
                const threshold = 50;
                const velocityThreshold = 300;
                if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                  switchBrand((activeBrandIndex + 1) % brands.length);
                } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                  switchBrand((activeBrandIndex - 1 + brands.length) % brands.length);
                }
              }}
            >
              {brands.map((brandName, idx) => {
                // Wrap distance so carousel loops
                let distance = idx - activeBrandIndex;
                const half = Math.floor(brands.length / 2);
                if (distance > half) distance -= brands.length;
                if (distance < -half) distance += brands.length;

                const isActive = distance === 0;
                const absDist = Math.abs(distance);
                const STEP = 100;

                return (
                  <motion.button
                    key={brandName}
                    className="absolute flex flex-col items-center gap-2 w-[80px]"
                    animate={{
                      x: distance * STEP,
                      scale: isActive ? 1.1 : absDist <= 2 ? 0.85 : 0.7,
                      opacity: isActive ? 1 : absDist === 1 ? 0.6 : absDist === 2 ? 0.3 : 0,
                      zIndex: brands.length - absDist,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 32 }}
                    onClick={() => {
                      switchBrand(idx);
                    }}
                  >
                    {/* Brand Logo or Initial */}
                    {BRAND_LOGOS[brandName.toUpperCase()] || BRAND_LOGOS[brandName] ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden border transition-all duration-300"
                        style={{
                          border: isActive ? "1px solid #D4A04A66" : "1px solid rgba(255,255,255,0.1)",
                          boxShadow: isActive ? "0 0 20px #D4A04A30" : "none",
                        }}
                      >
                        <img
                          src={BRAND_LOGOS[brandName.toUpperCase()] || BRAND_LOGOS[brandName] || ""}
                          alt={brandName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold uppercase text-sm border transition-all duration-300"
                        style={{
                          border: isActive ? "1px solid #D4A04A66" : "1px solid rgba(255,255,255,0.1)",
                          background: isActive
                            ? "radial-gradient(circle at 40% 35%, #D4A04A25, transparent 70%), rgba(255,255,255,0.05)"
                            : "rgba(255,255,255,0.02)",
                          color: isActive ? "#f5e6d0" : "rgba(255,255,255,0.8)",
                          boxShadow: isActive ? "0 0 20px #D4A04A30, inset 0 1px 0 #D4A04A40" : "none",
                        }}
                      >
                        {brandName[0]}
                      </div>
                    )}
                    <span
                      className="text-[9px] uppercase tracking-[0.3em] font-medium text-center w-full truncate"
                      style={{ color: isActive ? "#D4A04A" : "rgba(255,255,255,0.5)" }}
                    >
                      {brandName}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultOption={activeBottle?.id || ""}
      />
    </motion.section>
  );
}
