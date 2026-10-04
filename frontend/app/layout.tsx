import type { Metadata } from 'next';
// Self-hosted font files (no build-time or runtime calls to Google Fonts' CDN):
// Inter for UI/Latin text, Noto Sans (Devanagari + Latin) for Hindi — bundled via npm.
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-600.css';
import '@fontsource/noto-sans/latin-700.css';
import '@fontsource/noto-sans/devanagari-400.css';
import '@fontsource/noto-sans/devanagari-600.css';
import '@fontsource/noto-sans/devanagari-700.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/800.css';
import './globals.css';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: 'IP-SAKTI Sahayak',
  description: 'Evidence-grounded IP and regulatory intelligence copilot for Ayurveda.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
