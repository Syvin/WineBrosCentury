import type { InquiryInsert } from "@/types/database";
import type { WineCategory } from "@/types/inventory";
import { getSheetsClient, getRequiredEnv } from "./utils";
import { CAROUSEL_BRANDS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Inventory sheet configuration
// ---------------------------------------------------------------------------

/**
 * All category sheet tab names to read inventory from.
 * Each tab uses the same positional column layout:
 *   A = Product Name
 *   B = Stock / Quantity
 *   C = SRP / Price
 *   D = Promos
 * Row 1 is assumed to be a header row and is skipped.
 */
export const INVENTORY_SHEETS: WineCategory[] = [
  "WHISKY",
  "BEER",
  "WINES",
  "COGNAC",
  "VODKA-TEQUILA",
  "CHINESE-BAIJIU",
  "JAPANESE",
  "KOREAN",
  "LIQUEUR-GIN",
  "RUM-BRANDY",
  "SPARKLING-NON-ALCOHOLIC",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GoogleInventoryRow {
  sku: string;
  name: string;
  brand: string | null;
  vintage: number;
  region: string;
  price: number;
  stock: number;
  category: WineCategory;
  image_url: string | null;
  metadata: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a raw value to a finite number.
 * Strips common currency symbols/commas before parsing.
 */
function toNumber(raw: unknown, field: string): number {
  const cleaned = String(raw ?? "")
    .trim()
    .replace(/[₱,]/g, "");
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${field} value in Google Sheet: ${String(raw)}`);
  }
  return value;
}

/**
 * Convert a raw value to a whole integer.
 */
function toInteger(raw: unknown, field: string): number {
  const value = toNumber(raw, field);
  if (!Number.isInteger(value)) {
    throw new Error(
      `Invalid ${field} value in Google Sheet (must be integer): ${String(raw)}`
    );
  }
  return value;
}

/**
 * Generate a stable SKU from the sheet (category) name and product name.
 * Example: "WHISKY" + "Johnnie Walker Blue Label" → "WHISKY-johnnie-walker-blue-label"
 */
function generateSku(sheetName: string, name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${sheetName}-${slug}`;
}

/**
 * Derive a brand name from the product name.
 * Priority:
 *  1. Fuzzy match against CAROUSEL_BRANDS constants
 *  2. First word of the name as a fallback
 */
function deriveBrand(name: string): string {
  const matched = CAROUSEL_BRANDS.find((b) => name.toUpperCase().includes(b));
  return matched ?? name.split(" ")[0];
}

// ---------------------------------------------------------------------------
// Main fetcher
// ---------------------------------------------------------------------------

/**
 * Reads inventory from ALL category sheet tabs and merges them into a single
 * flat list of GoogleInventoryRow objects.
 *
 * Column layout expected in each sheet (row 1 = headers, skipped):
 *   A → name
 *   B → stock
 *   C → price (SRP)
 *   D → promos (optional)
 */
export async function fetchInventoryFromGoogleSheet(): Promise<GoogleInventoryRow[]> {
  const spreadsheetId = getRequiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const sheets = getSheetsClient();

  const allRows: GoogleInventoryRow[] = [];
  const currentYear = new Date().getFullYear();

  for (const sheetName of INVENTORY_SHEETS) {
    const range = `${sheetName}!A:D`;

    let response;
    try {
      response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
    } catch (err) {
      console.warn(`[Sheets] Could not read sheet "${sheetName}":`, err);
      continue;
    }

    const rows = response.data.values ?? [];

    // Row 0 is the header row — skip it. If the sheet is empty, skip entirely.
    if (rows.length <= 1) {
      console.log(`[Sheets] Sheet "${sheetName}" is empty or header-only, skipping.`);
      continue;
    }

    const dataRows = rows.slice(1);

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];

      // Column A: name (required)
      const rawName = String(row[0] ?? "").trim();
      if (!rawName) {
        // Skip blank rows
        continue;
      }

      // Column B: stock (required, default 0 if missing/invalid)
      let stock = 0;
      try {
        stock = toInteger(row[1] ?? "0", "stock");
      } catch {
        console.warn(
          `[Sheets] Sheet "${sheetName}" row ${i + 2}: invalid stock "${row[1]}", defaulting to 0`
        );
      }

      // Column C: price/SRP (required, default 0 if missing/invalid)
      let price = 0;
      try {
        price = toNumber(row[2] ?? "0", "price");
      } catch {
        console.warn(
          `[Sheets] Sheet "${sheetName}" row ${i + 2}: invalid price "${row[2]}", defaulting to 0`
        );
      }

      // Column D: promos (optional)
      const rawPromos = String(row[3] ?? "").trim();
      const metadata: Record<string, unknown> | null = rawPromos
        ? { promo: rawPromos }
        : null;

      allRows.push({
        sku: generateSku(sheetName, rawName),
        name: rawName,
        brand: deriveBrand(rawName),
        vintage: currentYear,
        region: "",
        price,
        stock,
        category: sheetName,
        image_url: null,
        metadata,
      });
    }

    console.log(
      `[Sheets] Read ${dataRows.filter((r) => String(r[0] ?? "").trim()).length} rows from sheet "${sheetName}"`
    );
  }

  console.log(`[Sheets] Total inventory rows fetched: ${allRows.length}`);
  return allRows;
}

// ---------------------------------------------------------------------------
// Inquiry appender (unchanged)
// ---------------------------------------------------------------------------

export async function appendInquiryToGoogleSheet(payload: InquiryInsert): Promise<void> {
  const spreadsheetId = getRequiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const range = process.env.GOOGLE_SHEETS_INQUIRIES_RANGE ?? "Inquiry!A:E";
  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          payload.full_name,
          payload.email,
          payload.message,
          payload.status ?? "new",
        ],
      ],
    },
  });
}
