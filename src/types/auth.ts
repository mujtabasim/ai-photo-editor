import { Session, User } from '@supabase/supabase-js';

export interface AuthProfile {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  subscription: 'free' | 'pro' | 'unlimited' | string | null;
  credits: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
}

export interface AuthResponse<T = any> {
  data: T | null;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<AuthResponse<{ session: Session | null; user: User | null }>>;
  signUp: (email: string, password: string, displayName?: string) => Promise<AuthResponse<{ session: Session | null; user: User | null }>>;
  signOut: () => Promise<AuthResponse<null>>;
  refreshProfile: () => Promise<AuthProfile | null>;
}
