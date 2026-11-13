import localFont from 'next/font/local';
import { GTM_ID, GTM_SCRIPT } from '../analytics';
import { SITE_URL } from '../seo';
import { Shell } from './Shell';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fe-grind/ui/styles.css';

// The one web font: Inter, self-hosted and preloaded. packages/ui/src/styles.css pairs it with a metric-matched
// Arial fallback, so swapping it in never moves text.
const inter = localFont({
  src: '../assets/fonts/inter-latin-wght.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: false,
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
  ],
});

// Search Console ownership tag, set from the GOOGLE_SITE_VERIFICATION env var (a repo variable in CI) so
// verifying needs no code change.
const googleVerification = (process.env.GOOGLE_SITE_VERIFICATION ?? '').trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  authors: [{ name: 'Dival Sehgal' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  ...(googleVerification && { verification: { google: googleVerification } }),
};

export const viewport: Viewport = { themeColor: '#0b1020' };

// Apply the saved / system theme before first paint, so prerendered pages don't flash light.
const THEME_SCRIPT = `try {
  var t = localStorage.getItem('grind:theme');
  if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark');
} catch (e) {}`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // The theme script adds "dark" before React hydrates.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {GTM_ID && <script dangerouslySetInnerHTML={{ __html: GTM_SCRIPT }} />}
      </head>
      <body>
        {/* GTM's no-JS fallback; Search Console's GTM ownership check also looks for it. */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <div id="root">
          <Shell>{children}</Shell>
        </div>
      </body>
    </html>
  );
}
