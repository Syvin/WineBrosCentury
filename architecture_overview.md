# Wine Century Brothers: Codebase Architecture Overview

This project is a high-end, visual-heavy brand site for **Wine Century Brothers**, built with a modern stack focusing on performance and premium aesthetics.

## 🚀 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | Core framework (App Router) |
| **Tailwind CSS 4** | Styling & Design System |
| **GSAP & ScrollTrigger** | Advanced animation & scroll orchestration |
| **Lenis** | High-performance smooth scrolling |
| **Framer Motion 12** | React-optimized motion & transitions |
| **Three.js / R3F** | 3D rendering for immersive elements |
| **Supabase** | Backend services (Auth, DB, Storage) |
| **Payload CMS** | Headless content management |

## 📁 Project Structure

### `app/` (Next.js App Router)
The landing page is composed of distinct section components integrated into the main page.
- [page.tsx](file:///i:/Coding/WebDev/Clients/wine-century-brothers/app/page.tsx): The main assembler. Manages the global background and the synchronized bottle scroll animation.
- [layout.tsx](file:///i:/Coding/WebDev/Clients/wine-century-brothers/app/layout.tsx): Defines global providers (SmoothScroll), navigation, and layout-wide UI components like `LoadingScreen` and `CustomScrollbar`.
- **Sections**:
  - [hero-section.tsx](file:///i:/Coding/WebDev/Clients/wine-century-brothers/app/hero-section.tsx): Initial entry point with branding.
  - [about-us.tsx](file:///i:/Coding/WebDev/Clients/wine-century-brothers/app/about-us.tsx): Story and history component.
  - [product-section.tsx](file:///i:/Coding/WebDev/Clients/wine-century-brothers/app/product-section.tsx): Collection showcase (Current Focus).
  - [contact-section.tsx](file:///i:/Coding/WebDev/Clients/wine-century-brothers/app/contact-section.tsx): Inquiry and contact form.

### `components/`
- **`ui/`**: Base design system components.
  - [glass-surface.tsx](file:///i:/Coding/WebDev/Clients/wine-century-brothers/components/ui/glass-surface.tsx): Custom component for glassmorphism effects.
  - [navbar.tsx](file:///i:/Coding/WebDev/Clients/wine-century-brothers/components/ui/navbar.tsx): Sticky navigation with scroll-aware active states.
  - [custom-scrollbar.tsx](file:///i:/Coding/WebDev/Clients/wine-century-brothers/components/ui/custom-scrollbar.tsx): Styled scrollbar for a cohesive brand experience.
- **`about-us-section/`**: Modular components specifically for the "About" section.

### `lib/` & `types/`
- Contains utility functions, API clients (Supabase/Payload), and TypeScript definitions ensuring type safety across the project.

## 🎨 Key Patterns & Features

### 1. Unified Scroll Orchestration
The site uses a combination of **Lenis** for smooth scroll feel, **GSAP ScrollTrigger** for complex pinning/animations, and **Framer Motion** for state-driven micro-interactions.

### 2. Premium Design Elements
- **Liquid Glass**: Specialized shaders for UI depth.
- **Custom Scrollbar**: Replaces native browser elements to match the brand palette.
- **Global Background**: A consistent radial gradient defined in `page.tsx` that maintains visual continuity.

### 3. Progressive Animation
Interactive elements like the "wine bottle" (in `page.tsx`) transition through different scales and positions based on the total scroll progress, creating a guided narrative for the user.
