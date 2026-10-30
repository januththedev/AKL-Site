import { BriefcaseBusiness, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT } from '@/data/site';

export function MobileActions() {
  return <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-ink-950/95 px-3 pt-2 backdrop-blur-xl sm:hidden" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
    <a href={`tel:${CONTACT.telPrimary}`} className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-xs text-mist-300"><Phone className="h-4 w-4" aria-hidden="true" />Call us</a>
    <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-xs text-mist-300"><MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp</a>
    <Link to="/vacancies" className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl bg-accent-500 text-xs font-medium text-ink-950"><BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />Find a job</Link>
  </nav>;
}
