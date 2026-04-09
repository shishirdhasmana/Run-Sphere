
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata = {
  title: 'RunSphere | Conquer Your City',
  description: 'A gamified fitness tracking application with territory capture mechanics.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children


}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased text-white bg-[#0a0a0a]`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>);

}