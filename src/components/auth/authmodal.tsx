import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          {isSignIn ? 'Welcome back' : 'Create your account'}
        </h2>

        {isSignIn ? <SignInForm onClose={onClose} /> : <SignUpForm onClose={onClose} />}

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 font-medium"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}