import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

type ButtonLinkProps = {
  to?: string;
  href?: string;
  variant?: 'primary' | 'ghost';
  children: ReactNode;
  className?: string;
  /** Show an external-link glyph instead of the arrow. */
  external?: boolean;
  ariaLabel?: string;
};

/** Shared CTA button with animated arrow. Renders an internal link, external link, or button. */
export function ButtonLink({
  to,
  href,
  variant = 'primary',
  children,
  className = '',
  external = false,
  ariaLabel,
}: ButtonLinkProps) {
  const cls = `btn-${variant} ${className}`;
  const icon = external ? (
    <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
  ) : (
    <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
        {icon}
      </a>
    );
  }

  return (
    <Link to={to ?? '/'} className={cls} aria-label={ariaLabel}>
      {children}
      {icon}
    </Link>
  );
}
