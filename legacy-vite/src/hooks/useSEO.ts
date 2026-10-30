import { useEffect } from 'react';

type SEOProps = {
  title: string;
  description: string;
  /** Canonical path, e.g. "/about". Combined with the current origin. */
  path?: string;
};

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const removeCanonicalAndOgUrl = () => {
  document.head.querySelector('link[rel="canonical"]')?.remove();
  document.head.querySelector('meta[property="og:url"]')?.remove();
};

/**
 * Per-route metadata: title, description, canonical and Open Graph/Twitter tags.
 * Keeps a single set of managed elements — no extra dependencies.
 */
export function useSEO({ title, description, path }: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'Al Karrim Lanka');
    // No site-wide og:image asset exists — use the compact summary card
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    if (path !== undefined) {
      const url = `${window.location.origin}${path}`;
      setMeta('property', 'og:url', url);

      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    } else {
      // Routes without a canonical path (e.g. 404) must not inherit a stale one
      removeCanonicalAndOgUrl();
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, path]);
}
