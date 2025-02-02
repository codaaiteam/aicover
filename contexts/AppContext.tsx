'use client'

import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { createContext, useEffect, useState } from "react";
import { Cover } from "@/types/cover";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export interface PendingTask {
  uuid: string;
  description: string;
  startTime: number;
}

export interface ExtendedContextProviderValue extends ContextProviderValue {
  pendingTasks: PendingTask[];
  addPendingTask: (task: PendingTask) => void;
  removePendingTask: (uuid: string) => void;
}

const Context = createContext({} as ExtendedContextProviderValue);
export { Context as AppContext };

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const { user: clerkUser, isLoaded } = useUser();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [covers, setCovers] = useState<Cover[] | null>(null);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);

  // 只使用 Clerk 用户信息
  useEffect(() => {
    if (isLoaded) {
      if (clerkUser) {
        console.log('Setting user from Clerk:', clerkUser);
        const userInfo: User = {
          email: clerkUser.emailAddresses[0].emailAddress,
          nickname: clerkUser.firstName || "",
          avatar_url: clerkUser.imageUrl,
          uuid: clerkUser.id,
        };
        setUser(userInfo);
      } else {
        setUser(null);
      }
    }
  }, [clerkUser, isLoaded]);

  // 加载保存的任务
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

  // 保存任务到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pendingVideoTasks', JSON.stringify(pendingTasks));
    }
  }, [pendingTasks]);

  const addPendingTask = (task: PendingTask) => {
    console.log('Adding task:', task);
    setPendingTasks(prev => [...prev, task]);
  };

  const removePendingTask = (uuid: string) => {
    console.log('Removing task:', uuid);
    setPendingTasks(prev => prev.filter(task => task.uuid !== uuid));
  };

  return (
    <Context.Provider value={{
      user,
      fetchUserInfo: () => {}, // 不再需要这个函数，但为了兼容性保留空函数
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