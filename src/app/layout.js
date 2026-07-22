import './globals.css';
import { AppProvider } from '@/context/app-context';

export const metadata = {
  title: 'SM Connect — Shining Ministries',
  description: 'Digital Ministry Platform for Shining Ministries. Arise, shine, for your light has come.',
  keywords: 'Shining Ministries, SM Connect, church, ministry, contributions, digital platform',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#D4A843',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
