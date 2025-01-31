"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface GenerationState {
  generating: boolean;
  progress: number;
  status: string;
  error: string;
  prompt: string;
}

interface GenerationContextType {
  state: GenerationState;
  setGenerating: (generating: boolean) => void;
  setProgress: (progress: number) => void;
  setStatus: (status: string) => void;
  setError: (error: string) => void;
  setPrompt: (prompt: string) => void;
  resetState: () => void;
}

const initialState: GenerationState = {
  generating: false,
  progress: 0,
  status: "",
  error: "",
  prompt: "",
};

const GenerationContext = createContext<GenerationContextType | null>(null);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GenerationState>(initialState);

  const setGenerating = (generating: boolean) =>
    setState((prev) => ({ ...prev, generating }));

  const setProgress = (progress: number) =>
    setState((prev) => ({ ...prev, progress }));

  const setStatus = (status: string) =>
    setState((prev) => ({ ...prev, status }));

  const setError = (error: string) =>
    setState((prev) => ({ ...prev, error }));

  const setPrompt = (prompt: string) =>
    setState((prev) => ({ ...prev, prompt }));

  const resetState = () => setState(initialState);

  return (
    <GenerationContext.Provider
      value={{
        state,
        setGenerating,
        setProgress,
        setStatus,
        setError,
        setPrompt,
        resetState,
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
}

export function useGeneration() {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error("useGeneration must be used within a GenerationProvider");
  }
  return context;
}
