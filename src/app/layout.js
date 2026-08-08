import './globals.css';
import { Inter, Outfit, Lato } from 'next/font/google';
import { AppProvider } from '@/context/app-context';

// Self-hosted via next/font — no runtime network request to Google
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata = {
  title: 'SM Connect',
  description: 'Digital Ministry Platform',
  keywords: 'SM Connect, church, ministry, contributions, digital platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SM Connect',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#D4A843',
};

import GlobalToasts from '@/components/GlobalToasts';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} ${lato.variable}`}>
      <body>
        <AppProvider>
          {children}
          <GlobalToasts />
        </AppProvider>
      </body>
    </html>
  );
}
