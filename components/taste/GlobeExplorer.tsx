'use client';
import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Destination } from '../../lib/types';
import { DestinationPicker } from './DestinationPicker';
import { DottedGlobe } from './DottedGlobe';
import { buildNetwork, destinationAt, nodeFor, tourStart } from './destinations';
import { useOnScreen } from './motion';
import { useDestinationTour } from './useDestinationTour';
import './taste-ui.css';

/**
 * The destinations list and the dotted globe, tied together: the globe turns to the chosen destination and draws
 * its route from Colombo, and the card beside it shows that destination's own words. `intro` is the heading and
 * paragraph (rendered on the server) that sit above the list. The globe tours the destinations by itself while it
 * is on screen, until the visitor chooses one or pauses it.
 */
export function GlobeExplorer({ destinations, intro }: { destinations: Destination[]; intro: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const hubs = useMemo(() => buildNetwork(destinations), [destinations]);
  const onScreen = useOnScreen(root, 0.3);
  const [globeReady, setGlobeReady] = useState(false); // the tour starts once the globe is there to follow it
  const tour = useDestinationTour({ count: destinations.length, home: hubs.home, start: tourStart(hubs), active: onScreen && globeReady });
  return (
    <div ref={root} className="tx-gs">
      <div className="tx-gs-copy">
        {intro}
        <DestinationPicker destinations={destinations} selected={tour.selected} onChoose={tour.choose} onHold={tour.setHeld} announce={tour.engaged} />
      </div>
      <DottedGlobe network={hubs.network} focus={nodeFor(hubs, tour.selected)} paused={tour.paused} onTogglePause={tour.togglePause} onReady={setGlobeReady} onPick={node => { const index = destinationAt(hubs, node); if (index >= 0) tour.choose(index); }} onInteract={tour.engage} />
    </div>
  );
}
