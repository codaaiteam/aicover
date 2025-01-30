export interface User {
  email: string;
  nickname: string;
  avatar_url: string;
  uuid: string;
  created_at?: string;
  credits?: UserCredits;
}

export interface UserCredits {
  one_time_credits: number;
  monthly_credits: number;
  total_credits: number;
  used_credits: number;
  left_credits: number;
}
