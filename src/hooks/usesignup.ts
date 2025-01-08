import { useState, useCallback } from 'react';
import { signUp } from '../services/auth/signup';
import { AUTH_ERROR_CODES } from '../services/auth/errors';
import toast from 'react-hot-toast';

interface SignUpErrors {
  invalid_email?: string;
  invalid_password?: string;
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({});

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    clearErrors();

    try {
      const { error } = await signUp({ email, password });
      
      if (error) {
        switch (error.code) {
          case AUTH_ERROR_CODES.INVALID_EMAIL:
            setErrors({ invalid_email: error.message });
            return false;
          case AUTH_ERROR_CODES.INVALID_PASSWORD:
            setErrors({ invalid_password: error.message });
            return false;
          case AUTH_ERROR_CODES.USER_EXISTS:
            toast.error(error.message);
            return false;
          case AUTH_ERROR_CODES.DATABASE_ERROR:
            toast.error(error.message);
            return false;
          default:
            toast.error('An unexpected error occurred');
            return false;
        }
      }

      toast.success('Account created successfully! You are now signed in.');
      return true;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errors,
    clearErrors,
    handleSignUp,
  };
}