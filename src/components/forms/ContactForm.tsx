import { useState, type FormEvent } from 'react';
import { Mail, Send } from 'lucide-react';
import { CONTACT } from '@/data/site';

type FormData = {
  audience: 'employer' | 'seeker';
  name: string;
  email: string;
  telephone: string;
  message: string;
};

type Errors = Partial<Record<'name' | 'email' | 'telephone' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{5,19}$/;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (data.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(data.email.trim())) errors.email = 'Please enter a valid email address.';
  if (data.telephone.trim() !== '' && !PHONE_RE.test(data.telephone.trim()))
    errors.telephone = 'Please enter a valid telephone number.';
  return errors;
}

/**
 * Inquiry / appointment form. Mirrors the audited site's fields
 * (name, email, telephone, optional message) and composes a prefilled
 * email via the visitor's own mail client — an honest fallback with no
 * fake "sent" state (no backend exists yet; see README → Contact form).
 */
export function ContactForm() {
  const [data, setData] = useState<FormData>({ audience: 'employer', name: '', email: '', telephone: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [composed, setComposed] = useState(false);

  const set = (patch: Partial<FormData>) => setData((d) => ({ ...d, ...patch }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const subject =
      data.audience === 'employer' ? 'Workforce inquiry — website' : 'Job application inquiry — website';

    const bodyLines = [
      `Name: ${data.name.trim()}`,
      `Email: ${data.email.trim()}`,
      `Telephone: ${data.telephone.trim() || '—'}`,
      `I am: ${data.audience === 'employer' ? 'An employer seeking workforce' : 'A job seeker'}`,
      '',
      data.message.trim(),
    ];

    const url = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      bodyLines.join('\n'),
    )}`;

    window.location.href = url;
    setComposed(true);
  };

  const field = (key: keyof Errors) =>
    errors[key] ? (
      <p id={`${key}-error`} role="alert" className="mt-2 text-xs text-red-400">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="card-surface p-7 sm:p-9" aria-label="Book an appointment">
      <h3 className="font-display text-xl font-semibold text-mist-100">Book an appointment</h3>
      <p className="mt-2 text-sm leading-relaxed text-mist-500">
        Tell us about your requirement — we'll get back to you promptly.
      </p>

      {/* Audience selector */}
      <fieldset className="mt-7">
        <legend className="field-label">I am an…</legend>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Inquiry type">
          {(
            [
              { value: 'employer', label: 'Employer' },
              { value: 'seeker', label: 'Job seeker' },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm transition-colors duration-200 ${
                data.audience === opt.value
                  ? 'border-accent-500/60 bg-accent-500/[0.1] text-accent-300'
                  : 'border-white/10 bg-ink-800/60 text-mist-500 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="audience"
                value={opt.value}
                checked={data.audience === opt.value}
                onChange={() => set({ audience: opt.value })}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="field-label">
            Your name <span className="text-accent-400">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            className="field-input"
            value={data.name}
            onChange={(e) => set({ name: e.target.value })}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            required
          />
          {field('name')}
        </div>
        <div>
          <label htmlFor="cf-email" className="field-label">
            Your email <span className="text-accent-400">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            className="field-input"
            value={data.email}
            onChange={(e) => set({ email: e.target.value })}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            required
          />
          {field('email')}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="cf-tel" className="field-label">
          Your telephone
        </label>
        <input
          id="cf-tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="field-input"
          value={data.telephone}
          onChange={(e) => set({ telephone: e.target.value })}
          aria-invalid={Boolean(errors.telephone)}
          aria-describedby={errors.telephone ? 'telephone-error' : undefined}
        />
        {field('telephone')}
      </div>

      <div className="mt-5">
        <label htmlFor="cf-message" className="field-label">
          Your message <span className="text-mist-700">(optional)</span>
        </label>
        <textarea
          id="cf-message"
          rows={4}
          maxLength={2000}
          className="field-input resize-y"
          value={data.message}
          onChange={(e) => set({ message: e.target.value })}
        />
      </div>

      <button type="submit" className="btn-primary mt-7 w-full sm:w-auto">
        Submit inquiry
        <Send className="btn-arrow h-4 w-4" aria-hidden="true" />
      </button>

      {/* Honest submission notice */}
      <p className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-mist-700">
        <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {composed ? (
          <span>
            Your email app should now open with your inquiry pre-filled for {CONTACT.email}. If it didn't, email us
            directly at{' '}
            <a className="text-accent-400 underline-offset-2 hover:underline" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
            .
          </span>
        ) : (
          <span>
            Submitting opens your email app with the inquiry pre-filled for {CONTACT.email}. Nothing is sent until you
            send that email.
          </span>
        )}
      </p>
    </form>
  );
}
