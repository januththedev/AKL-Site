import type { ImgHTMLAttributes } from 'react';
import manifest from './image-variants.json';
import { buildSrcSet, type ImageVariants } from './responsive-image';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height' | 'alt'> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Real layout width of the slot, e.g. "(max-width: 900px) 100vw, 50vw". Required: it decides what is downloaded. */
  sizes: string;
  /** True only for the page's actual LCP image: loads eagerly with high fetch priority. Everything else is lazy. */
  priority?: boolean;
};

export function ResponsiveImage({ src, alt, width, height, sizes, priority = false, ...rest }: Props) {
  const srcSet = buildSrcSet(src, manifest as ImageVariants);
  return (
    <img
      {...rest}
      src={src}
      srcSet={srcSet ?? undefined}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
    />
  );
}

/** Preload an image through the same srcset/sizes an <img> will use, so the browser fetches the variant (and reuses it) instead of the original. */
export function primeResponsiveImage(image: HTMLImageElement, src: string, sizes: string) {
  const srcSet = buildSrcSet(src, manifest as ImageVariants);
  if (srcSet) { image.sizes = sizes; image.srcset = srcSet; }
  image.src = src;
}
