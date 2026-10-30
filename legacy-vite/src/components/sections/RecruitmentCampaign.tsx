import { ArrowUpRight } from 'lucide-react';
import { SOCIALS } from '@/data/site';

const SOURCE = 'https://www.facebook.com/photo.php?fbid=1737986118332367&set=pb.100063629857113.-2207520000&type=3';

/** An archived campaign, not a live vacancy or a photograph of our workplace. */
export function RecruitmentCampaign() {
  return <section aria-labelledby="campaign-heading" className="border-y border-white/10 bg-ink-900 py-16 sm:py-24">
    <div className="container-site grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
      <div>
        <p className="eyebrow">From our Facebook page</p>
        <h2 id="campaign-heading" className="mt-5 font-display text-heading font-semibold">Recruitment updates.<br /><span className="text-gradient-accent">Straight from our team.</span></h2>
        <p className="mt-6 max-w-lg leading-relaxed text-mist-500">Follow our official page for recruitment announcements and interview notices. Check dates and confirm arrangements with our team before you travel.</p>
        <div className="mt-8 border-l-2 border-accent-500 pl-5">
          <p className="text-xs uppercase tracking-widest text-accent-400">October 2026 campaign archive</p>
          <h3 className="mt-3 font-display text-xl font-semibold">Heavy vehicle drivers · Oman</h3>
          <p className="mt-3 text-sm leading-relaxed text-mist-500">Published <time dateTime="2026-10-27">27 October 2026</time>. The poster advertised a trade test on <time dateTime="2026-10-30">30 October 2026</time>. This is a record of that campaign; it does not confirm current availability or terms.</p>
        </div>
        <a href={SOCIALS[0].href} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-8">Visit our official Facebook<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
      </div>
      <figure className="mx-auto w-full max-w-lg">
        <a href={SOURCE} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl border border-white/15 transition-colors hover:border-accent-400" aria-label="Read the original Oman driver campaign on Facebook">
          <img src="/images/campaigns/oman-driver-october-2026.webp" width={1080} height={1080} loading="lazy" decoding="async" alt="Al Karrim Lanka recruitment poster for heavy vehicle drivers in Oman's oil and gas logistics sector, with a trade test dated 30 October 2026." className="h-auto w-full" />
        </a>
        <figcaption className="mt-4 flex items-center justify-between gap-4 text-xs text-mist-500"><span>Official recruitment poster · 27 Oct 2026</span><a href={SOURCE} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-accent-400">View original<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></a></figcaption>
      </figure>
    </div>
  </section>;
}
