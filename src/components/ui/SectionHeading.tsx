import type { ReactNode } from 'react';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <ScrollReveal
      className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''} ${className}`}
      y={28}
    >
      {eyebrow ? (
        <p className={`eyebrow ${centered ? 'justify-center [&::before]:hidden' : ''}`}>{eyebrow}</p>
      ) : null}
      <h2 className="mt-4 font-display text-display font-semibold leading-[1.05] tracking-tight text-mist-100">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-mist-500 sm:text-lg">{description}</p>
      ) : null}
    </ScrollReveal>
  );
}
