import { useState, useCallback } from 'react';
import { signIn, signOut, AuthenticationError } from '../services/auth';
import toast from 'react-hot-toast';

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    clearErrors();

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        if (error instanceof AuthenticationError) {
          switch (error.code) {
            case 'invalid_email':
            case 'invalid_password':
              setErrors({ [error.code]: error.message });
              break;
            case 'invalid_credentials':
              toast.error(error.message);
              break;
            default:
              toast.error('An unexpected error occurred');
          }
        } else {
          toast.error('An unexpected error occurred');
        }
        return false;
      }

      toast.success('Successfully signed in!');
      return true;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success('Signed out successfully');
      return true;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errors,
    clearErrors,
    handleSignIn,
    handleSignOut,
  };
}