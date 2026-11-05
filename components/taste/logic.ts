// Pure helpers for the taste components: easing, odometer strips, the pipeline cycle and the pull-back camera.
// No DOM here, so every function can be tested in node.

export const clamp = (value: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, value));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = {
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t: number) => 1 - Math.pow(1 - t, 3),
};
/** How far `p` is between `a` and `b` (0 to 1), eased. */
export const seg = (p: number, a: number, b: number, curve: (t: number) => number = t => t) => curve(clamp((p - a) / (b - a)));

/* ---------- counter: one strip of digits per figure column ---------- */

export type Strip =
  | { kind: 'digit'; target: number; turns: number; col: number; cells: number[] }
  | { kind: 'char'; ch: string };

/**
 * One strip per digit. Each strip starts and ends on the real digit, so the figure reads correctly
 * before, during and after the roll, and without script. Later columns turn more (1 to 4 times round).
 */
export function digitStrips(text: string): Strip[] {
  const out: Strip[] = [];
  let col = 0;
  for (const ch of text) {
    if (/\d/.test(ch)) {
      const target = Number(ch);
      const turns = Math.min(4, 1 + col);
      const cells: number[] = [];
      for (let step = 0; step <= turns * 10; step++) cells.push((target + step) % 10);
      out.push({ kind: 'digit', target, turns, col, cells });
      col++;
    } else out.push({ kind: 'char', ch });
  }
  return out;
}

/* ---------- pipeline: four stages, one runs at a time ---------- */

export type StageStatus = 'done' | 'run' | 'next';
export const STAGE_MS = 2600;
export const PASSED_MS = 2400;

/** `tick` 0 to count-1: that stage runs and the ones before it are done. `tick` = count: everything has passed. */
export function stageStatuses(tick: number, count = 4): StageStatus[] {
  return Array.from({ length: count }, (_, i) => (i < tick ? 'done' : i === tick ? 'run' : 'next'));
}
export const nextTick = (tick: number, count = 4) => (tick >= count ? 0 : tick + 1);
export const holdMs = (tick: number, count = 4) => (tick < count ? STAGE_MS : PASSED_MS);

/* ---------- pull-back: the camera backs away from a full-screen picture ---------- */

export type PullbackGeo = { S0: number; dx: number; dy: number };

/**
 * `S0` is the scale at which the picture fills the stage; (dx, dy) moves its centre from the slot to the
 * stage's centre. The scale is eased in log space (so the pull-back never seems to stop), stays centred
 * while large, then slides into its slot. At p = 0 it fills the stage; at p = 1 it rests in its slot.
 */
export function pullbackAt(p: number, geo: PullbackGeo) {
  const shrink = seg(p, 0, 0.9, ease.inOut);
  const s = Math.exp(lerp(Math.log(geo.S0), 0, shrink));
  const slide = seg(p, 0.5, 0.92, ease.inOut);
  return { s, tx: geo.dx * (1 - slide), ty: geo.dy * (1 - slide) };
}

/** Scroll progress through a held stage: 0 when the section's top reaches the top of the screen, 1 when its end does. */
export function holdProgress(top: number, sectionHeight: number, viewportHeight: number) {
  const run = sectionHeight - viewportHeight;
  return run <= 0 ? 1 : clamp(-top / run);
}
