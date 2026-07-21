import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import AiChat from './components/AiChat';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NESR AI Verse',
  description:
    'NESR AI Verse - beginner AI courses for business and technical teams, with a quiz after every part.',
  icons: {
    icon: '/nesr-logo-circle.png',
  },
};

// Runs before paint so the saved theme is applied with no flash of the wrong mode.
// Defaults to dark mode unless the visitor has explicitly chosen light before.
const themeScript = `(function(){try{var t=localStorage.getItem('aiverse.theme');var d=t?t==='dark':true;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased font-sans bg-[var(--bg)] text-[var(--text)]">
        <Providers>
          {children}
          <AiChat />
        </Providers>
      </body>
    </html>
  );
}
