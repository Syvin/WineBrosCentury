// Shared image cache for preventing re-fetches across components
const imageCache = new Map<string, HTMLImageElement>();

export function getCachedImage(url: string): HTMLImageElement | null {
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }
  return null;
}

export function preloadImage(url: string): HTMLImageElement {
  const cached = getCachedImage(url);
  if (cached) return cached;

  const img = new window.Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  imageCache.set(url, img);
  return img;
}

export function preloadAllImages(urls: string[]): void {
  urls.forEach(url => {
    if (url) preloadImage(url);
  });
}
