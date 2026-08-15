"use client";

import { createContext, useContext, useTransition, type ReactNode, type TransitionStartFunction } from "react";

interface FilterTransitionContextValue {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}

const FilterTransitionContext = createContext<FilterTransitionContextValue | null>(null);

export function FilterTransitionProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();

  return (
    <FilterTransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </FilterTransitionContext.Provider>
  );
}

export function useFilterTransition() {
  const context = useContext(FilterTransitionContext);
  if (!context) {
    throw new Error("useFilterTransition must be used within a FilterTransitionProvider.");
  }
  return context;
}
