/**
 * Auth feature types
 */

export type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
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
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly password_confirmation: string;
  readonly phone: string;
};

export type AuthResponse = {
  readonly user: User;
  readonly token: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
};

