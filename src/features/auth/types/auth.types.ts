/**
 * Auth feature types
 */

export type User = {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly company?: string;
  readonly phone?: string;
};

export type AuthState = {
  readonly token: string | null;
  readonly user: User | null;
  readonly loading: boolean;
  readonly error: string | null;
};

export type LoginCredentials = {
  readonly email: string;
  readonly password: string;
};

export type RegisterData = {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly company?: string;
  readonly phone?: string;
  readonly rememberMe?: boolean;
};

export type AuthResponse = {
  readonly user: User;
  readonly token: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
};

