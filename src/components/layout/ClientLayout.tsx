// src/components/layout/ClientLayout.tsx
'use client';

import { ReactNode } from 'react';
import SessionWrapper from '../SessionWrapper';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionWrapper>
      <Header />
      {children}
      <Footer />
    </SessionWrapper>
  );
}
