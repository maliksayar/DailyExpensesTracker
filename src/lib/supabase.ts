import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hipwwlgwguutgygzzdpw.supabase.co';
const supabaseAnonKey = 'sb_publishable_pXNsLARxddFuN_rLDJds1Q_tAtUKwsD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          amount: number;
          category: string;
          date: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          amount: number;
          category: string;
          date: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          amount?: number;
          category?: string;
          date?: string;
          description?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
