import type { Moment } from './types';
export function introMoments(moments: Moment[]) { return moments.filter(moment => moment.useInIntro).slice(0,8); }
