'use client'

import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { createContext, useEffect, useState } from "react";

import { Cover } from "@/types/cover";
import { User } from "@/types/user";
import { toast } from "sonner";

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

export const AppContext = createContext({} as ContextProviderValue);

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [covers, setCovers] = useState<Cover[] | null>(null);

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

  return (
    <AppContext.Provider value={{ user, fetchUserInfo, covers, setCovers }}>
      {children}
    </AppContext.Provider>
  );
};
