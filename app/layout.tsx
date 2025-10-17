
import './globals.css';
import React from 'react';
import { Providers } from '../store/providers';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dynamic Data Table Manager',
  description: 'Assignment - Dynamic Data Table Manager (Next.js + Redux + MUI)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
