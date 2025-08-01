// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import ClientWrapper from '../components/ClientWrapper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export const metadata: Metadata = {
  title: 'My App',
  description: 'NextAuth Example',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}

