import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthInput } from '../components/form/AuthInput';
import { AuthButton } from '../components/form/AuthButton';
import { AuthMessage } from '../components/form/AuthMessage';
import { useSupabase } from '../hooks/useSupabase';
import { MissingSupabaseConfig } from '../components/MissingSupabaseConfig';

export function ForgotPassword() {
  const { supabase, isConfigured } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  if (!isConfigured || !supabase) {
    return <MissingSupabaseConfig />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError('비밀번호 재설정 이메일을 보내는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="이메일을 확인해주세요"
        subtitle="비밀번호 재설정 안내를 보냈습니다"
      >
        <div className="mt-8">
          <AuthMessage type="success">
            <strong>{email}</strong>로 비밀번호 재설정 안내를 보냈습니다.
            이메일을 확인하고 안내에 따라 비밀번호를 재설정해주세요.
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
      title="비밀번호 재설정"
      subtitle="비밀번호 재설정 안내를 받을 이메일을 입력하세요"
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
        </div>

        <div className="text-sm">
          <Link 
            to="/login" 
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            로그인으로 돌아가기
          </Link>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          재설정 안내 보내기
        </AuthButton>
      </form>
    </AuthLayout>
  );
}