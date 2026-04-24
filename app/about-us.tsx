"use client";

import { useLayoutEffect, useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Masonry from '@/components/about-us-section/masonry';
import GlassSurface from "@/components/ui/glass-surface";
import { getInventory } from "@/lib/actions/inventory";
import { preloadAllImages } from "@/lib/image-cache";
import type { Inventory } from "@/types/database";

gsap.registerPlugin(ScrollTrigger);

// All brand logos available in /public/brands/
const BRAND_SHOWCASE = [
  { name: "The Macallan", logo: "/brands/the-macallan-seeklogo.svg" },
  { name: "Macallan", logo: "/brands/macallan.png" },
  { name: "Dalmore", logo: "/brands/dalmore.png" },
  { name: "Johnnie Walker", logo: "/brands/jw.png" },
  { name: "Ballantine's", logo: "/brands/ballantines.png" },
  { name: "Mortlach", logo: "/brands/mortlach.png" },
  { name: "Caro", logo: "/brands/caro.png" },
];

// Skeleton shimmer block
const Shimmer = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`relative overflow-hidden bg-white/[0.05] rounded-xl ${className}`} style={style}>
    <motion.div
      className="absolute inset-0"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)" }}
      animate={{ x: ["-100%", "100%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

// --- SUB-COMPONENT: TwinVaults (Visual depiction of physical presence) ---
// All ambient animations are CSS @keyframes so they run on the GPU compositor
// and don't compete with the GSAP scrub that drives the slide transition.
const TwinVaults = () => {
  const [mounted, setMounted] = useState(false);
  const particles = useRef<{ left: string; top: string; duration: number; delay: number }[]>([]);

  const branches = [
    { name: "Binondo Hub", x: 25, y: 45, label: "Legacy Flagship", coords: "14° 35' N | 120° 58' E" },
    { name: "Aseana Node", x: 65, y: 65, label: "Modern Vault", coords: "14° 31' N | 120° 59' E" },
  ];

  // useEffect (not useLayoutEffect) — no synchronous DOM measurement needed
  useEffect(() => {
    particles.current = [...Array(12)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 15 + Math.random() * 25,
      delay: -(Math.random() * 20), // negative delay = natural stagger without waiting
    }));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Background glow — static, no animation needed */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] bg-[#d4af37]/10 blur-[100px] rounded-full opacity-40" />

      {/* Connecting Arc — CSS stroke-dashoffset animation via .vault-arc */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none" shapeRendering="geometricPrecision">
        <defs>
          <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
        </defs>
        <path
          d="M 25 45 Q 45 25 65 65"
          stroke="url(#arc-grad)"
          strokeWidth="0.12"
          fill="none"
          className="vault-arc"
        />
      </svg>

      {/* Branch Nodes — CSS entry animation via .vault-node */}
      {branches.map((b, i) => (
        <div
          key={i}
          className="absolute flex flex-col items-center group vault-node"
          style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${i * 0.5}s` }}
        >
          {/* Pulsing Core */}
          <div className="relative mb-6 flex items-center justify-center">
            <div className="w-3 h-3 bg-[#d4af37] rounded-full shadow-[0_0_25px_rgba(212,175,55,1)] z-20" />
            {/* Outer pulse ring — CSS scale+fade via .vault-pulse */}
            <div className="absolute inset-x-[-20px] inset-y-[-20px] border border-[#d4af37]/50 rounded-full vault-pulse" />
            {/* Inner ring — Tailwind animate-ping is a single cheap CSS animation */}
            <div className="absolute inset-x-[-4px] inset-y-[-4px] border border-white/20 rounded-full animate-ping opacity-20" />
          </div>

          {/* Float Card */}
          <GlassSurface
            width={180}
            height={64}
            borderRadius={10}
            backgroundOpacity={0.08}
            blur={12}
            className="border border-white/20 group-hover:border-yellow-500/60 shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-700"
          >
            <div className="flex flex-col items-center gap-1.5 px-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white brightness-125">{b.name}</span>
              <div className="w-8 h-px bg-yellow-500/40" />
              <span className="text-[8px] uppercase tracking-[0.3em] text-white/50">{b.coords}</span>
            </div>
          </GlassSurface>

          {/* Label — CSS opacity breathe via .vault-label-pulse */}
          <p className="mt-4 text-[10px] uppercase tracking-[0.6em] text-yellow-500/60 font-semibold drop-shadow-sm vault-label-pulse">
            {b.label}
          </p>
        </div>
      ))}

      {/* Particles — plain divs with CSS animation, zero JS per frame */}
      {particles.current.map((p, i) => (
        <div
          key={`p-${i}`}
          className="absolute w-px h-px bg-white/40 vault-particle"
          style={{
            left: p.left,
            top: p.top,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export function AboutSection({ id }: { id?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [masonryReady, setMasonryReady] = useState(false);
  const currentActiveIndex = useRef(0);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);

  useEffect(() => {
    getInventory().then((inv) => {
      setInventory(inv);
      preloadAllImages(inv.map(b => b.image_url).filter(Boolean) as string[]);
    }).catch(console.error).finally(() => setInventoryLoading(false));
  }, []);

  // Build masonry items from inventory images — varied heights for visual interest
  const masonryItems = useMemo(() => {
    const HEIGHTS = [400, 250, 600, 300, 350, 280, 450, 320];
    return inventory
      .filter(b => b.image_url)
      .slice(0, 8)
      .map((b, i) => ({
        id: b.id,
        img: b.image_url!,
        url: "#",
        height: HEIGHTS[i % HEIGHTS.length],
      }));
  }, [inventory]);

  useLayoutEffect(() => {
    let ctx: gsap.Context;
    let timer: NodeJS.Timeout;

    // Globally optimize GSAP for all following timelines
    gsap.config({ force3D: true });

    // Listen for navbar-triggered intro play events
    const handleNavIntro = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail !== 'about') return;

      // Play slide 1 intro animations imperatively (bypasses scrub)
      const slides = document.querySelectorAll('.about-slide');
      if (!slides[0]) return;

      const s1Title = slides[0].querySelector('h2');
      const s1Text = slides[0].querySelector('p');
      const masonryItems = slides[0].querySelectorAll('[data-key]');

      const introTl = gsap.timeline();

      if (s1Title && s1Text) {
        introTl.fromTo([s1Title, s1Text],
          { opacity: 0, x: -150 },
          { opacity: 1, x: 0, duration: 1.2, stagger: 0.3, ease: 'elastic.out(1, 0.8)' }
        );
      }

      if (masonryItems.length > 0) {
        introTl.fromTo(masonryItems,
          { opacity: 0, scale: 0.8, yPercent: 50 },
          { opacity: 1, scale: 1, yPercent: 0, duration: 1.2, stagger: { amount: 1, from: 'random', grid: 'auto' }, ease: 'power2.out' },
          '-=0.8'
        );
      }
    };

    const initAnimation = () => {
      const lenis = (window as any).lenis || (window as any).Lenis;

      if (!lenis) {
        timer = setTimeout(initAnimation, 50);
        return;
      }

      if (!masonryReady) return;

      ctx = gsap.context(() => {
        if (!wrapperRef.current || !sectionRef.current) return;

        let mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          const slides = gsap.utils.toArray(".about-slide") as HTMLElement[];

          const masterTl = gsap.timeline({
            scrollTrigger: {
              scroller: window,
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              snap: {
                snapTo: [0, 0.25, 0.5, 0.75, 1],
                duration: { min: 0.2, max: 0.5 },
                delay: 0,
                ease: "power2.inOut"
              },
              end: () => `+=${sectionRef.current!.offsetWidth * 3.5}`,
              refreshPriority: 10,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const index = Math.min(2, Math.floor(self.progress * 3));
                if (index !== currentActiveIndex.current) {
                  currentActiveIndex.current = index;
                  setActiveIndex(index);
                }
              }
            },
          });

          // --- PHASE 1: Slide 1 Cinematic Intro ---
          masterTl.addLabel("s1_start");
          const s1Title = slides[0].querySelector("h2");
          const s1Text = slides[0].querySelector("p");
          const masonryItems = slides[0].querySelectorAll(".masonry-item");

          if (s1Title && s1Text) {
            masterTl.fromTo([s1Title, s1Text],
              { opacity: 0, y: 150, scale: 0.8 },
              { opacity: 1, y: 0, scale: 1, duration: 1.5, stagger: 0.2, ease: "power3.out", force3D: true, lazy: true },
              "s1_start"
            );
          }

          if (masonryItems.length > 0) {
            masterTl.fromTo(masonryItems,
              { opacity: 0, scale: 0.6 },
              { opacity: 1, scale: 1, duration: 1.2, stagger: { amount: 0.8, from: "center" }, ease: "power2.out", force3D: true, lazy: true },
              "s1_start+=0.3"
            );
          }

          // --- PHASE 2: BLENDED TRANSITION 1 -> 2 ---
          masterTl.addLabel("s1_to_s2", "+=0.4");

          masterTl.to(slides[0], { opacity: 0, scale: 1.1, duration: 1, ease: "power2.in", force3D: true, lazy: true }, "s1_to_s2");
          masterTl.to(wrapperRef.current, { x: "-100vw", ease: "power3.inOut", duration: 1.2, force3D: true, lazy: true }, "s1_to_s2");

          // Intro 2
          masterTl.addLabel("s2_start", "s1_to_s2+=0.3");
          const s2Left = slides[1].querySelector(".order-2");
          const s2Right = slides[1].querySelector(".order-1");

          masterTl.fromTo(slides[1],
            { opacity: 0 },
            { opacity: 1, duration: 1.2, ease: "power4.out", force3D: true, lazy: true },
            "s1_to_s2+=0.2"
          );

          if (s2Right) {
            masterTl.fromTo(s2Right?.children,
              { opacity: 0, x: 200, scale: 0.9 },
              { opacity: 1, x: 0, scale: 1, duration: 1.5, stagger: 0.1, ease: "power4.out", force3D: true, lazy: true },
              "s2_start"
            );
          }
          if (s2Left) {
            masterTl.fromTo(s2Left,
              { opacity: 0, x: -200, scale: 0.8 },
              { opacity: 1, x: 0, scale: 1, duration: 1.8, ease: "power4.out", force3D: true, lazy: true },
              "s2_start+=0.1"
            );
          }

          // --- PHASE 3: BLENDED TRANSITION 2 -> 3 ---
          masterTl.addLabel("s2_to_s3", "+=0.6");
          gsap.set(slides[2], { x: "-100vw", zIndex: 10 });

          masterTl.to(slides[1], { opacity: 0, scale: 0.9, duration: 1, ease: "power2.in", force3D: true, lazy: true }, "s2_to_s3");

          // Intro 3
          masterTl.fromTo(slides[2],
            { opacity: 0, yPercent: 50, scale: 0.8 },
            { opacity: 1, yPercent: 0, scale: 1, duration: 1.5, ease: "power4.out", force3D: true, lazy: true },
            "s2_to_s3"
          );

          masterTl.addLabel("s3_start", "s2_to_s3+=0.5");
          const s3Content = slides[2].querySelector(".slide-content");
          if (s3Content) {
            masterTl.fromTo(s3Content?.children,
              { opacity: 0, y: 150, scale: 0.8 },
              { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.1, ease: "power3.out", force3D: true, lazy: true },
              "s3_start"
            );
          }

          masterTl.to({}, { duration: 0.5 });

          // --- PHASE 4: FINAL MELT ---
          masterTl.addLabel("s3_melt");
          masterTl.to(slides[2], {
            yPercent: 15,
            scale: 1.2,
            opacity: 0,
            duration: 1.5,
            ease: "power3.in",
            force3D: true,
            lazy: true
          }, "s3_melt");
        }); // End desktop matchMedia

        // Simple fade in for mobile
        mm.add("(max-width: 767px)", () => {
          const slides = gsap.utils.toArray(".about-slide") as HTMLElement[];
          slides.forEach((slide) => {
            gsap.fromTo(slide,
              { opacity: 0, y: 50 },
              {
                opacity: 1, y: 0, duration: 1, ease: "power3.out",
                scrollTrigger: {
                  trigger: slide,
                  start: "top 80%",
                }
              }
            );
          });
        });

      }, sectionRef);

      window.addEventListener('play-section-intro', handleNavIntro);
    };

    initAnimation();

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
      window.removeEventListener('play-section-intro', handleNavIntro);
    };
  }, [masonryReady]);

  const items = masonryItems;

  return (
    <section
      id={id}
      ref={sectionRef}
      className="w-full bg-black relative md:overflow-hidden md:h-screen"
    >
      <div
        ref={wrapperRef}
        className="flex flex-col md:flex-row md:h-full w-full md:w-fit"
      >
        {/* Slide 1 */}
        <div className="about-slide w-full md:w-screen md:h-full flex flex-col md:flex-row items-center justify-start md:justify-center shrink-0 px-6 md:px-10 pt-28 pb-20 md:py-0 h-[100dvh] md:h-full snap-start overflow-hidden">
          <div className="slide-content max-w-7xl mx-auto w-full text-white relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="text-left">
              <h2 className="text-5xl md:text-9xl font-bold mb-6 md:mb-8 uppercase tracking-tighter leading-[0.8]">
                Our<br />Legacy
              </h2>
              <p className="text-base md:text-2xl leading-relaxed opacity-70 font-light">
                Founded in 2010, Wine Century Brothers has been dedicated to
                bringing you the finest wines from the finest vineyards. Our passion
                for quality and tradition drives everything we do.
              </p>
            </div>

            <div className="relative h-[300px] md:h-[500px] w-full mt-8 md:mt-0">
              {inventoryLoading ? (
                <div className="grid grid-cols-3 gap-3 h-full">
                  {[400, 250, 600, 300, 350, 280].map((h, i) => (
                    <Shimmer key={i} className="rounded-xl" style={{ height: h / 2 }} />
                  ))}
                </div>
              ) : (
                <Masonry
                  items={items}
                  onReady={() => setMasonryReady(true)}
                  ease="power3.out"
                  duration={0.6}
                  stagger={0.05}
                  animateFrom="bottom"
                  scaleOnHover
                  hoverScale={0.95}
                  blurToFocus={false}
                  colorShiftOnHover={false}
                />
              )}            </div>
          </div>
        </div>

        {/* Slide 2 - Global Distribution */}
        <div className="about-slide w-full md:w-screen md:h-full flex flex-col md:flex-row items-center justify-center shrink-0 px-6 py-12 md:py-0 bg-zinc-950 h-[100dvh] md:h-full snap-start overflow-hidden">
          <div className="slide-content max-w-7xl mx-auto w-full text-white relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left Container: Brand Logos */}
            <div className="relative h-[250px] md:h-[500px] w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-4 md:p-8 order-2 md:order-1 group">
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-zinc-900 opacity-80" />
              <div className="relative z-10 w-full flex flex-col items-center gap-6">
                <p className="text-[10px] tracking-[0.6em] text-white/30 uppercase font-serif">Brands We Distribute</p>
                <div className="w-12 h-px bg-yellow-500/30" />

                {/* Brand logo grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full">
                  {BRAND_SHOWCASE.map((brand, i) => (
                    <motion.div
                      key={brand.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-2 group/brand"
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 transition-all duration-500 group-hover/brand:border-yellow-500/40 group-hover/brand:bg-black/60">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-full h-full object-contain opacity-70 group-hover/brand:opacity-100 transition-opacity duration-500"
                        />
                      </div>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 text-center group-hover/brand:text-white/60 transition-colors duration-300">
                        {brand.name}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="w-12 h-px bg-yellow-500/30 mt-2" />
                <p className="text-xs tracking-widest text-white/20">Distributing Since 2010</p>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20" />
            </div>

            {/* Right Container: Rephrased Text */}
            <div className="text-right order-1 md:order-2">
              <span className="text-yellow-500/60 uppercase tracking-[0.6em] text-xs mb-6 block font-medium">World Class Distribution</span>
              <h2 className="text-5xl md:text-8xl font-bold mb-6 md:mb-8 uppercase tracking-tighter leading-none">Global<br />Network</h2>
              <p className="text-sm md:text-2xl leading-relaxed opacity-60 font-light max-w-xl ml-auto">
                As a premier international distributor, we secure legacies from the world's most prestigious wine companies. Our partnerships span continents.
              </p>
              <div className="mt-6 md:mt-12 flex gap-3 md:gap-4 justify-end flex-wrap opacity-20">
                <span className="px-6 py-2 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:opacity-100 hover:border-yellow-500/40 transition-all cursor-default">France</span>
                <span className="px-6 py-2 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:opacity-100 hover:border-yellow-500/40 transition-all cursor-default">Italy</span>
                <span className="px-6 py-2 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:opacity-100 hover:border-yellow-500/40 transition-all cursor-default">Spain</span>
                <span className="px-6 py-2 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:opacity-100 hover:border-yellow-500/40 transition-all cursor-default">USA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3 - Local Distribution (Screen-filling Layout) */}
        <div className="about-slide w-full md:w-screen md:h-full flex flex-col justify-between shrink-0 p-6 md:p-16 lg:p-24 bg-zinc-950 overflow-hidden relative py-12 md:py-0 h-[100dvh] md:h-full snap-start">
          <TwinVaults />

          {/* Background Massive Text Layer (Bleed-edge) */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none opacity-[0.04] select-none z-0">
            <h3 className="text-[25vw] font-bold uppercase tracking-tighter leading-none italic whitespace-nowrap -ml-20 text-white">
              METRO MANILA
            </h3>
          </div>

          {/* Top-Right Branding */}
          <div className="relative z-20 text-right mb-auto">
            <span className="text-yellow-500/80 uppercase tracking-[1em] text-[10px] block font-semibold mb-2">Since 2010</span>
            <div className="h-px w-12 bg-yellow-500/40 ml-auto" />
          </div>

          {/* Main Visual Content Layer */}
          <div className="relative z-20 mt-auto mb-auto">
            <div className="flex flex-col gap-0">
              <span className="text-white/40 uppercase tracking-[1.5em] text-[12px] mb-8 font-medium block">Dual Strategic Hubs</span>
              <h2 className="text-[12vw] md:text-[15vw] font-bold uppercase tracking-tighter leading-[0.75] text-white flex flex-col">
                <span className="hover:text-yellow-500 transition-colors duration-700">BINONDO</span>
                <span className="text-outline text-transparent opacity-30 hover:opacity-100 hover:text-white transition-all duration-1000 ml-[10vw]">ASEANA</span>
              </h2>
            </div>
          </div>

          {/* Bottom Descriptive Layer */}
          <div className="relative z-20 flex flex-col md:flex-row items-end justify-between w-full mt-auto gap-12">
            <div className="max-w-2xl text-left order-2 md:order-1">
              <p className="text-sm md:text-3xl leading-relaxed text-white/90 font-light mb-6 md:mb-8 max-w-[85vw]">
                From our historic <span className="text-yellow-500 font-semibold underline decoration-yellow-500/30 underline-offset-8">Binondo Flagship</span> to our <span className="text-yellow-500 font-semibold underline decoration-yellow-500/30 underline-offset-8">Aseana Node</span> in Parañaque, we offer direct access to the world's most curated vintages.
              </p>
              <div className="flex gap-8 items-center">
                <div className="w-16 h-px bg-yellow-500/50" />
                <p className="text-[11px] uppercase tracking-[0.6em] text-white/50 whitespace-nowrap font-medium italic">Private Curated Collection Hubs</p>
              </div>
            </div>

            <div className="order-1 md:order-2 text-right opacity-30 hover:opacity-90 transition-opacity duration-700 cursor-default">
              <p className="text-5xl md:text-9xl font-bold uppercase tracking-tighter leading-none select-none text-white">
                TWIN<br />VAULTS
              </p>
            </div>
          </div>

          {/* Subtle Side Label */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left hidden lg:block opacity-30">
            <span className="text-[10px] uppercase tracking-[1em] text-white/60 font-medium">Exclusive Presence</span>
          </div>
        </div>
      </div>


      {/* Decorative Slide Indicator */}
      <div className="slide-indicator hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 items-center gap-6 z-30">
        {[0, 1, 2].map((i) => {
          const isActive = i === activeIndex;

          const handleIndicatorClick = () => {
            const lenis = (window as any).lenis || (window as any).Lenis;
            if (!lenis || !sectionRef.current) return;

            // Find the ScrollTrigger for this section
            const st = ScrollTrigger.getAll().find(trigger => trigger.trigger === sectionRef.current);
            if (!st) return;

            // Map slide index (0, 1, 2) to timeline progress (roughly 0.1, 0.5, 0.85)
            // Slide 1 dwell is near the start, Slide 2 is the middle, Slide 3 is the end
            const targets = [0.1, 0.5, 0.85];
            const targetProgress = targets[i];

            const targetScroll = st.start + (st.end - st.start) * targetProgress;
            lenis.scrollTo(targetScroll, {
              duration: 1.5,
              easing: (t: number) => 1 - Math.pow(1 - t, 4)
            });
          };

          return (
            <button
              key={i}
              onClick={handleIndicatorClick}
              className="group flex flex-col items-center gap-2 cursor-pointer outline-none focus:outline-none"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 group-hover:scale-150 ${isActive
                  ? "bg-white scale-150 shadow-[0_0_12px_rgba(255,255,255,1)]"
                  : "bg-white/20 group-hover:bg-white/50"
                  }`}
              />
              <span className={`text-[10px] uppercase tracking-widest transition-all duration-500 ${isActive ? "text-white opacity-100" : "text-white/10 group-hover:text-white/40"
                }`}>
                {`0${i + 1}`}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
