"use server";

import { unstable_cache } from "next/cache";
import { fetchInventoryFromGoogleSheet } from "@/lib/google/sheets";
import type { Inventory } from "@/types/database";

/**
 * Fetches inventory directly from Google Sheets and maps each row to the
 * shared Inventory type that the frontend already expects.
 *
 * The `id` field is set to `sku` since Supabase is no longer in the pipeline.
 * Cache is revalidated every 5 minutes (300s) — same cadence as before.
 */
async function fetchInventoryInternal(): Promise<Inventory[]> {
  const rows = await fetchInventoryFromGoogleSheet();

  return rows.map((row) => ({
    id: row.sku,
    sku: row.sku,
    name: row.name,
    brand: row.brand,
    vintage: row.vintage,
    region: row.region,
    price: row.price,
    stock: row.stock,
    image_url: row.image_url,
    category: row.category,
    metadata: row.metadata,
  }));
}

const getCachedInventory = unstable_cache(fetchInventoryInternal, ["inventory:all"], {
  tags: ["inventory"],
  revalidate: 300,
});

export async function getInventory(): Promise<Inventory[]> {
  return getCachedInventory();
}
