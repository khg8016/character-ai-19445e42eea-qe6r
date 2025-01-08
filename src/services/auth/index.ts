import { supabase } from '../lib/supabase';
import { validateEmail, validatePassword } from '../utils/validation';

export class AuthenticationError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export async function signIn(email: string, password: string) {
  try {
    const emailError = validateEmail(email);
    if (emailError) {
      return { data: null, error: new AuthenticationError('invalid_email', emailError) };
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return { data: null, error: new AuthenticationError('invalid_password', passwordError) };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        return {
          data: null,
          error: new AuthenticationError('invalid_credentials', 'Invalid email or password')
        };
      }
      return {
        data: null,
        error: new AuthenticationError('auth_error', error.message)
      };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      data: null,
      error: new AuthenticationError('unknown', 'An unexpected error occurred')
    };
  }
}