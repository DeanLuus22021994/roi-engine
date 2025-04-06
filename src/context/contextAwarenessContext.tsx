import React, { createContext, useContext, ReactNode } from 'react';
import { useContextAwareness } from '../utils/contextAwareness';

// Create context with default values
const ContextAwarenessContext = createContext<ReturnType<typeof useContextAwareness> | null>(null);

interface ContextAwarenessProviderProps {
  children: ReactNode;
}

/**
 * Context provider for the context awareness system
 * Provides error tracking, performance monitoring, and feature usage analytics
 * throughout the application
 */
export function ContextAwarenessProvider({ children }: ContextAwarenessProviderProps) {
  const contextAwareness = useContextAwareness();
  
  return (
    <ContextAwarenessContext.Provider value={contextAwareness}>
      {children}
    </ContextAwarenessContext.Provider>
  );
}

/**
 * Hook to access the context awareness system from any component
 */
export function useAppContextAwareness() {
  const context = useContext(ContextAwarenessContext);
  
  if (!context) {
    throw new Error('useAppContextAwareness must be used within a ContextAwarenessProvider');
  }
  
  return context;
}