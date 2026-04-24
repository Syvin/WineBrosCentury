import { createServiceSupabaseClient } from "./service";
import crypto from "crypto";

/**
 * Downloads an image from a URL and uploads it to Supabase Storage.
 * @param url The source image URL (Google Drive, Imgur, etc.)
 * @returns The Supabase public URL, or the original URL if failed.
 */
export async function mirrorImageToSupabase(url: string, bucket = "product-images"): Promise<string> {
  if (!url) return url;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (supabaseUrl && url.startsWith(supabaseUrl)) {
    // Already in Supabase
    return url;
  }

  let downloadUrl = url;

  // Convert Google Drive share links to direct download links
  // Handles: /file/d/ID/view, open?id=ID, and uc?id=ID
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    downloadUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }

  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      console.warn(`[Supabase Storage] Failed to download image from ${downloadUrl}: ${response.statusText}`);
      return url;
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize extension (e.g., 'image/webp; charset=utf-8' -> 'webp')
    const rawExt = contentType.split("/")[1] || "jpg";
    const ext = rawExt.split(";")[0].trim();
    
    // Generate a unique filename
    const hash = crypto.createHash("md5").update(buffer).digest("hex");
    const filename = `${hash}.${ext}`;

    const supabase = createServiceSupabaseClient();
    console.log(`[Supabase Storage] Attempting upload: ${filename} (${contentType})`);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error(`[Supabase Storage] Upload error for ${filename}:`, uploadError);
      return url;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filename);
    console.log(`[Supabase Storage] Success: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;

  } catch (error) {
    console.error(`[Supabase Storage] Mirroring error for ${url}:`, error);
    return url;
  }
}
