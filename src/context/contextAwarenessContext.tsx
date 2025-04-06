'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useContextAwareness } from '@/utils/contextAwareness';

// Interface for the Context
type ContextAwarenessContextType = ReturnType<typeof useContextAwareness>;

// Create the context with default values
const ContextAwarenessContext = createContext<ContextAwarenessContextType | undefined>(undefined);

// Provider component
export function ContextAwarenessProvider({ children }: { children: ReactNode }) {
  const contextAwarenessUtils = useContextAwareness();

  return (
    <ContextAwarenessContext.Provider value={contextAwarenessUtils}>
      {children}
    </ContextAwarenessContext.Provider>
  );
}

// Custom hook to consume the context
export function useContextAwarenessContext() {
  const context = useContext(ContextAwarenessContext);
  if (context === undefined) {
    throw new Error('useContextAwarenessContext must be used within a ContextAwarenessProvider');
  }
  return context;
}