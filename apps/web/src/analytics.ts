// Analytics: every event goes to GTM's dataLayer; GTM forwards it to GA4. Set NEXT_PUBLIC_GTM_ID to turn it on.
// Page views are not pushed here: GA4's enhanced measurement records them on every client-side route change.

export const GTM_ID = (process.env.NEXT_PUBLIC_GTM_ID ?? '').trim();

type Events = {
  question_answered: { question_key: string; subject: string; correct: boolean; first_attempt: boolean };
  code_run: { question_id: string; passed: boolean };
  search: { search_term: string; question_key: string };
  session_start: { session_type: 'review' | 'mock'; question_count: number };
  session_end: { session_type: 'review' | 'mock'; question_count: number; answered: number; correct: number };
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// GTM's data model keeps every key ever pushed, so an earlier event's params would ride along on later
// events (a search_term on question_answered). Pushing undefined for keys this event lacks clears them.
const pushedKeys = new Set<string>();

// Owner mode: visit any page with ?owner=1 once and this browser never loads GTM or tracks, so the site owner's
// own visits stay out of the numbers. ?owner=0 turns it off. Set and read by GTM_SCRIPT, before GTM loads.
const OWNER_KEY = 'fe-grind-owner';

function isOwner() {
  try {
    return localStorage.getItem(OWNER_KEY) === '1';
  } catch {
    return false;
  }
}

/** Pushes one event to the dataLayer. A no-op on the server, when GTM is not configured, and in owner mode. */
export function track<E extends keyof Events>(event: E, params: Events[E]) {
  if (typeof window === 'undefined' || !GTM_ID || isOwner()) return;
  const stale = Object.fromEntries([...pushedKeys].filter((k) => !(k in params)).map((k) => [k, undefined]));
  Object.keys(params).forEach((k) => pushedKeys.add(k));
  (window.dataLayer ??= []).push({ event, ...stale, ...params });
}

/** Applies ?owner=1 / ?owner=0, then the standard GTM bootstrap unless this browser is in owner mode. Runs in <head>. */
export const GTM_SCRIPT = `(function(){try{var o=new URLSearchParams(location.search).get('owner'),k=${JSON.stringify(OWNER_KEY)};if(o==='1')localStorage.setItem(k,'1');if(o==='0')localStorage.removeItem(k);if(localStorage.getItem(k)==='1')return}catch(e){}(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)})})();`;
