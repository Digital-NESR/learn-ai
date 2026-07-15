'use client';

import { SessionProvider } from 'next-auth/react';
import { ChatVisibilityProvider } from './chat-visibility';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChatVisibilityProvider>{children}</ChatVisibilityProvider>
    </SessionProvider>
  );
}
