// مفيش 'use client' هنا
import { AppProviders } from '@/providers/AppProviders';
import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google'
import StoreProvider from '@/lib/store/StoreProvider';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata = {
  title: 'Task Manager',
  description: 'Modern Task Management App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={`${jakarta.className} bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 min-h-screen`}>
        <StoreProvider>
          <AppProviders>
            {children}
          </AppProviders>
        </StoreProvider>
      </body>
    </html>
  );
}