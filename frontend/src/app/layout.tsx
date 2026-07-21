import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import Providers from '@/components/Providers';
import ManualButton from '@/components/manual/ManualButton';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Clínica X',
  description: 'Sistema integral de gestión clínica',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans">
        <Providers>
          {children}
          <ManualButton />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
