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
      signatures: {
        Row: {
          id: string
          created_at: string
          petition_id: string
          first_name: string
          last_name: string
          email: string
          timeshare_name: string
          created_date: string
          created_time: string
        }
        Insert: {
          id?: string
          created_at?: string
          petition_id: string
          first_name: string
          last_name: string
          email: string
          timeshare_name: string
          created_date: string
          created_time: string
        }
        Update: {
          id?: string
          created_at?: string
          petition_id?: string
          first_name?: string
          last_name?: string
          email?: string
          timeshare_name?: string
          created_date?: string
          created_time?: string
        }
      }
      signature_metadata: {
        Row: {
          id: string
          created_at: string
          signature_id: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          signature_id: string
          metadata: Json
        }
        Update: {
          id?: string
          created_at?: string
          signature_id?: string
          metadata?: Json
        }
      }
      petitions: {
        Row: {
          id: string
          created_at: string
          title: string
          story: string
          signature_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          story: string
          signature_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          story?: string
          signature_count?: number
        }
      }
    }
  }
} 