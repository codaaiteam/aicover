import { ReactNode } from "react";
import { User } from "./user";
import { Cover } from "./cover";
import { PendingTask } from "@/contexts/AppContext";

export interface ContextProviderValue {
  user: User | null | undefined;
  fetchUserInfo: () => Promise<void>;
  covers: Cover[] | null;
  setCovers: (covers: Cover[] | null) => void;
  pendingTasks: PendingTask[];
  addPendingTask: (task: PendingTask) => void;
  removePendingTask: (uuid: string) => void;
}

export interface ContextProviderProps {
  children: ReactNode;
}