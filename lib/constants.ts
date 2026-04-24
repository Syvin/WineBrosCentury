export interface Product {
  value: string;
  label: string;
  description: string;
  wholesalePrice: string; // Represented as a range or starting price for wholesale context
  image?: string; // High-quality image URL for visual selection grids
}

export const INQUIRY_OPTIONS: Product[] = [
  // --- PREMIER WINES ---
  {
    value: "chateau-margaux",
    label: "CHÂTEAU MARGAUX",
    description: "First growth Bordeaux known for its refined elegance and multi-layered complexity.",
    wholesalePrice: "₱45,000 / Case of 6",
    image: "https://placehold.co/200x300/100/500?text=MARGAUX"
  },
  {
    value: "domain-romanee",
    label: "DOMAINE DE LA ROMANÉE-CONTI",
    description: "The world's most sought-after Pinot Noir, offering profound depth and aromatic intensity.",
    wholesalePrice: "₱180,000 / Bottle",
    image: "https://placehold.co/200x300/100/500?text=DRC"
  },
  {
    value: "lafite-rothschild",
    label: "LAFITE ROTHSCHILD",
    description: "A Pauillac legend defined by its signature graphite notes and immense ageing potential.",
    wholesalePrice: "₱52,000 / Case of 6",
    image: "https://placehold.co/200x300/100/500?text=LAFITE"
  },
  {
    value: "opus-one",
    label: "OPUS ONE",
    description: "The pioneering collaboration between Mondavi and Rothschild, capturing Napa's finest terroir.",
    wholesalePrice: "₱38,000 / Case of 6",
    image: "https://placehold.co/200x300/100/500?text=OPUS"
  },
  {
    value: "sassicaia",
    label: "SASSICAIA",
    description: "The original Super Tuscan, celebrated for its structural precision and Bolgheri character.",
    wholesalePrice: "₱28,000 / Case of 6",
    image: "https://placehold.co/200x300/100/500?text=SASSICAIA"
  },
  {
    value: "penfolds",
    label: "PENFOLDS GRANGE",
    description: "Australia's most iconic red, a powerful multi-regional Shiraz blend with decades of life.",
    wholesalePrice: "₱32,000 / Case of 6",
    image: "https://placehold.co/200x300/100/500?text=PENFOLDS"
  },

  // --- CHAMPAGNE & SPARKLING ---
  {
    value: "krug-vintage",
    label: "KRUG VINTAGE",
    description: "A rich, multi-dimensional vintage expression of the House's legendary craftsmanship.",
    wholesalePrice: "₱18,000 / Bottle",
    image: "https://placehold.co/200x300/100/500?text=KRUG"
  },
  {
    value: "dom-perignon",
    label: "DOM PÉRIGNON LUMINARY",
    description: "The ultimate prestige cuvée, balancing tension and ripeness with a silky texture.",
    wholesalePrice: "₱12,500 / Bottle",
    image: "https://placehold.co/200x300/100/500?text=DOM"
  },
  {
    value: "ace-of-spades",
    label: "ARMAND DE BRIGNAC (ACE)",
    description: "Strikingly decadent Gold Brut, a favorite for high-tier celebrations and prestige hospitality.",
    wholesalePrice: "₱22,000 / Bottle",
    image: "https://placehold.co/200x300/100/500?text=ACE"
  },

  // --- RARE SPIRITS & WHISKY ---
  {
    value: "macallan-rare",
    label: "THE MACALLAN (RARE)",
    description: "Exquisite Sherry-seasoned oak casks impart deep mahogany color and wood spice notes.",
    wholesalePrice: "₱85,000 / Case of 3",
    image: "https://placehold.co/200x300/100/500?text=MACALLAN"
  },
  {
    value: "yamazaki-18",
    label: "YAMAZAKI 18 YEARS",
    description: "Japan's flagship single malt, renowned for its Oloroso sherry cask influence and spicy finish.",
    wholesalePrice: "₱42,000 / Bottle",
    image: "https://placehold.co/200x300/100/500?text=YAMAZAKI"
  },
  {
    value: "hennessy-x-o",
    label: "HENNESSY X.O",
    description: "The original 'Extra Old' cognac, a complex blend of 100 eaux-de-vie for a robust experience.",
    wholesalePrice: "₱11,800 / Bottle",
    image: "https://placehold.co/200x300/100/500?text=HENNESSY"
  },
  {
    value: "johnnie-walker-blue",
    label: "JOHNNIE WALKER BLUE",
    description: "An extraordinary blend of rare whiskies, delivering a mellow, velvety signature profile.",
    wholesalePrice: "₱48,000 / Case of 6",
    image: "https://placehold.co/200x300/100/500?text=JOHNNIE"
  },

  // --- HERITAGE FILIPINO SPIRITS ---
  {
    value: "lambanog-premium",
    label: "LAKAN PREMIUM LAMBANOG",
    description: "A multi-distilled spirit from coconut nectar, offering a smooth, clean, and artisanal profile.",
    wholesalePrice: "₱2,800 / Bottle",
    image: "https://placehold.co/200x300/100/500?text=LAKAN"
  },
  {
    value: "tanduay-climax",
    label: "TANDUAY CLIMAX",
    description: "The pinnacle of Tanduay's blending expertise, aged to perfection for a premium rum experience.",
    wholesalePrice: "₱4,500 / Bottle",
    image: "https://placehold.co/200x300/100/500?text=TANDUAY"
  },
  {
    value: "don-papa-rare",
    label: "DON PAPA RARE CASK",
    description: "Unfiltered and unblended rum from Negros Occidental, aged in over-toasted American oak.",
    wholesalePrice: "₱6,200 / Bottle",
    image: "https://placehold.co/200x300/100/500?text=DON+PAPA"
  },
  {
    value: "santa-ana-gin",
    label: "SANTA ANA GIN",
    description: "Botanically rich gin inspired by the Roaring 20's in Manila, featuring Ylang-Ylang and Alingatog.",
    wholesalePrice: "₱2,500 / Bottle",
    image: "https://placehold.co/200x300/100/500?text=SANTA+ANA"
  },
  {
    value: "san-miguel-premium",
    label: "SAN MIGUEL PREMIUM",
    description: "Expect a full-bodied experience with a balanced hop character and exceptional smoothness.",
    wholesalePrice: "₱1,800 / Case of 24",
    image: "https://placehold.co/200x300/100/500?text=SAN+MIGUEL"
  },
];


