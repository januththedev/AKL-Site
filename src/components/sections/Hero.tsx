import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap } from '@/lib/animations';
import { HERO } from '@/data/company';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Lightweight particle field + connection lines. Static under reduced motion. */
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number };
    let points: P[] = [];

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor((width * height) / 22000), 90);
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const LINK_DIST = 120;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Drift
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // Connections
      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.14;
            ctx.strokeStyle = `rgba(78, 221, 146, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Points
      for (const p of points) {
        ctx.fillStyle = 'rgba(154, 163, 171, 0.5)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reducedMotion) {
      draw(); // single static frame
    } else {
      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(canvas);

      let last = 0;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden || now - last < 33) return; // ~30fps is plenty
        last = now;
        draw();
      };
      raf = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener('resize', resize);
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-70"
    />
  );
}

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const blurbRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [blurbIndex, setBlurbIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  /* Cinematic entrance choreography */
  useEffect(() => {
    if (reducedMotion) {
      gsap.set('[data-hero-reveal]', { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
      tl.fromTo('[data-hero-eyebrow]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo(
          '[data-hero-line]',
          { yPercent: 115 },
          { yPercent: 0, duration: 1.05, stagger: 0.12, ease: 'power4.out' },
          '-=0.35',
        )
        .fromTo('[data-hero-blurb]', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
        .fromTo(
          '[data-hero-cta]',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 },
          '-=0.45',
        )
        .fromTo(
          '[data-hero-meta]',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          '-=0.4',
        )
        .to('[data-hero-glow]', { opacity: 1, duration: 1.6, ease: 'power1.inOut' }, '-=1.2');
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  /* Rotating supporting statements */
  useEffect(() => {
    if (reducedMotion || HERO.blurbs.length <= 1) return undefined;
    const id = window.setInterval(() => setBlurbIndex((i) => (i + 1) % HERO.blurbs.length), 4200);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !blurbRef.current) return;
    gsap.fromTo(
      blurbRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
    );
  }, [blurbIndex, reducedMotion]);

  /* Mouse-reactive ambient lighting (desktop pointers only) */
  useEffect(() => {
    if (reducedMotion || window.matchMedia('(hover: none)').matches) return;
    const root = rootRef.current;
    const glow = glowRef.current;
    if (!root || !glow) return;
    let raf = 0;
    let gx = 50;
    let gy = 40;
    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      gx = ((e.clientX - rect.left) / rect.width) * 100;
      gy = ((e.clientY - rect.top) / rect.height) * 100;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          glow.style.setProperty('--gx', `${gx}%`);
          glow.style.setProperty('--gy', `${gy}%`);
        });
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      aria-label="Introduction"
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950"
    >
      {/* Ambient layers */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 42% at 72% 28%, rgba(52,201,120,0.07), transparent 62%), radial-gradient(46% 38% at 18% 76%, rgba(31,164,91,0.05), transparent 60%)',
        }}
      />
      <div
        ref={glowRef}
        data-hero-glow
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            'radial-gradient(420px circle at var(--gx, 68%) var(--gy, 32%), rgba(78, 221, 146, 0.075), transparent 70%)',
        }}
      />
      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(75% 65% at 50% 42%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(75% 65% at 50% 42%, black, transparent)',
        }}
      />
      <HeroCanvas />

      <div className="container-site relative z-10 pb-24 pt-36 sm:pb-28">
        <p data-hero-eyebrow data-hero-reveal style={{ opacity: 0 }} className="eyebrow">
          Government approved · Established 1980
        </p>

        <h1 className="mt-7 font-display text-display-xl font-semibold leading-[0.96] tracking-tight">
          {HERO.headline.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <span data-hero-line className={`block will-change-transform ${i === 1 ? 'text-gradient-accent' : ''}`}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 max-w-xl" data-hero-blurb data-hero-reveal style={{ opacity: 0 }}>
          <p ref={blurbRef} className="text-lg leading-relaxed text-mist-500 sm:text-xl">
            {HERO.blurbs[blurbIndex]}
          </p>
        </div>

        <div className="mt-11 flex flex-wrap items-center gap-4">
          <span data-hero-cta data-hero-reveal style={{ opacity: 0 }}>
            <ButtonLink to="/vacancies">Explore opportunities</ButtonLink>
          </span>
          <span data-hero-cta data-hero-reveal style={{ opacity: 0 }}>
            <ButtonLink to="/contact" variant="ghost">
              Request workforce
            </ButtonLink>
          </span>
        </div>

        <div className="mt-16 flex flex-wrap gap-x-9 gap-y-4 border-t border-white/[0.06] pt-7">
          {['Sri Lankan Government approved', 'ISO 9001:2008 certified', '125,000+ placements'].map(
            (meta) => (
              <p
                key={meta}
                data-hero-meta
                data-hero-reveal
                style={{ opacity: 0 }}
                className="flex items-center gap-2.5 font-display text-xs uppercase tracking-widest text-mist-700"
              >
                <span className="h-1 w-1 rounded-full bg-accent-500" aria-hidden="true" />
                {meta}
              </p>
            ),
          )}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-mist-700 sm:flex"
      >
        <span className="text-[10px] uppercase tracking-widest2">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-pulse-soft" />
      </div>
    </section>
  );
}
