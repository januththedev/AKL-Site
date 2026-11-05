// Pure helpers for responsive public images (see scripts/build-image-variants.mjs).
// Only /media/<name>.webp files that appear in the manifest get a srcset; anything else
// (admin-supplied URLs, uploads, other folders) is left exactly as the caller wrote it.
export type ImageVariants = Record<string, { width: number; height: number; widths: number[] }>;

export function variantUrl(src: string, width: number): string {
  return src.replace(/^\/media\/([^/]+)\.webp$/, `/media/r/$1-${width}.webp`);
}

/** `srcset` string (smaller variants plus the original at its natural width), or null when no variants exist. */
export function buildSrcSet(src: string, manifest: ImageVariants): string | null {
  const entry = Object.hasOwn(manifest, src) ? manifest[src] : undefined;
  if (!entry || !entry.widths.length) return null;
  return [...entry.widths.map(w => `${variantUrl(src, w)} ${w}w`), `${src} ${entry.width}w`].join(', ');
}
