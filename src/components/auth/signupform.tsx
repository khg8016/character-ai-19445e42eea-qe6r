import React, { useState, useEffect } from 'react';
import { useSignup } from '../../hooks/useSignup';

interface SignUpFormProps {
  onClose: () => void;
}

export function SignUpForm({ onClose }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, errors, clearErrors, handleSignUp } = useSignup();

  useEffect(() => {
    return () => clearErrors();
  }, [clearErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSignUp(email.trim(), password);
    if (success) {
      onClose();
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
          className={`mt-1 block w-full rounded-md border ${
            errors.invalid_email 
              ? 'border-red-300 dark:border-red-600' 
              : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
          shadow-sm focus:ring-2 focus:ring-offset-2 ${
            errors.invalid_email
              ? 'focus:border-red-500 focus:ring-red-500'
              : 'focus:border-blue-500 focus:ring-blue-500'
          }`}
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
          className={`mt-1 block w-full rounded-md border ${
            errors.invalid_password 
              ? 'border-red-300 dark:border-red-600' 
              : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
          shadow-sm focus:ring-2 focus:ring-offset-2 ${
            errors.invalid_password
              ? 'focus:border-red-500 focus:ring-red-500'
              : 'focus:border-blue-500 focus:ring-blue-500'
          }`}
          required
          minLength={6}
        />
        {errors.invalid_password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.invalid_password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                 shadow-sm text-sm font-medium text-white bg-coral-500 hover:bg-coral-600 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-500 
                 disabled:opacity-50 dark:focus:ring-offset-gray-800"
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}