import { supabase } from '../lib/supabase';
import { validateEmail, validatePassword } from '../utils/validation';

export class AuthenticationError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export async function signIn(email: string, password: string) {
  const emailError = validateEmail(email);
  if (emailError) {
    return { data: null, error: new AuthenticationError('invalid_email', emailError) };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { data: null, error: new AuthenticationError('invalid_password', passwordError) };
  }

  try {
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
        error: new AuthenticationError('auth_error', 'Unable to sign in. Please try again')
      };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      data: null,
      error: new AuthenticationError('unknown', 'An unexpected error occurred. Please try again later')
    };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: new AuthenticationError('signout_error', 'Unable to sign out. Please try again') };
    }
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      error: new AuthenticationError('unknown', 'An unexpected error occurred. Please try again later')
    };
  }
}

export async function signUp(email: string, password: string) {
  const emailError = validateEmail(email);
  if (emailError) {
    return { data: null, error: new AuthenticationError('invalid_email', emailError) };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { data: null, error: new AuthenticationError('invalid_password', passwordError) };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });

    if (error) {
      switch (error.message) {
        case 'User already registered':
          return {
            data: null,
            error: new AuthenticationError('user_exists', 'An account with this email already exists')
          };
        case 'Database error saving new user':
          return {
            data: null,
            error: new AuthenticationError('database_error', 'Unable to create account. Please try again later')
          };
        default:
          console.error('Signup error:', error);
          return {
            data: null,
            error: new AuthenticationError('signup_error', 'Unable to create account. Please try again')
          };
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      data: null,
      error: new AuthenticationError('unknown', 'An unexpected error occurred. Please try again later')
    };
  }
}