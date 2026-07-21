import { Cinzel, Cormorant_Garamond, EB_Garamond } from 'next/font/google';

// The three display faces the "NESR AI Certificates" design uses — loaded via
// next/font/google (self-hosted, no runtime Google Fonts request) same as
// Geist/Geist Mono in the root layout.
const cinzel = Cinzel({
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant-garamond',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

/** Apply to a wrapping element so descendants can reference the CSS vars
 * (e.g. `fontFamily: 'var(--font-cinzel), serif'`). */
export const certificateFontVars = `${cinzel.variable} ${cormorantGaramond.variable} ${ebGaramond.variable}`;
