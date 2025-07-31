import { createClient } from '@supabase/supabase-js';
import { env } from '../config/environment';

export const supabase = createClient(env.supabase.url, env.supabase.anonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          full_name: string;
          phone: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          full_name: string;
          phone: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          full_name?: string;
          phone?: string;
          role?: string;
          created_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          roll_number: string;
          name: string;
          class: string;
          section: string;
          father_name: string;
          mother_name: string;
          email: string;
          phone: string;
          address: string;
          date_of_birth: string;
          admission_date: string;
          profile_image?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          roll_number: string;
          name: string;
          class: string;
          section: string;
          father_name: string;
          mother_name: string;
          email: string;
          phone: string;
          address: string;
          date_of_birth: string;
          admission_date: string;
          profile_image?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          roll_number?: string;
          name?: string;
          class?: string;
          section?: string;
          father_name?: string;
          mother_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          date_of_birth?: string;
          admission_date?: string;
          profile_image?: string;
          created_at?: string;
        };
      };
      fee_structures: {
        Row: {
          id: string;
          class: string;
          academic_year: string;
          total_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          class: string;
          academic_year: string;
          total_amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          class?: string;
          academic_year?: string;
          total_amount?: number;
          created_at?: string;
        };
      };
      fee_items: {
        Row: {
          id: string;
          fee_structure_id: string;
          name: string;
          amount: number;
          due_date: string;
          mandatory: boolean;
          description?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          fee_structure_id: string;
          name: string;
          amount: number;
          due_date: string;
          mandatory: boolean;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          fee_structure_id?: string;
          name?: string;
          amount?: number;
          due_date?: string;
          mandatory?: boolean;
          description?: string;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          student_id: string;
          total_amount: number;
          paid_amount: number;
          payment_date: string;
          payment_method: string;
          status: string;
          receipt_number: string;
          academic_year: string;
          remarks?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          total_amount: number;
          paid_amount: number;
          payment_date: string;
          payment_method: string;
          status: string;
          receipt_number: string;
          academic_year: string;
          remarks?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          total_amount?: number;
          paid_amount?: number;
          payment_date?: string;
          payment_method?: string;
          status?: string;
          receipt_number?: string;
          academic_year?: string;
          remarks?: string;
          created_at?: string;
        };
      };
      payment_items: {
        Row: {
          id: string;
          payment_id: string;
          fee_item_id: string;
          name: string;
          amount: number;
          paid_amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          fee_item_id: string;
          name: string;
          amount: number;
          paid_amount: number;
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          payment_id?: string;
          fee_item_id?: string;
          name?: string;
          amount?: number;
          paid_amount?: number;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}