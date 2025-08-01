// app/debug/page.tsx
'use client';
import { useSession } from 'next-auth/react';

export default function DebugPage() {
  const { data: session, status } = useSession();
  return (
    <pre className="text-white bg-black p-4">
      {JSON.stringify({ status, session }, null, 2)}
    </pre>
  );
}
