import type { Metadata } from "next";
import { Cinzel_Decorative, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "../components/ui/navbar";
import { SmoothScroll } from "../lib/smooth-scroll";
import { LoadingScreen } from "../components/loading-screen";
import { CustomScrollbar } from "../components/ui/custom-scrollbar";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: "Wine Century Brothers | Premium Wine & Spirits Distributor Philippines",
    template: "%s | Wine Century Brothers"
  },
  description: "Premier international distributor of fine wines and luxury spirits in the Philippines. Serving Binondo, Makati, and Metro Manila since 2010.",
  keywords: ["Wine Distributor Manila", "Fine Wine Philippines", "Binondo Wine Shop", "Makati Wine Lounge", "Luxury Spirits Manila", "Wine Century Brothers", "Wholesale Wine Philippines"],
  authors: [{ name: "Wine Century Brothers" }],
  creator: "Wine Century Brothers",
  publisher: "Wine Century Brothers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://winecentury.ph",
    title: "Wine Century Brothers | Fine Wine & Spirits Distributor",
    description: "Savor the Heritage, Crafted with Enduring Dedication. Premium international wine distribution since 2010.",
    siteName: "Wine Century Brothers",
    images: [
      {
        url: "/og-image.jpg", // Make sure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: "Wine Century Brothers Premium Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wine Century Brothers | Premium Wine Distributor",
    description: "Premier international distributor of fine wines and luxury spirits since 2010.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Wine Century Brothers",
  "url": "https://winecentury.ph",
  "logo": "https://winecentury.ph/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+63281234567",
    "contactType": "customer service",
    "email": "concierge@winecentury.ph",
    "areaServed": "PH",
    "availableLanguage": "English"
  },
  "location": [
    {
      "@type": "WineStore",
      "name": "Wine Century Brothers - Binondo",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Binondo",
        "addressRegion": "Manila",
        "addressCountry": "PH"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 14.5947701,
        "longitude": 120.9701705
      }
    },
    {
      "@type": "WineStore",
      "name": "Wine Century Brothers - Makati Lounge",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Makati",
        "addressRegion": "Metro Manila",
        "addressCountry": "PH"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 14.554722,
        "longitude": 121.01833
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans overflow-x-hidden", geist.variable)}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <LoadingScreen />
        <CustomScrollbar />
        <SmoothScroll>
          <Navigation />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
