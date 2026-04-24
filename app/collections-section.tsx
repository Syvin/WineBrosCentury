"use client";

import { useLayoutEffect, useRef, useEffect, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { getInventory } from "@/lib/actions/inventory";
import { preloadAllImages } from "@/lib/image-cache";
import type { Inventory } from "@/types/database";

gsap.registerPlugin(ScrollTrigger);

const CYCLE_INTERVAL = 3500; // ms per slide

/* ─── Skeleton shimmer ───────────────────────────────────────────── */
function MosaicSkeleton() {
  return (
    <div className="w-full h-full grid gap-2" style={{ gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 1fr)" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-2xl bg-white/[0.04] ${i === 0 ? "row-span-2" : ""}`}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Mosaic grid ────────────────────────────────────────────────── */
function CategoryMosaic({ items }: { items: Inventory[] }) {
  const featured = useMemo(() => items.filter(i => i.image_url).slice(0, 5), [items]);

  if (featured.length === 0) return <MosaicSkeleton />;

  return (
    <div className="w-full h-full grid gap-2" style={{ gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 1fr)" }}>
      {/* Large hero tile */}
      <div className="row-span-2 relative overflow-hidden rounded-2xl">
        <img src={featured[0].image_url!} alt={featured[0].name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-[9px] uppercase tracking-[0.3em] font-medium mb-1 text-amber-400">{featured[0].vintage}</p>
          <p className="text-xs text-white font-serif font-bold leading-tight line-clamp-2">{featured[0].name}</p>
        </div>
      </div>

      {/* Smaller tiles */}
      {featured.slice(1, 5).map((item) => (
        <div key={item.id} className="relative overflow-hidden rounded-2xl">
          <img src={item.image_url!} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-2">
            <p className="text-[8px] text-white/80 font-serif leading-tight line-clamp-1">{item.name}</p>
          </div>
        </div>
      ))}

      {/* Fill empty slots */}
      {Array.from({ length: Math.max(0, 4 - (featured.length - 1)) }).map((_, i) => (
        <div key={`empty-${i}`} className="rounded-2xl bg-white/[0.03] border border-white/[0.06]" />
      ))}
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────── */
export function CollectionsSection({ id }: { id?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    getInventory().then((inv) => {
      setInventory(inv);
      preloadAllImages(inv.map(b => b.image_url).filter(Boolean) as string[]);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  // Group into "slides" of 5 items each (one mosaic per slide)
  const slides = useMemo(() => {
    const withImages = inventory.filter(i => i.image_url);
    const result: Inventory[][] = [];
    for (let i = 0; i < withImages.length; i += 5) {
      result.push(withImages.slice(i, i + 5));
    }
    return result.length > 0 ? result : [[]];
  }, [inventory]);

  // Auto-cycle through slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(i => (i + 1) % slides.length);
    }, CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Active slide metadata — pick the first item for the label
  const activeItem = slides[activeIndex]?.[0] ?? null;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          pinSpacing: false,
        });

        gsap.fromTo(
          ".collections-content",
          { opacity: 0, y: 40, filter: "blur(12px)" },
          {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 1.2, ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(".collections-content", { opacity: 1, y: 0, filter: "blur(0px)" });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id || "collections"}
      ref={sectionRef}
      className="h-[100dvh] md:h-screen w-full relative overflow-hidden bg-transparent flex items-center justify-center py-12 md:py-0"
    >
      <div className="collections-content w-full h-full flex flex-col md:flex-row items-stretch gap-6 md:gap-0 px-6 md:px-16 md:py-20 max-w-[1400px] mx-auto">

        {/* Left — Text */}
        <div className="flex flex-col justify-center gap-6 md:w-[38%] shrink-0 pr-0 md:pr-12">
          <span className="text-yellow-500/60 uppercase tracking-[0.6em] text-[10px] font-medium">
            Curated Collections
          </span>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="skel-text" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                <div className="relative overflow-hidden rounded bg-white/[0.06] h-14 w-3/4">
                  <motion.div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} />
                </div>
                <div className="relative overflow-hidden rounded bg-white/[0.04] h-4 w-1/2">
                  <motion.div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: 0.1 }} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400/70 mb-3 font-medium">
                  {activeItem?.brand ?? "Wine Century Brothers"} · {activeItem?.vintage}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-white font-serif tracking-tight leading-tight mb-4">
                  {activeItem?.name ?? "Fine Collection"}
                </h2>
                <p className="text-white/40 text-sm max-w-xs font-light leading-relaxed">
                  {(activeItem?.metadata as any)?.description ??
                    `A distinguished ${activeItem?.category?.toLowerCase() ?? "selection"} from ${activeItem?.region ?? "the world's finest estates"}, crafted with enduring dedication.`}
                </p>
                {activeItem && (
                  <p className="mt-4 text-amber-400 text-sm font-semibold tracking-wider">
                    ₱{activeItem.price.toLocaleString()}
                  </p>
                )}
              </motion.div>            )}
          </AnimatePresence>

          {/* Slide indicators */}
          {!isLoading && slides.length > 1 && (
            <div className="flex items-center gap-2 mt-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="transition-all duration-500 rounded-full"
                  style={{
                    width: i === activeIndex ? 24 : 6,
                    height: 6,
                    background: i === activeIndex ? "#D4A04A" : "rgba(255,255,255,0.2)",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          <div className="h-px w-full" style={{ background: "linear-gradient(to right, rgba(212,160,74,0.3), transparent)" }} />

          <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 font-medium">
            {inventory.filter(i => i.image_url).length} bottles in collection
          </p>
        </div>

        {/* Right — Auto-cycling Mosaic */}
        <div className="flex-1 relative min-h-[300px] md:min-h-0">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="skel-mosaic" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <MosaicSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <CategoryMosaic items={slides[activeIndex] ?? []} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
