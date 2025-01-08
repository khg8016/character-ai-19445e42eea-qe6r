export interface AuthError {
  code: string;
  message: string;
}

export interface SignUpData {
  email: string;
  password: string;
}

export interface AuthResponse<T = any> {
  data: T | null;
  error: AuthError | null;
}