export const CAROUSEL_BRANDS = [
  "DOM", "LAFITE", "OPUS", "SASSICAIA",
  "PENFOLDS", "ROEDERER", "CLICQUOT", "KRUG",
  "MOUTON", "ROTHSCHILD", "STAGS", "MACALLAN",
  "HENNESSY", "YAMAZAKI", "DON PAPA", "LAKAN"
];

// Brand logo mapping for the carousel
export const BRAND_LOGOS: Record<string, string> = {
  // Short names (from CAROUSEL_BRANDS)
  "DOM": "/brands/dom-perignon.png",
  "LAFITE": "/brands/chateau-lafite-rothschild.png",
  "OPUS": "/brands/opus-one.png",
  "SASSICAIA": "/brands/sassicaia.png",
  "PENFOLDS": "/brands/penfolds.png",
  "ROEDERER": "/brands/roederer.png",
  "CLICQUOT": "/brands/clicquot.png",
  "KRUG": "/brands/krug.png",
  "MOUTON": "/brands/chateau-mouton.png",
  "ROTHSCHILD": "/brands/chateau-rothschild.png",
  "STAGS": "/brands/stags.png",
  "MACALLAN": "/brands/macallan.png",
  "HENNESSY": "/brands/hennessy.png",
  "YAMAZAKI": "/brands/yamazaki.png",
  "DON PAPA": "/brands/don-papa.png",
  "LAKAN": "/brands/lakan.png",
  // Additional brands from inventory
  "BALLANTINE": "/brands/ballantines.png",
  "BALLANTINE'S": "/brands/ballantines.png",
  "CARO": "/brands/caro.png",
  "DALMORE": "/brands/dalmore.png",
  "JW": "/brands/jw.png",
  "JOHNNIE WALKER": "/brands/jw.png",
  "JOHNNIE WALKER BLUE": "/brands/jw.png",
  "MORTLACH": "/brands/mortlach.png",
  "THE MACALLAN": "/brands/the-macallan-seeklogo.svg",
};

