import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/AuthContext';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Mrivas Admin',
  description: 'Mrivas Admin backoffice',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
