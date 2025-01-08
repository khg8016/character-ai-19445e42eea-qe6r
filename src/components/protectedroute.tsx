import { Navigate, useLocation } from 'react-router-dom';
import { useSupabase } from '../hooks/useSupabase';
import { useEffect, useState } from 'react';
import { isRecoverySession } from '../lib/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { supabase } = useSupabase();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase?.auth.getSession() || {};
      
      // recovery 세션이면 인증되지 않은 것으로 처리
      setIsAuthenticated(!!session && !isRecoverySession(session));
    };

    checkAuth();
  }, [supabase, location]);

  if (isAuthenticated === null) {
    return null; // Loading state
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}