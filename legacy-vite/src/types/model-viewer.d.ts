import type { DetailedHTMLProps, HTMLAttributes } from 'react';

/** Attributes used from <model-viewer> (@google/model-viewer web component). */
export interface ModelViewerAttributes
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLElement> & {
      src?: string;
      alt?: string;
      'loading'?: 'auto' | 'lazy' | 'eager';
      'camera-controls'?: boolean | string;
      'touch-action'?: string;
      'auto-rotate'?: boolean | string;
      'rotation-per-second'?: string;
      'interaction-prompt'?: string;
      'camera-orbit'?: string;
      'min-camera-orbit'?: string;
      'max-camera-orbit'?: string;
      'shadow-intensity'?: string | number;
      'shadow-softness'?: string | number;
      exposure?: string | number;
      'environment-image'?: string;
    },
    HTMLElement
  > {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes;
    }
  }
}

export {};
