export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: number
          order_no: string
          user_email: string
          credits: number
          amount: number
          order_status: number
          created_at: string
          updated_at: string
          expired_at: string
        }
        Insert: {
          order_no: string
          user_email: string
          credits: number
          amount: number
          order_status?: number
          expired_at?: string
        }
        Update: {
          order_status?: number
        }
      }
      video_generations: {
        Row: {
          id: number
          user_email: string
          credits_used: number
          status: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_email: string
          credits_used?: number
          status?: number
        }
        Update: {
          status?: number
        }
      }
    }
  }
}
