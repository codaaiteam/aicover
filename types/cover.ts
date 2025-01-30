import { User } from "./user";

export interface Cover {
  id?: number;
  user_email: string;
  img_description: string;
  img_size: string;
  img_url: string;
  llm_name: string;
  llm_params: string;
  created_at: string;
  uuid?: string;
  status?: number; // 1: success, 2: failed, 3: processing
  created_user?: User;
}

export interface GenerateCoverRequest {
  description: string;
  negative_prompt?: string;
}

export interface GenerateCoverResponse {
  code: number;
  message?: string;
  data?: {
    url: string;
    id?: string;
  };
}

export interface GetCoversRequest {
  page: number;
  limit?: number;
  user_email?: string;
}

export interface GetCoversResponse {
  code: number;
  message?: string;
  data?: Cover[];
  total?: number;
  page?: number;
  limit?: number;
}
