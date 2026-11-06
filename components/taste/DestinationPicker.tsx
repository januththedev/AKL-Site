'use client';
import { useEffect, useState } from 'react';
import type { FocusEvent } from 'react';
import { MapPin } from 'lucide-react';
import type { Destination } from '../../lib/types';
import { formatCoords, placeOf } from './destinations';
import './taste-ui.css';

/**
 * The site's destinations as a row of buttons and one card: the card shows the chosen destination's own region,
 * title and description from the content. The buttons only exist once the page has loaded its script, so without
 * script the card alone stands (and the link beside it goes to the full list). While the tour runs by itself the
 * card is not announced; once the visitor chooses, changes are announced politely.
 */
export function DestinationPicker({ destinations, selected, onChoose, onHold, announce }: {
  destinations: readonly Destination[];
  selected: number;
  onChoose: (index: number) => void;
  onHold: (held: boolean) => void;
  announce: boolean;
}) {
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  const current = destinations[selected] ?? destinations[0];
  if (!current) return null;
  const place = placeOf(current);
  const leave = (event: FocusEvent<HTMLDivElement>) => {
    if (!(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))) onHold(false);
  };
  return (
    <div className="tx-dp" onPointerEnter={() => onHold(true)} onPointerLeave={() => onHold(false)} onFocus={() => onHold(true)} onBlur={leave}>
      {enhanced && (
        <div className="tx-dp-chips" role="group" aria-label="Explore our destinations">
          {destinations.map((destination, index) => (
            <button key={destination.slug} type="button" className="tx-dp-chip" aria-pressed={index === selected} onClick={() => onChoose(index)}>
              {destination.title}
            </button>
          ))}
        </div>
      )}
      <div className="tx-dp-detail" aria-live={announce ? 'polite' : 'off'}>
        <div key={current.slug} className="tx-dp-card">
          <span className="eyebrow">{current.region}</span>
          <h3>{current.title}</h3>
          <p>{current.description}</p>
          {place && (
            <p className="tx-dp-place">
              <MapPin aria-hidden="true" />
              <span>
                {place.home ? 'Colombo, where every route starts' : place.city === 'Regional centre' ? 'Pinned at a regional centre' : `Pinned at ${place.city}`}
                {' · '}{formatCoords(place.lat, place.lon)}
                {!place.home && <>{' · '}about {place.km.toLocaleString('en')} km from Colombo</>}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
