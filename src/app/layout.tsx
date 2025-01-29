import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import SupabaseProvider from '@/components/providers/SupabaseProvider';
import { OnlineStatusProvider } from '@/contexts/OnlineStatusContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ScrapeNexus',
  description: 'Your AI-powered job scraping platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <AuthProvider>
            <OnlineStatusProvider>
              {children}
            </OnlineStatusProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}