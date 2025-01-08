import { supabase } from '../../lib/supabase';
import { validateEmail, validatePassword } from './validation';
import { AuthenticationError, AUTH_ERROR_CODES } from './errors';
import type { AuthResponse, SignUpData } from './types';

export async function signUp({ email, password }: SignUpData): Promise<AuthResponse> {
  try {
    // Validation
    const emailError = validateEmail(email);
    if (emailError) {
      return {
        data: null,
        error: new AuthenticationError(AUTH_ERROR_CODES.INVALID_EMAIL, emailError)
      };
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return {
        data: null,
        error: new AuthenticationError(AUTH_ERROR_CODES.INVALID_PASSWORD, passwordError)
      };
    }

    // Sign up attempt
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          email: email.trim(),
        }
      }
    });

    if (error) {
      switch (error.message) {
        case 'User already registered':
          return {
            data: null,
            error: new AuthenticationError(
              AUTH_ERROR_CODES.USER_EXISTS,
              'An account with this email already exists'
            )
          };
        case 'Database error saving new user':
          return {
            data: null,
            error: new AuthenticationError(
              AUTH_ERROR_CODES.DATABASE_ERROR,
              'Unable to create account. Please try again later'
            )
          };
        default:
          throw error;
      }
    }

    // Auto sign in after successful signup
    if (data?.user) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (signInError) {
        console.error('Auto sign-in error:', signInError);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      data: null,
      error: new AuthenticationError(
        AUTH_ERROR_CODES.UNKNOWN_ERROR,
        'An unexpected error occurred. Please try again later'
      )
    };
  }
}