"use client";

import LogoLoop from '../LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer, SiSupabase, SiThreedotjs } from 'react-icons/si';

const techLogos = [
    { node: <SiReact size={32} />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs size={32} />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript size={32} />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiTailwindcss size={32} />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
    { node: <SiFramer size={32} />, title: "Framer Motion", href: "https://framer.com/motion" },
    { node: <SiSupabase size={32} />, title: "Supabase", href: "https://supabase.com" },
    { node: <SiThreedotjs size={32} />, title: "Three.js", href: "https://threejs.org" },
];

export function BrandLoop() {
    return (
        <div className="w-full py-12 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <LogoLoop
                    logos={techLogos}
                    speed={80}
                    direction="left"
                    logoHeight={40}
                    gap={80}
                    hoverSpeed={0}
                    scaleOnHover
                    fadeOut
                    fadeOutColor="#050505"
                    ariaLabel="Technology partners"
                    className="opacity-50 hover:opacity-100 transition-opacity duration-500"
                />
            </div>
        </div>
    );
}