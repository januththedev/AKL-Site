import { Fragment } from 'react';
import type { ReactNode } from 'react';

/**
 * "Lanka" in the company name, set the way the opening sets it: the serif, italic, slightly tight.
 * Colour follows the text around it (mint on the dark header, footer and dark sections; see globals).
 */
export function Lanka() {
  return <span className="brand-lanka">Lanka</span>;
}

/** Any text that names the company, with "Lanka" in the opening's lettering. Other uses of "Lanka" (Sri Lanka) stay plain. */
export function brandify(text: string): ReactNode {
  if (!text || !/Karrim Lanka/i.test(text)) return text;
  return text.split(/(Karrim Lanka)/i).map((part, index) =>
    /^Karrim Lanka$/i.test(part)
      ? <Fragment key={index}>{part.slice(0, part.length - 5)}<Lanka /></Fragment>
      : part,
  );
}
