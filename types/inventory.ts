export type WineCategory =
  | "WHISKY"
  | "BEER"
  | "WINES"
  | "COGNAC"
  | "VODKA-TEQUILA"
  | "CHINESE-BAIJIU"
  | "JAPANESE"
  | "KOREAN"
  | "LIQUEUR-GIN"
  | "RUM-BRANDY"
  | "SPARKLING-NON-ALCOHOLIC";

export type CurrencyCents = number;

export interface InventorySheetRow {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  vintage: number;
  region: string;
  // Store currency as integer cents to avoid floating-point rounding issues.
  price: CurrencyCents;
  // Must always be a whole number of bottles.
  stock: number;
  image_url?: string | null;
  category: WineCategory;
  metadata?: Record<string, unknown> | null;
}
