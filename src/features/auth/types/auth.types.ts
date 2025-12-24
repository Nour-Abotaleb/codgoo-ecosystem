/**
 * Auth feature types
 */

export type Application = {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly type: string;
  readonly is_external: number;
  readonly launch_url: string;
};

export type Subscription = {
  readonly id: number;
  readonly bundle_package_id: number;
  readonly bundle_name: string;
  readonly status: string;
  readonly expires_at: string;
  readonly applications: Application[];
};

export type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly subscriptions?: Subscription[];
};

export type AuthState = {
  readonly token: string | null;
  readonly user: User | null;
  readonly subscriptions: Subscription[] | null;
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
  readonly password_confirmation: string;
  readonly phone: string;
};

export type AuthResponse = {
  readonly user: User;
  readonly token: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly subscriptions?: Subscription[];
};

