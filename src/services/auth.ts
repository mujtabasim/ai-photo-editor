import { supabase } from '../lib/supabase';
import { AuthProfile, AuthResponse } from '../types/auth';
import { Session, User } from '@supabase/supabase-js';

export const authService = {
  /**
   * Register a new user with Email and Password
   */
  async signUp(
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthResponse<{ session: Session | null; user: User | null }>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          console.warn('[authService] Supabase email rate limit hit during signUp. Trying direct password login...');
          const loginAttempt = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (loginAttempt.data?.session) {
            return { data: loginAttempt.data, error: null };
          }
          return {
            data: null,
            error: new Error('Supabase email rate limit exceeded. If you already created an account, try Signing In with your password.'),
          };
        }
        return { data: null, error: new Error(error.message) };
      }

      return {
        data: {
          session: data.session,
          user: data.user,
        },
        error: null,
      };
    } catch (err: any) {
      return { data: null, error: new Error(err?.message || 'An unexpected error occurred during registration.') };
    }
  },

  /**
   * Log in an existing user with Email and Password
   */
  async signIn(
    email: string,
    password: string
  ): Promise<AuthResponse<{ session: Session | null; user: User | null }>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return {
        data: {
          session: data.session,
          user: data.user,
        },
        error: null,
      };
    } catch (err: any) {
      return { data: null, error: new Error(err?.message || 'An unexpected error occurred during login.') };
    }
  },

  /**
   * Sign out current authenticated user
   */
  async signOut(): Promise<AuthResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { data: null, error: new Error(error.message) };
      }
      return { data: null, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err?.message || 'Failed to sign out.') };
    }
  },

  /**
   * Retrieve current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch {
      return null;
    }
  },

  /**
   * Retrieve current active session
   */
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch {
      return null;
    }
  },

  /**
   * Refresh current authentication session
   */
  async refreshSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.refreshSession();
      return session;
    } catch {
      return null;
    }
  },

  /**
   * Automatically fetch or create a profile in 'profiles' table using user auth.uid()
   */
  async getOrCreateProfile(user: User, displayName?: string): Promise<AuthProfile | null> {
    if (!user?.id) return null;
    try {
      console.log(`[Profile] Fetching profile for user_id: ${user.id}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.warn(`[Profile Notice] Query issue for user_id ${user.id}:`, error.message);
      }

      if (data) {
        console.log(`[Profile] Profile loaded successfully for user_id: ${user.id}`);
        return data as AuthProfile;
      }

      console.log(`[Profile] Profile does not exist. Creating new profile for user_id: ${user.id}, email: ${user.email}`);
      const nameToUse = displayName || user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
      const newProfile: AuthProfile = {
        id: user.id,
        display_name: nameToUse,
        username: null,
        avatar_url: user.user_metadata?.avatar_url || null,
        subscription: 'free',
        credits: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: createdData, error: createError } = await supabase
        .from('profiles')
        .upsert(newProfile)
        .select()
        .single();

      if (createError) {
        console.error(`[Profile Error] Failed to create profile for user_id: ${user.id}:`, createError.message);
        return newProfile as AuthProfile;
      }

      console.log(`[Profile] Profile created successfully for user_id: ${user.id}`);
      return createdData as AuthProfile;
    } catch (err: any) {
      console.error(`[Profile Error] Exception in getOrCreateProfile for user_id ${user?.id}:`, err?.message || err);
      return {
        id: user.id,
        display_name: displayName || user.email?.split('@')[0] || 'User',
        username: null,
        avatar_url: null,
        subscription: 'free',
        credits: 50,
      };
    }
  },

  /**
   * Fetch profile record for authenticated user ID from 'profiles' table
   */
  async getProfile(userId: string): Promise<AuthProfile | null> {
    try {
      const user = await this.getCurrentUser();
      if (user && user.id === userId) {
        return await this.getOrCreateProfile(user);
      }

      console.log(`[Profile] Fetching profile for user_id: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn(`[Profile Notice] Query issue for user ${userId}:`, error.message);
      }

      if (data) {
        console.log(`[Profile] Profile loaded successfully for user_id: ${userId}`);
        return data as AuthProfile;
      }
      return null;
    } catch (err: any) {
      console.error(`[Profile Error] Error fetching profile for user_id ${userId}:`, err);
      return null;
    }
  },
};
