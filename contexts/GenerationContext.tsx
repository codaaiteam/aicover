"use client";

import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of your context state
interface GenerationContextType {
  // Add your generation-related state and methods here
  // For example:
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

// Create the context with a default empty object
export const GenerationContext = createContext<GenerationContextType>({
  isGenerating: false,
  setIsGenerating: () => {},
});

// Create a provider component
export const GenerationProvider = ({ children }: { children: ReactNode }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <GenerationContext.Provider value={{ isGenerating, setIsGenerating }}>
      {children}
    </GenerationContext.Provider>
  );
};
