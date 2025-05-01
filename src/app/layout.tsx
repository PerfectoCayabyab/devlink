import ClientSessionProvider from '@/components/ClientSessionWrapper';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DevLink',
  description: 'Developer link profile aggregator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
