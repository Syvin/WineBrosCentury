"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Mail, Phone, MapPin, Send, X, ChevronRight } from "lucide-react";
import { Sedan } from "next/font/google";
import { Footer } from "@/components/ui/footer";
import GlassSurface from "@/components/ui/glass-surface";
import { motion, AnimatePresence } from "framer-motion";

const sedan = Sedan({
  variable: "--font-sedan",
  subsets: ["latin"],
  weight: "400",
});

import { InquiryModal } from "@/components/ui/inquiry-modal";

const BRANCHES = {
  binondo: {
    name: "BINONDO",
    address: "G/F Chinatown Lai-Lai Hotel 801 Ongpin cor, Sabino Padilla St, Sta Cruz, Manila, Manila, 1009 Metro Manila",
    coords: "14.602090084922542° N, 120.97761922698523° E",
    map: "https://www.google.com/maps?q=14.602090084922542,120.97761922698523&hl=en&z=17&output=embed",
    image: "https://placehold.co/800x1000/0a0a0a/333333?text=BINONDO+VAULT"
  },
  aseana: {
    name: "PARAÑAQUE",
    address: "Lot 37 Blk 5 Aseana Business Park, Parañaque",
    coords: "14.52815441612584° N, 120.98745645582076° E",
    map: "https://www.google.com/maps?q=14.52815441612584,120.98745645582076&hl=en&z=17&output=embed",
    image: "https://placehold.co/800x1000/0a0a0a/333333?text=ASEANA+VAULT"
  }
};

