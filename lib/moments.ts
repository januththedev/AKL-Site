import type { Moment } from './types';
export function introMoments(moments: Moment[]) { return moments.filter(moment => moment.useInIntro).slice(0,8); }

/** Stock is only used when there are no published, intro-enabled Moments photos. */
export function introPhotoSources(moments: Moment[], stock: readonly string[]) {
 const selected = introMoments(moments).map(moment => moment.thumbnail);
 return (selected.length ? selected : stock).slice(0, 6);
}
