import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthInput } from '../components/form/AuthInput';
import { AuthButton } from '../components/form/AuthButton';
import { AuthMessage } from '../components/form/AuthMessage';
import { useSupabase } from '../hooks/useSupabase';
import { MissingSupabaseConfig } from '../components/MissingSupabaseConfig';

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { supabase, isConfigured } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccess('이메일이 성공적으로 인증되었습니다. 로그인해주세요.');
    }
    
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [searchParams, location]);

  if (!isConfigured || !supabase) {
    return <MissingSupabaseConfig />;
  }

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`
        }
      });
      
      if (error) throw error;
      setSuccess('인증 이메일을 다시 보냈습니다. 이메일을 확인해주세요.');
      setShowVerificationMessage(false);
    } catch (err) {
      setError('인증 이메일을 보내는데 실패했습니다.');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setShowVerificationMessage(false);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      if (user) {
        const isEmailVerified = user.email_confirmed_at != null;
        
        if (!isEmailVerified) {
          await supabase.auth.signOut();
          setShowVerificationMessage(true);
          setIsLoading(false);
          return;
        }
        
        navigate('/');
      }
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="로그인"
      subtitle="계정에 로그인하세요"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <AuthMessage type="error">{error}</AuthMessage>}
        {success && <AuthMessage type="success">{success}</AuthMessage>}
        {showVerificationMessage && (
          <AuthMessage type="warning">
            <p>이메일 인증이 필요합니다. 이메일을 확인해주세요.</p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingEmail}
              className="mt-2 text-sm font-medium text-yellow-200 hover:text-yellow-100 focus:outline-none"
            >
              {resendingEmail ? '전송 중...' : '인증 이메일 다시 보내기'}
            </button>
          </AuthMessage>
        )}

        <div className="space-y-4">
          <AuthInput
            label="이메일"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
          <AuthInput
            label="비밀번호"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <Link 
            to="/register" 
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            계정이 없으신가요?
          </Link>
          <Link 
            to="/forgot-password" 
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          로그인
        </AuthButton>
      </form>
    </AuthLayout>
  );
}