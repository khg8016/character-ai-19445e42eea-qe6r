import React, { useState, useEffect } from 'react';
import { signIn } from '../../services/auth';
import toast from 'react-hot-toast';

interface SignInFormProps {
  onClose: () => void;
}

export function SignInForm({ onClose }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearErrors = () => setErrors({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    try {
      const { data, error } = await signIn(email.trim(), password);
      
      if (error) {
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
        return;
      }

      if (data) {
        toast.success('Successfully signed in!');
        onClose();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.invalid_email) clearErrors();
          }}
          className={`mt-1 block w-full rounded-md shadow-sm
            ${errors.invalid_email 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
          required
        />
        {errors.invalid_email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.invalid_email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.invalid_password) clearErrors();
          }}
          className={`mt-1 block w-full rounded-md shadow-sm
            ${errors.invalid_password 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
          required
        />
        {errors.invalid_password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.invalid_password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                 shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}