import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useSupabase } from '../hooks/useSupabase';
import { MissingSupabaseConfig } from '../components/MissingSupabaseConfig';
import { log } from '../lib/supabase';
import { setSessionType, SESSION_TYPES, clearSessionType } from '../lib/auth';

export function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { supabase, isConfigured } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const hasCheckedParams = useRef(false);

  useEffect(() => {
    // 파라미터 체크를 한 번만 수행
    if (hasCheckedParams.current) {
      return;
    }
    
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');
    
    log('URL parameters:', { type, hasAccessToken: !!accessToken });

    // recovery 타입이 아니거나 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!accessToken || type !== 'recovery') {
      log('Invalid reset password parameters, redirecting to login');
      // navigate('/login');
      return;
    }
    hasCheckedParams.current = true;

    // 비밀번호 재설정용 임시 세션 설정
    if (supabase) {
      setSessionType(SESSION_TYPES.RECOVERY);
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get('refresh_token') || '',
      }).then(({ error }) => {
        if (error) {
          log('Error setting session:', error);
          clearSessionType();
          navigate('/login');
        }
      });
    }


    // 컴포넌트 언마운트 시 세션 타입 초기화
    return () => {
      clearSessionType();
    };
  }, [location, navigate, supabase]);

  if (!isConfigured || !supabase) {
    return <MissingSupabaseConfig />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    log('Attempting password reset');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      log('Password updated successfully');
      
      // 비밀번호 변경 후 세션 정리
      clearSessionType();
      await supabase.auth.signOut();
      
      // 로그인 페이지로 리다이렉트
      navigate('/login', { 
        state: { message: '비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요.' }
      });
    } catch (err) {
      log('Password reset error:', err);
      setError('비밀번호 재설정 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="새 비밀번호 설정"
      subtitle="새로운 비밀번호를 입력해주세요"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          <Input
            label="새 비밀번호"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="새 비밀번호 확인"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button type="submit" isLoading={isLoading}>
          비밀번호 변경
        </Button>
      </form>
    </AuthLayout>
  );
}