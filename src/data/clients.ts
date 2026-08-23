/**
 * Markets & sectors — strictly limited to claims made on the audited site.
 * Reach statement (About page): "Middle East, Europe, Malaysia, and Australia".
 * Sectors: "hospitality, engineering, transport, and manufacturing".
 *
 * Client logos: the audited site displays ten logo images with no readable
 * brand names and placeholder links. We reuse the authentic images without
 * inventing names or destinations (per project decision — see CONTENT-AUDIT.md).
 */

export const REACH = {
  heading: 'Sri Lankan talent, placed worldwide',
  statement:
    'Since 1980, we have connected skilled and unskilled Sri Lankan talent to international markets including the Middle East, Europe, Malaysia, and Australia.',
} as const;

/** Destinations with a dedicated, verified recruitment process. */
export const FEATURED_DESTINATIONS = [
  { label: 'Saudi Arabia', to: '/recruitment/saudi-arabia' },
  { label: 'United Arab Emirates', to: '/recruitment/united-arab-emirates' },
  { label: 'Kuwait', to: '/recruitment/kuwait' },
] as const;

/** Additional verified market mentions (no dedicated process pages on the audited site). */
export const WIDER_MARKETS = ['Middle East', 'Europe', 'Malaysia', 'Australia'] as const;

export const SECTORS = ['Hospitality', 'Engineering', 'Transport', 'Manufacturing'] as const;

const clientImages = import.meta.glob<{ default: string }>('../assets/clients/*.png', {
  eager: true,
});

export const CLIENT_LOGOS: string[] = Object.values(clientImages)
  .map((mod) => mod.default)
  .sort();
