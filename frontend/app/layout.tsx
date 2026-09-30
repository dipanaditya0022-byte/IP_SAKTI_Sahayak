import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { DM_Serif_Display } from 'next/font/google';
import './globals.css';

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
});

export const metadata: Metadata = {
  title: 'IP-SAKTI Sahayak — Evidence-Grounded Intelligence',
  description:
    'Evidence-grounded, jurisdiction-aware intelligence copilot for Ayurveda innovation, patent eligibility, Biodiversity ABS, and regulatory pathways.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${dmSerif.variable}`} suppressHydrationWarning>
      <body className="bg-darkbg text-text-main antialiased selection:bg-accent selection:text-white min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
