import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let supabaseClient: SupabaseClient | null = null;

const getSupabaseEnv = () => {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY?.trim();

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Server configuration error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in the server environment.',
    );
  }

  return { supabaseUrl, supabaseServiceKey };
};

export const getSupabase = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { supabaseUrl, supabaseServiceKey } = getSupabaseEnv();
  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseClient;
};

const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const client = getSupabase();
    const value = Reflect.get(client as object, property);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export default supabase;
