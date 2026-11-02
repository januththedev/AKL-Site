import type { ReactNode } from 'react';

/** Semantic, server-rendered phrases. MotionRoot enhances them without splitting words. */
export function StoryHeading({ as: Tag = 'h2', heading, accent, id, className }: {
  as?: 'h1' | 'h2'; heading: ReactNode; accent?: string; id?: string; className?: string;
}) {
  return <Tag id={id} className={className} data-story-heading data-story-phrases>
    <span className="story-line"><span className="story-line-ink">{heading}</span></span>
    {accent && <>{' '}<span className="story-line"><span className="story-line-ink"><em>{accent}</em></span></span></>}
  </Tag>;
}
