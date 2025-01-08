import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthInput } from '../components/form/AuthInput';
import { AuthButton } from '../components/form/AuthButton';
import { AuthMessage } from '../components/form/AuthMessage';
import { useSupabase } from '../hooks/useSupabase';
import { MissingSupabaseConfig } from '../components/MissingSupabaseConfig';

export function Register() {
  const { supabase, isConfigured } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isConfigured || !supabase) {
    return <MissingSupabaseConfig />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`
        }
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError('계정 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="이메일을 확인해주세요"
        subtitle="계정 인증을 위해 이메일을 확인해주세요"
      >
        <div className="mt-8">
          <AuthMessage type="success">
            <strong>{email}</strong>로 인증 이메일을 보냈습니다.
            이메일을 확인하고 인증 링크를 클릭해주세요.
          </AuthMessage>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              ← 로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="회원가입"
      subtitle="새 계정 만들기"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <AuthMessage type="error">{error}</AuthMessage>}
        
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
          <AuthInput
            label="비밀번호 확인"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="text-sm">
          <Link 
            to="/login" 
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            이미 계정이 있으신가요?
          </Link>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          계정 만들기
        </AuthButton>
      </form>
    </AuthLayout>
  );
}