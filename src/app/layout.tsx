import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { CartContextProvider } from '@/hooks/CartContextProvider';
import { CurrentUserProvider } from '@/hooks/CurrentUserContextProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'J-Clothes', // Título da página
  description: 'E-Commerce para venda de roupas', // Descrição da página
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <CurrentUserProvider>
          <CartContextProvider>
            <Header />

            <main className="flex flex-col flex-grow">{children}</main>

            <Footer />

            <Toaster />
          </CartContextProvider>
        </CurrentUserProvider>
      </body>
    </html>
  );
}
