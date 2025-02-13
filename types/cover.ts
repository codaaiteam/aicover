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
  uuid: string;
  status: number; 
  created_user?: User;
}

export interface GenerateCoverRequest {
  description: string;
  negative_prompt?: string;
  seed?: number;
  enable_prompt_expansion?: boolean;
}

export interface GenerateCoverResponse {
  uuid: string;
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
