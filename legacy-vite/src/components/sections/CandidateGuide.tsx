import { useState } from 'react';
import { CheckCircle2, ClipboardList } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { CONTACT, VACANCIES_PORTAL } from '@/data/site';

const CHECKLIST = [
  'Update your CV with your latest experience and contact details.',
  'Check your passport validity and prepare relevant qualifications.',
  'Read the role, destination and closing date on the official portal.',
  'Confirm interview arrangements and required documents with our team.',
];
const FAQS = [
  { question: 'How do I apply for an overseas vacancy?', answer: 'Choose a role and open the official Al Karrim Lanka recruitment portal. Review the full requirements there before submitting your application. Applications are handled by IntellixHR.' },
  { question: 'Are the notices on this website always available?', answer: 'These are dated highlights, not a live feed. Availability can change before a closing date. Check the official portal or contact our team for the latest details.' },
  { question: 'What should I bring to an interview?', answer: 'Requirements depend on the role and destination. Use the preparation checklist as a starting point, then confirm the documents, location and appointment with our team before travelling.' },
  { question: 'Can I get help in Sinhala or Tamil?', answer: 'The recruitment portal offers English, Sinhala and Tamil. Contact our team if you need help finding a role or understanding the application process.' },
];

export function CandidateGuide() {
  const [checked, setChecked] = useState<string[]>([]);
  return (
    <section aria-labelledby="candidate-guide" className="border-t border-white/10 py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Your next step, made clearer</p>
          <h2 id="candidate-guide" className="mt-4 font-display text-heading font-semibold">Get ready to apply.</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-mist-500">A little preparation goes a long way. This checklist is a guide; each vacancy has its own requirements.</p>
          <div className="card-surface mt-8 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="flex items-center gap-3 font-display text-lg"><ClipboardList className="h-5 w-5 text-accent-400" aria-hidden="true" /> Before you apply</h3>
              <span className="text-sm text-accent-400" role="status">{checked.length}/{CHECKLIST.length} ready</span>
            </div>
            <div className="mt-6 space-y-4">
              {CHECKLIST.map(item => <label key={item} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-mist-300">
                <input type="checkbox" checked={checked.includes(item)} onChange={e => setChecked(previous => e.target.checked ? [...previous, item] : previous.filter(value => value !== item))} className="mt-1 h-5 w-5 shrink-0 accent-accent-500" />{item}
              </label>)}
            </div>
            <p className="mt-6 text-xs text-mist-500">For your reference only. Nothing is submitted or saved.</p>
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Questions before you go?</h2>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {FAQS.map(faq => <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer py-1 pr-3 font-medium text-mist-100 marker:text-accent-400">{faq.question}</summary>
              <p className="mt-4 text-sm leading-relaxed text-mist-500">{faq.answer}</p>
            </details>)}
          </div>
          <div className="mt-8 flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent-400" aria-hidden="true" />
            <div><h3 className="font-medium">Already applied?</h3><p className="mt-2 text-sm text-mist-500">Continue on the portal to check your application.</p></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={VACANCIES_PORTAL.statusHref} external variant="ghost">Application status</ButtonLink>
            <ButtonLink href={CONTACT.whatsappHref} external variant="ghost">Ask on WhatsApp</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
