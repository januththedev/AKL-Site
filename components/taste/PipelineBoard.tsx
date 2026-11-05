'use client';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Check, FileText, MessageSquare, Pause, Play, Plane, Users } from 'lucide-react';
import { holdMs, nextTick, stageStatuses, STAGE_MS } from './logic';
import { useOnScreen, useReducedMotion } from './motion';
import './taste-ui.css';

const STAGES = [
  { id: 'inquiry', name: 'Inquiry', summary: 'Roles, skills and numbers confirmed', Icon: MessageSquare, log: ['Roles, skills and headcount recorded', 'Timing and destination confirmed', 'Requirement shared with the team'] },
  { id: 'selection', name: 'Selection', summary: 'Candidates sourced and screened', Icon: Users, log: ['Candidates sourced for each role', 'Screening and skills verification', 'Trade tests coordinated where needed'] },
  { id: 'processing', name: 'Processing', summary: 'Contracts and documentation', Icon: FileText, log: ['Employment contracts prepared', 'Visa documentation assisted', 'Requirements confirmed for each case'] },
  { id: 'deployment', name: 'Deployment', summary: 'Travel and mobilisation', Icon: Plane, log: ['Travel arrangements coordinated', 'Mobilisation to your site arranged', 'Follow-up after deployment'] },
] as const;

const WORD = { done: 'Done', run: 'In progress', next: 'Next' } as const;

/**
 * An example of one workforce requirement moving through the four recruitment stages: a stage runs, turns done,
 * the next begins, the run passes and starts again. It pauses while pointed at or focused, off screen and by its
 * button. Under reduced motion it holds one picture, partly done. Nothing here is a real client or a real timing.
 */
export function PipelineBoard() {
  const card = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const onScreen = useOnScreen(card, 0.3);
  const [tick, setTick] = useState(2); // the picture it rests on: two stages done, the third running
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [run, setRun] = useState(0);
  const moving = !reduced && onScreen && !paused && !held;

  useEffect(() => {
    if (!moving) return;
    setRun(value => value + 1); // restart the running bar from the start whenever the board starts moving
    const timer = window.setTimeout(() => setTick(value => nextTick(value, STAGES.length)), holdMs(tick, STAGES.length));
    return () => window.clearTimeout(timer);
  }, [moving, tick]);

  const status = stageStatuses(tick, STAGES.length);
  const passed = tick >= STAGES.length;
  const logStage = STAGES[Math.min(tick, STAGES.length - 1)];

  return (
    <div
      ref={card}
      className={`tx-pb${moving ? ' is-moving' : ''}${passed ? ' is-passed' : ''}`}
      role="group"
      aria-label="Example: a workforce requirement moving through four stages"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="tx-pb-head">
        <span className="tx-pb-mark" aria-hidden="true"><Users /></span>
        <span className="tx-pb-title">Workforce requirement</span>
        <i className="tx-pb-slash" aria-hidden="true">/</i>
        <span className="tx-pb-ref">Hospitality team</span>
        <span className="tx-pb-spacer" />
        <span className="tx-pb-chip">{passed ? <><Check aria-hidden="true" />Mobilised</> : <><span className="tx-pb-spin" aria-hidden="true" />In progress</>}</span>
      </div>

      <div className="tx-pb-brief">
        <span className="tx-pb-avatar" aria-hidden="true">ER</span>
        <span className="tx-pb-msg">Culinary teams and guest services, shared by the employer</span>
      </div>

      <ol className="tx-pb-steps">
        {STAGES.map((stage, index) => (
          <li key={stage.id} className={`tx-pb-step is-${status[index]}`} aria-current={status[index] === 'run' ? 'step' : undefined}>
            <span className="tx-pb-ico" aria-hidden="true">{status[index] === 'done' ? <Check /> : <stage.Icon />}</span>
            <span className="tx-pb-nm">{stage.name}</span>
            <span className="tx-pb-cmd">{stage.summary}</span>
            <span className="tx-pb-time">{WORD[status[index]]}</span>
            <span className="tx-pb-bar" aria-hidden="true">
              <i
                key={status[index] === 'run' ? `${tick}-${run}` : status[index]}
                style={status[index] === 'run' ? (reduced ? { transform: 'scaleX(0.6)' } : { animationDuration: `${STAGE_MS}ms`, animationPlayState: moving ? 'running' : 'paused' }) : undefined}
              />
            </span>
          </li>
        ))}
      </ol>

      <div className="tx-pb-log" aria-hidden="true">
        {logStage.log.map((line, index) => (
          <span key={`${logStage.id}-${index}`} className="tx-pb-line" style={{ '--i': index } as CSSProperties}>{line}</span>
        ))}
      </div>

      <div className="tx-pb-foot">
        <p>An example of how a requirement moves. Timing and requirements are confirmed for each case.</p>
        {!reduced && (
          <button type="button" className="tx-pause" aria-pressed={paused} aria-label={paused ? 'Play the example' : 'Pause the example'} onClick={() => setPaused(value => !value)}>
            {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}
