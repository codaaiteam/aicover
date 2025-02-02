'use client'

import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { createContext, useEffect, useState } from "react";
import { Cover } from "@/types/cover";
import { User } from "@/types/user";
import { toast } from "sonner";

// 添加 PendingTask 接口
export interface PendingTask {
  uuid: string;
  description: string;
  startTime: number;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

// 扩展 ContextProviderValue 类型
export interface ExtendedContextProviderValue extends ContextProviderValue {
  pendingTasks: PendingTask[];
  addPendingTask: (task: PendingTask) => void;
  removePendingTask: (uuid: string) => void;
}

// 创建 context 并命名为不同的变量
const Context = createContext({} as ExtendedContextProviderValue);
export { Context as AppContext };

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [covers, setCovers] = useState<Cover[] | null>(null);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('pendingVideoTasks');
      if (savedTasks) {
        try {
          setPendingTasks(JSON.parse(savedTasks));
        } catch (e) {
          console.error('Failed to parse saved tasks:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pendingVideoTasks', JSON.stringify(pendingTasks));
    }
  }, [pendingTasks]);

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

  const addPendingTask = (task: PendingTask) => {
    console.log('Adding task:', task);
    setPendingTasks(prev => [...prev, task]);
  };

  const removePendingTask = (uuid: string) => {
    console.log('Removing task:', uuid);
    setPendingTasks(prev => prev.filter(task => task.uuid !== uuid));
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <Context.Provider value={{ 
      user, 
      fetchUserInfo, 
      covers, 
      setCovers,
      pendingTasks,
      addPendingTask,
      removePendingTask
    }}>
      {children}
    </Context.Provider>
  );
};