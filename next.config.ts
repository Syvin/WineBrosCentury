import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'wpsldqzzzhcwrsmijraw.supabase.co',
      },
    ],
  },
  // @ts-ignore - turbopack root sometimes needed in monorepos or weird workspace setups
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
