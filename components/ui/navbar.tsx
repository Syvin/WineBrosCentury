"use client";

import { Home, Info, Layers, ShoppingBag, Contact } from "lucide-react";
import { FloatingDock } from "./floating-dock";
import GlassSurface from './glass-surface';
import { MobileNavigation } from "./mobile-navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { Cinzel_Decorative } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});



const Navigation = () => {
  const [lenis, setLenis] = useState<any>(null);
  const pathname = usePathname();

  const brandRef = useRef<HTMLHeadingElement>(null);
  const brandContainerRef = useRef<HTMLDivElement>(null);
  const dockContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initLenis = () => {
      const lenisInstance = (window as any).lenis || (window as any).Lenis;
      if (!lenisInstance) {
        setTimeout(initLenis, 100);
        return;
      }
      setLenis(lenisInstance);
    };
    initLenis();

    const aboutSection = document.getElementById('about');
    let mm = gsap.matchMedia();

    if (aboutSection && brandRef.current && dockContainerRef.current) {
      // Create a ScrollTrigger to handle the "About" layout shift (Desktop Only)
      mm.add("(min-width: 768px)", () => {
        const st = ScrollTrigger.create({
        trigger: aboutSection,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(brandRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              if (brandRef.current) brandRef.current.innerText = "WCB";
              gsap.to(brandRef.current, { opacity: 1, scale: 1, duration: 0.3 });
            }
          });
          gsap.to(dockContainerRef.current, {
            right: "50%",
            xPercent: 50,
            top: 20,
            duration: 0.8,
            ease: "power3.inOut"
          });
        },
        onLeave: () => {
          gsap.to(brandRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              if (brandRef.current) brandRef.current.innerText = "Wine Century Brothers";
              gsap.to(brandRef.current, { opacity: 1, scale: 1, duration: 0.3 });
            }
          });
          gsap.to(dockContainerRef.current, {
            right: window.innerWidth >= 768 ? "80px" : "24px",
            xPercent: 0,
            top: 40,
            duration: 0.8,
            ease: "power3.inOut"
          });
        },
        onEnterBack: () => {
          gsap.to(brandRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              if (brandRef.current) brandRef.current.innerText = "WCB";
              gsap.to(brandRef.current, { opacity: 1, scale: 1, duration: 0.3 });
            }
          });
          gsap.to(dockContainerRef.current, {
            right: "50%",
            xPercent: 50,
            top: 20,
            duration: 0.8,
            ease: "power3.inOut"
          });
        },
        onLeaveBack: () => {
          gsap.to(brandRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              if (brandRef.current) brandRef.current.innerText = "Wine Century Brothers";
              gsap.to(brandRef.current, { opacity: 1, scale: 1, duration: 0.3 });
            }
          });
          gsap.to(dockContainerRef.current, {
            right: window.innerWidth >= 768 ? "80px" : "24px",
            xPercent: 0,
            top: 40,
            duration: 0.8,
            ease: "power3.inOut"
          });
        }
      });

      const productsSection = document.getElementById('products');
      let stProducts: globalThis.ScrollTrigger | null = null;
      if (productsSection) {
        stProducts = ScrollTrigger.create({
          trigger: productsSection,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            gsap.to(brandRef.current, {
              scale: 0.8,
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                if (brandRef.current) brandRef.current.innerText = "WCB";
                gsap.to(brandRef.current, { opacity: 1, scale: 1, duration: 0.3 });
              }
            });
            gsap.to(brandContainerRef.current, {
              left: "50%",
              xPercent: -50,
              duration: 0.8,
              ease: "power3.inOut"
            });
          },
          onLeave: () => {
            gsap.to(brandRef.current, {
              scale: 0.8,
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                if (brandRef.current) brandRef.current.innerText = "Wine Century Brothers";
                gsap.to(brandRef.current, { opacity: 1, scale: 1, duration: 0.3 });
              }
            });
            gsap.to(brandContainerRef.current, {
              left: window.innerWidth >= 768 ? "80px" : "24px",
              xPercent: 0,
              duration: 0.8,
              ease: "power3.inOut"
            });
          },
          onEnterBack: () => {
            gsap.to(brandRef.current, {
              scale: 0.8,
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                if (brandRef.current) brandRef.current.innerText = "WCB";
                gsap.to(brandRef.current, { opacity: 1, scale: 1, duration: 0.3 });
              }
            });
            gsap.to(brandContainerRef.current, {
              left: "50%",
              xPercent: -50,
              duration: 0.8,
              ease: "power3.inOut"
            });
          },
          onLeaveBack: () => {
            gsap.to(brandRef.current, {
              scale: 0.8,
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                if (brandRef.current) brandRef.current.innerText = "Wine Century Brothers";
                gsap.to(brandRef.current, { opacity: 1, scale: 1, duration: 0.3 });
              }
            });
            gsap.to(brandContainerRef.current, {
              left: window.innerWidth >= 768 ? "80px" : "24px",
              xPercent: 0,
              duration: 0.8,
              ease: "power3.inOut"
            });
          }
        });
      } // <--- Close if (productsSection)
        
      return () => {
        st.kill();
        if (stProducts) stProducts.kill();
      };
    }); // end mm.add
  }
}, []);

  const links = useMemo(() => [
    {
      title: "Home",
      icon: <Home className="h-full w-full" />,
      href: "#home",
    },
    {
      title: "About",
      icon: <Info className="h-full w-full" />,
      href: "#about",
    },
    {
      title: "Collections",
      icon: <Layers className="h-full w-full" />,
      href: "#collections",
    },
    {
      title: "Products",
      icon: <ShoppingBag className="h-full w-full" />,
      href: "#products",
    },
    {
      title: "Contact",
      icon: <Contact className="h-full w-full" />,
      href: "#contact",
    },
  ], []);


  const handleLinkClick = (href: string) => {
    const sectionName = href.replace('#', '');

    if (lenis) {
      let scrollDuration = 1.5;
      let scrollOffset = 0;

      if (href === "#about") scrollDuration = 1.8;
      if (href === "#products") {
        scrollOffset = 1000;
        scrollDuration = 2.5;
      }

      lenis.scrollTo(href, {
        duration: scrollDuration,
        offset: scrollOffset,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('play-section-intro', { detail: sectionName }));
      }, scrollDuration * 1000 * 0.6);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('play-section-intro', { detail: sectionName }));
        }, 800);
      }
    }
  };

  const dockItems = useMemo(() =>
    links.map(l => ({
      ...l,
      onClick: () => handleLinkClick(l.href)
    })),
    [links, lenis]
  );

  return (
    <>
      {/* Brand Name - Top Left (Desktop Only) */}
      <div ref={brandContainerRef} className="hidden md:block fixed top-10 left-20 z-50 pointer-events-none">
        <h1
          ref={brandRef}
          className={`${cinzelDecorative.className} text-white font-bold text-3xl lg:text-4xl text-glow pointer-events-auto cursor-default transition-all duration-300`}
        >
          Wine Century Brothers
        </h1>
      </div>

      {/* Floating Dock - Top Right (Desktop Only) */}
      <div
        ref={dockContainerRef}
        className="hidden md:flex fixed top-10 right-20 z-50 justify-end pointer-events-none px-0"
      >
        <div className="pointer-events-auto">
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={32}
            brightness={40}
            opacity={0.8}
            blur={15}
            backgroundOpacity={0.02}
            saturation={1.5}
            className="p-1 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            displace={0.5}
            distortionScale={-50}
          >
            <FloatingDock
              items={dockItems}
              desktopClassName="bg-transparent dark:bg-transparent h-fit pb-0 px-2 pt-0 items-center border-none"
              mobileClassName=""
            />
          </GlassSurface>
        </div>
      </div>

      <MobileNavigation />
    </>
  );
};

export default Navigation;
