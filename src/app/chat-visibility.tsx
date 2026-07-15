'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface ChatVisibilityContextValue {
  /** true while a timed quiz session is active — the AI widget hides itself. */
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
}

const ChatVisibilityContext = createContext<ChatVisibilityContextValue | null>(null);

export function ChatVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHiddenState] = useState(false);
  const setHidden = useCallback((h: boolean) => setHiddenState(h), []);
  return (
    <ChatVisibilityContext.Provider value={{ hidden, setHidden }}>
      {children}
    </ChatVisibilityContext.Provider>
  );
}

export function useChatVisibility(): ChatVisibilityContextValue {
  const ctx = useContext(ChatVisibilityContext);
  if (!ctx) throw new Error('useChatVisibility must be used within ChatVisibilityProvider');
  return ctx;
}
