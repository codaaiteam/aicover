"use client";

import React, { createContext, useState, ReactNode } from 'react';

// Define the type for the context value
interface AppContextType {
  // Add any global state or functions you want to share across the app
  // For example:
  // theme: string;
  // setTheme: (theme: string) => void;
}

// Create the context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize your global state here
  // For example:
  // const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
};
