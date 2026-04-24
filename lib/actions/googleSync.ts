import { revalidateTag } from "next/cache";
import { fetchInventoryFromGoogleSheet } from "@/lib/google/sheets";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { mirrorImageToSupabase } from "@/lib/supabase/storage";

export async function syncInventoryFromGoogleSheet(): Promise<number> {
  const supabase = createServiceSupabaseClient();
  const inventoryRows = await fetchInventoryFromGoogleSheet();

  if (inventoryRows.length === 0) {
    return 0;
  }

  // DE-DUPLICATION SAFETY NET: 
  // Ensure no duplicate SKUs are sent to Supabase in the same batch.
  const uniqueRowsMap = new Map<string, any>();
  inventoryRows.forEach(row => uniqueRowsMap.set(row.sku, row));
  let uniqueRows = Array.from(uniqueRowsMap.values());

  // IMAGE MIRRORING PIPELINE:
  // Iterate through rows and convert external image URLs (like Google Drive) to Supabase CDN URLs.
  // We use Promise.all to download and upload them in parallel for speed.
  uniqueRows = await Promise.all(uniqueRows.map(async (row) => {
    if (row.image_url) {
      try {
        row.image_url = await mirrorImageToSupabase(row.image_url);
      } catch (e) {
        console.error(`Failed to mirror image for SKU ${row.sku}:`, e);
      }
    }
    return row;
  }));

  const { error } = await supabase.from("inventory").upsert(uniqueRows, {
    onConflict: "sku",
    ignoreDuplicates: false,
  });

  if (error) {
    throw error;
  }

  revalidateTag("inventory", "default");

  return uniqueRows.length;
}
