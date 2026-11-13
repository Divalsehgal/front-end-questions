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

/** Pushes one event to the dataLayer. A no-op on the server and when GTM is not configured. */
export function track<E extends keyof Events>(event: E, params: Events[E]) {
  if (typeof window === 'undefined' || !GTM_ID) return;
  (window.dataLayer ??= []).push({ event, ...params });
}

/** The standard GTM bootstrap, run in <head> before anything else pushes. */
export const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});`;
