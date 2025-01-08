import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useSupabase() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError('Supabase configuration is missing');
    } else if (!supabase) {
      setError('Supabase client initialization failed');
    } else {
      setError(null);
    }
  }, []);

  return {
    supabase,
    error,
    isConfigured: isSupabaseConfigured()
  };
}