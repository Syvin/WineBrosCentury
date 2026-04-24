"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDoneSimulating, setIsDoneSimulating] = useState(false);
  const loadingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Simulate a smooth "filling up" of the bottle
    loadingInterval.current = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          if (loadingInterval.current) clearInterval(loadingInterval.current);
          setIsDoneSimulating(true);
          return 100;
        }
        // Accelerate near the end for satisfaction
        const next = prev + Math.max(0.2, (100 - prev) / 15);
        return Math.min(100, next);
      });
    }, 50);

    const handleLoad = () => {
      // Speed up near the end if the window says we are ready
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      if (loadingInterval.current) clearInterval(loadingInterval.current);
      window.removeEventListener("load", handleLoad);
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (isDoneSimulating) {
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = "auto";
        // Signal to other components (like the scrollbar) that they can now appear
        window.dispatchEvent(new CustomEvent('site-ready'));
      }, 1200);
    }
  }, [isDoneSimulating]);

  // Bottle Physics Calculation (Matching CustomScrollbar exactly)
  const progressRatio = loadingProgress / 100;
  
  // y: 280 (Bottom) to y: 20 (Top)
  const fluidY = 280 - (progressRatio * 260);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050505]"
        >
          <div className="relative w-48 h-[60vh] max-h-[500px]">
            <svg
              viewBox="0 0 100 300"
              className="w-full h-full overflow-visible drop-shadow-[0_0_40px_rgba(255,255,255,0.05)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Silhouette matching scrollbar */}
              <path
                d="M20 280 C20 295 80 295 80 280 L80 120 C80 100 70 90 62 80 L62 20 C62 10 38 10 38 20 L38 80 C30 90 20 100 20 120 Z"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                strokeOpacity="0.15"
              />

              <defs>
                <clipPath id="loading-bottle-shape">
                  <path d="M20 280 C20 295 80 295 80 280 L80 120 C80 100 70 90 62 80 L62 20 C62 10 38 10 38 20 L38 80 C30 90 20 100 20 120 Z" />
                </clipPath>
              </defs>

              {/* Fluid Layers */}
              <g clipPath="url(#loading-bottle-shape)">
                {/* Secondary 'Back' Wave */}
                <motion.path
                  animate={{ 
                    y: fluidY + 2,
                    x: [0, -25, 0] 
                  }}
                  transition={{ 
                    y: { type: "tween", duration: 0.1 },
                    x: { repeat: Infinity, duration: 4, ease: "linear" }
                  }}
                  d="M 0 15 Q 25 30 50 15 T 100 15 T 150 15 T 200 15 V 400 H 0 Z"
                  fill="rgba(255, 255, 255, 0.25)"
                />

                {/* Main White Fluid */}
                <motion.path
                  animate={{ 
                    y: fluidY,
                    x: [-20, 0, -20] 
                  }}
                  transition={{ 
                    y: { type: "tween", duration: 0.1 },
                    x: { repeat: Infinity, duration: 4.5, ease: "linear" }
                  }}
                  d="M 0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 V 400 H 0 Z"
                  fill="white"
                  className="drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                />

                {/* High-Intensity Surface Sparkle */}
                <motion.path
                  animate={{ 
                    y: fluidY,
                    x: [-25, 0, -25],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    y: { type: "tween", duration: 0.1 },
                    x: { repeat: Infinity, duration: 3.5, ease: "linear" },
                    opacity: { repeat: Infinity, duration: 1.5 }
                  }}
                  d="M 0 10 Q 25 -2 50 10 T 100 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
                />
              </g>

              {/* Floor Glow */}
              <ellipse cx="50" cy="295" rx="20" ry="5" fill="white" fillOpacity="0.1" className="blur-sm" />
            </svg>

            {/* Cinematic Indicators */}
            <div className="absolute top-[105%] left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap">
               <motion.span 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 0.2 }}
                 className="text-white text-[10px] uppercase tracking-[0.6em] mb-4 font-light"
               >
                 Aged for Perfection
               </motion.span>
               <div className="flex items-baseline gap-1">
                 <span className="text-white text-3xl font-serif tracking-tighter tabular-nums">
                   {loadingProgress.toFixed(0)}
                 </span>
                 <span className="text-white/40 text-xs font-serif">%</span>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
