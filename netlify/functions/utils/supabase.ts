import { createClient } from '@supabase/supabase-js';
import { requiredEnvVars } from './env';

export const supabase = createClient(
  requiredEnvVars.SUPABASE_URL,
  requiredEnvVars.SUPABASE_ANON_KEY
);