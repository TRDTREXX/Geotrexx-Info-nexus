export function getSanityImageDimensions(imageRef?: string): {
  width: number;
  height: number;
  aspectRatio: number;
} {
  const fallback = { width: 1200, height: 800, aspectRatio: 1.5 };
  if (!imageRef) return fallback;

  // Sanity image asset ID pattern: "image-[hash]-[width]x[height]-[extension]"
  const pattern = /-([0-9]+)x([0-9]+)-[a-z0-9]+$/i;
  const match = imageRef.match(pattern);
  if (!match) return fallback;

  const width = parseInt(match[1], 10);
  const height = parseInt(match[2], 10);
  if (isNaN(width) || isNaN(height) || height === 0) return fallback;

  return {
    width,
    height,
    aspectRatio: width / height,
  };
}