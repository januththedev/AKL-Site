import './markup.css';
import type { ReactNode } from 'react';

/** One semantic, server-rendered statement. `accent` continues the same sentence. MotionRoot reveals it as a single phrase. */
export function StoryHeading({ as: Tag = 'h2', heading, accent, id, className }: {
  as?: 'h1' | 'h2'; heading: ReactNode; accent?: string; id?: string; className?: string;
}) {
  return <Tag id={id} className={className} data-story-heading data-story-phrases>
    <span className="story-line"><span className="story-line-ink">{heading}{accent ? ` ${accent}` : null}</span></span>
  </Tag>;
}
