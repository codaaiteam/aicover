'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { toast } from "sonner";

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

interface ContextProviderProps {
  children: React.ReactNode;
}

interface ContextProviderValue {
  user: User | null | undefined;
  setUser: (user: User | null | undefined) => void;
  setCovers?: (covers: any[]) => void;
}

export const AppContext = createContext({} as ContextProviderValue);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const fetchUserInfo = async function () {
    try {
      const uri = "/api/get-user-info";
      const params = {};

      const resp = await fetch(uri, {
        method: "POST",
        body: JSON.stringify(params),
      });

      if (resp.ok) {
        const res = await resp.json() as ApiResponse<User>;
        if (res.data) {
          setUser(res.data);
          return;
        }
      }

      setUser(null);
    } catch (e) {
      setUser(null);

      console.log("get user info failed: ", e);
      toast.error("get user info failed");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Placeholder for setCovers to maintain compatibility
  const setCovers = () => {
    console.warn("Covers functionality has been removed");
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      setCovers,
    }}>
      {children}
    </AppContext.Provider>
  );
};
