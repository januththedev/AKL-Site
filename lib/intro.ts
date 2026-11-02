/** Session key for the opening. Bump the version to show a redesigned opening once more. */
export const INTRO_KEY = 'akl:intro:v6';

/**
 * Render-blocking decision run in <head> before first paint (homepage only).
 * Sets html[data-intro="pending"], which raises a black cover immediately so the page
 * never flashes before the opening. CSS removes the cover after 4 s if JavaScript never runs.
 */
export const INTRO_BOOT_SCRIPT = `(function(){try{if(location.pathname!=='/')return;var d=document.documentElement;if(sessionStorage.getItem('${INTRO_KEY}')==='seen')return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var c=navigator.connection;if(c&&(c.saveData||/(^|-)2g/.test(c.effectiveType||'')))return;if(/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|linkedinbot|embedly|preview/i.test(navigator.userAgent))return;d.setAttribute('data-intro','pending');}catch(e){}})();`;
