import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServiceSupabaseClient();
  
  // Fetch the last 5 items to see their image URLs
  const { data, error } = await supabase
    .from("inventory")
    .select("name, sku, image_url")
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const report = data.map(item => ({
    name: item.name,
    sku: item.sku,
    url: item.image_url,
    isSupabase: item.image_url?.includes("supabase.co"),
    isDrive: item.image_url?.includes("drive.google.com")
  }));

  return NextResponse.json({
    message: "Image URL Diagnostic",
    count: data.length,
    data: report
  });
}
