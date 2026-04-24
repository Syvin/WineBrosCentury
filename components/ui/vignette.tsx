"use client";

interface VignetteProps {
  /** Strength of the vignette (0-100) */
  strength?: number;
  /** Opacity of the vignette (0-1) */
  opacity?: number;
  /** Color of the vignette (hex or CSS color) */
  color?: string;
  /** Size of the vignette (0-100) */
  size?: number;
  /** Blur amount (0-100) */
  blur?: number;
  className?: string;
}

/**
 * Vignette component - adds a vignette effect to any image
 * 
 * Usage:
 * ```tsx
 * <div className="relative">
 *   <img src="/image.jpg" alt="Description" />
 *   <Vignette strength={80} opacity={0.7} color="#000000" />
 * </div>
 * ```
 */
export function Vignette({
  strength = 50,
  opacity = 0.7,
  color = "#000000",
  size = 50,
  blur = 10,
  className = "",
}: VignetteProps) {
  // Convert strength to radial-gradient parameters
  // Higher strength = more gradual fade
  const gradientStrength = strength / 2;
  
  const vignetteStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: "inherit",
    background: `radial-gradient(
      circle at center,
      transparent ${size}%, 
      ${color} ${gradientStrength + size}%
    )`,
    opacity,
    filter: `blur(${blur}px)`,
  };

  return <div style={vignetteStyle} className={className} />;
}