export function ContactView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState<keyof typeof BRANCHES>("binondo");
  const [showMap, setShowMap] = useState(true);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          }
        });

        const leftElements = gsap.utils.toArray('.contact-left-item');
        const rightElements = gsap.utils.toArray('.contact-right-item');
        const footerElement = containerRef.current?.querySelector('.contact-footer');

        // --- PHASE 1: INTRO ---
        masterTl.addLabel("intro");
        masterTl.fromTo(leftElements,
          { opacity: 0, x: -100, y: 50, rotationY: -15, filter: "blur(20px)" },
          { opacity: 1, x: 0, y: 0, rotationY: 0, filter: "blur(0px)", stagger: 0.1, ease: "power4.out", duration: 1 },
          "intro"
        )
          .fromTo(rightElements,
            { opacity: 0, x: 100, scale: 0.8, filter: "blur(20px)", rotationY: 15 },
            { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", rotationY: 0, stagger: 0.1, ease: "power4.out", duration: 1 },
            "intro+=0.2"
          )
          .fromTo(footerElement, { y: 50, opacity: 0 }, { y: 0, opacity: 0.4, duration: 1 }, "intro+=0.5");

        // --- PHASE 2: DWELL ---
        // We keep the dwell phase short for the last section so users reach the footer naturally
        masterTl.to({}, { duration: 0.5 });
      });

      mm.add("(max-width: 767px)", () => {
        const leftElements = gsap.utils.toArray('.contact-left-item');
        const rightElements = gsap.utils.toArray('.contact-right-item');
        const footerElement = containerRef.current?.querySelector('.contact-footer');

        gsap.set(leftElements, { opacity: 1, x: 0, y: 0, rotationY: 0, filter: "blur(0px)" });
        gsap.set(rightElements, { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", rotationY: 0 });
        if (footerElement) gsap.set(footerElement, { y: 0, opacity: 0.4 });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-screen h-[100dvh] md:min-h-screen flex flex-col items-center lg:justify-center relative overflow-hidden text-white bg-transparent">

      <div className="max-w-[1400px] w-full h-full flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-24 px-4 md:px-16 pt-20 pb-28 md:py-32 z-10 relative">

        <div className="contact-left-item lg:hidden flex flex-col items-center text-center gap-4 shrink-0">
          <h2 className={`${sedan.className} text-[32px] font-light uppercase tracking-tighter leading-none text-white/90`}>
            Direct <span className="italic text-yellow-600">Channel</span>
          </h2>
          
          <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 p-1 rounded-full backdrop-blur-md">
            {(Object.keys(BRANCHES) as Array<keyof typeof BRANCHES>).map((key) => (
              <button
                key={key}
                onClick={() => setActiveBranch(key)}
                className={`text-[9px] font-bold uppercase py-2.5 px-6 rounded-full transition-all duration-500 relative ${activeBranch === key ? "text-black" : "text-white/40"}`}
              >
                <span className="relative z-10 tracking-[0.3em]">{BRANCHES[key].name}</span>
                {activeBranch === key && (
                  <motion.div
                    layoutId="activeBranchPillMobile"
                    className="absolute inset-0 bg-yellow-600 rounded-full shadow-[0_0_15px_rgba(202,138,4,0.3)]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Left Column (Desktop Only for Title, Mobile for Contact Info) */}
        <div className="lg:col-span-5 text-left flex flex-col justify-center lg:h-full order-3 lg:order-1 shrink-0 lg:shrink" style={{ perspective: '1000px' }}>
          <div className="space-y-0 lg:space-y-12">
            
            {/* Desktop Title */}
            <h2 className={`hidden lg:block contact-left-item will-change-[opacity,transform,filter] ${sedan.className} text-[80px] font-light uppercase tracking-tighter leading-[0.85] text-white/90`}>
              Direct<br />
              <span className="italic text-yellow-600 ml-4">Channel</span>
            </h2>

            <div className="hidden lg:block contact-left-item will-change-[opacity,transform,filter] h-px w-24 bg-gradient-to-r from-yellow-600/50 to-transparent" />

            {/* Contact Actions Stack */}
            <div className="contact-left-item will-change-[opacity,transform,filter] flex flex-col gap-3 lg:gap-8 w-full mt-1 lg:mt-0">
              
              {/* Desktop: List layout */}
              <div className="hidden lg:flex flex-col gap-6 opacity-80 hover:opacity-100 transition-opacity duration-1000">
                <div className="flex items-center gap-6 group cursor-pointer w-fit">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-yellow-600/50 transition-colors">
                    <Mail className="w-4 h-4 text-yellow-600/80" />
                  </div>
                  <a href="mailto:concierge@winecentury.ph" className="text-xs tracking-[0.3em] uppercase group-hover:text-yellow-600 transition-colors font-semibold">concierge@winecentury.ph</a>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer w-fit">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-yellow-600/50 transition-colors">
                    <Phone className="w-4 h-4 text-yellow-600/80" />
                  </div>
                  <a href="tel:+63281234567" className="text-xs tracking-[0.3em] uppercase group-hover:text-yellow-600 transition-colors font-semibold">+63 (2) 8123 4567</a>
                </div>
              </div>

              <div className="hidden lg:block pt-8">
                <GlassSurface width={240} height={56} borderRadius={28} backgroundOpacity={0.05} blur={16} className="border border-white/20 hover:border-yellow-600/80 transition-all duration-700" displace={0.1}>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full h-full rounded-full flex items-center justify-center gap-6 group transition-all duration-500"
                  >
                    <span className="text-[11px] text-white/80 group-hover:text-white font-bold tracking-[0.5em] uppercase">
                      Purchase Inquiry
                    </span>
                    <ChevronRight className="w-4 h-4 text-yellow-600 group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </GlassSurface>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Map Frame */}
        <div className="lg:col-span-7 flex-1 lg:h-full flex flex-col justify-center order-2 lg:order-2 w-full" style={{ perspective: '1000px' }}>
          
          {/* Desktop Tabs */}
          <div className="hidden lg:flex contact-right-item will-change-[opacity,transform,filter] items-center gap-2 mb-8 ml-auto bg-white/[0.02] border border-white/5 p-1 rounded-full backdrop-blur-md">
            {(Object.keys(BRANCHES) as Array<keyof typeof BRANCHES>).map((key) => (
              <button
                key={key}
                onClick={() => setActiveBranch(key)}
                className={`text-[10px] font-bold uppercase py-3 px-8 rounded-full transition-all duration-500 relative ${activeBranch === key ? "text-black" : "text-white/40 hover:text-white/80"
                  }`}
              >
                <span className="relative z-10 tracking-[0.3em]">{BRANCHES[key].name}</span>
                {activeBranch === key && (
                  <motion.div
                    layoutId="activeBranchPillDesktop"
                    className="absolute inset-0 bg-yellow-600 rounded-full shadow-[0_0_20px_rgba(202,138,4,0.3)]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Map Frame */}
          <div className="contact-right-item will-change-[opacity,transform,filter] relative w-full h-[35vh] lg:h-auto lg:aspect-[4/3] rounded-[24px] md:rounded-[40px] overflow-hidden border border-white/10 group shadow-2xl bg-zinc-900">

            {/* Branch Image Fill - Desktop Only */}
            <AnimatePresence mode="popLayout">
              <motion.img
                key={BRANCHES[activeBranch].image}
                src={BRANCHES[activeBranch].image}
                alt={BRANCHES[activeBranch].name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: showMap ? 0 : 0.6, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden lg:block"
              />
            </AnimatePresence>

            {/* Branch Map Fill */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${showMap ? 'opacity-80' : 'opacity-0 lg:pointer-events-none'}`}>
              <iframe
                title={`Interactive map of ${BRANCHES[activeBranch].name} branch`}
                src={BRANCHES[activeBranch].map}
                className="w-full h-full grayscale invert"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:from-black/80 md:via-transparent md:to-black/20 pointer-events-none" />

            {/* Information & Map Toggle */}
            <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 md:p-12 flex justify-between items-end">
              <div className="flex flex-col text-white w-[80%]">
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-yellow-600 mb-1.5 md:mb-2 font-bold flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Flagship Location
                </span>
                <h3 className={`${sedan.className} text-3xl md:text-4xl text-white font-light tracking-wide mb-1.5`}>{BRANCHES[activeBranch].name}</h3>
                <p className="text-[9px] md:text-[10px] tracking-[0.2em] text-white/70 font-medium mb-1 uppercase leading-relaxed line-clamp-2 md:line-clamp-none">
                  {/* @ts-ignore */}
                  {BRANCHES[activeBranch].address}
                </p>
                <span className="hidden md:block text-[8px] tracking-widest text-white/40 font-medium">{BRANCHES[activeBranch].coords}</span>
              </div>

              <button
                onClick={() => setShowMap(!showMap)}
                className="hidden lg:flex w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full border border-white/20 bg-black/50 backdrop-blur-md items-center justify-center hover:bg-white hover:text-black transition-colors duration-500 z-20 group/mapbtn"
                title={showMap ? "Hide Map" : "Show Map"}
              >
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white group-hover/mapbtn:text-black transition-colors duration-500" />
              </button>
            </div>
          </div>

          {/* Mobile Details Area */}
          <div className="contact-right-item lg:hidden flex flex-col items-center gap-6 mt-6 px-2">
            <div className="flex flex-col items-center gap-2 text-center">
               <span className="text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 font-bold mb-1">Direct Concierge</span>
               <a href="mailto:concierge@winecentury.ph" className="text-base tracking-widest font-serif text-white hover:text-yellow-600 transition-colors underline underline-offset-4 decoration-white/10">concierge@winecentury.ph</a>
               <a href="tel:+63281234567" className="text-base tracking-widest font-serif text-white hover:text-yellow-600 transition-colors">+63 (2) 8123 4567</a>
            </div>
            
            <button onClick={() => setIsModalOpen(true)} className="w-full max-w-[300px] py-4 rounded-[20px] border border-yellow-600/30 bg-yellow-600/10 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg">
              Purchase Inquiry <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="contact-footer w-full text-center z-40 transform opacity-40 hover:opacity-100 transition-all duration-1000 hidden md:block md:absolute md:bottom-10 left-0 right-0">
        <Footer compact />
      </div>

      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export function ContactSection({ id }: { id?: string }) {
  return (
    <section id={id || "contact"} className="relative z-30">
      <ContactView />
    </section>
  );
}
