import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth';
import { useHistoryStore } from '../store/useHistoryStore';
import { AuthContextType, AuthProfile, AuthResponse } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfile = async (currentUser: User, displayName?: string): Promise<AuthProfile | null> => {
    const userProfile = await authService.getOrCreateProfile(currentUser, displayName);
    setProfile(userProfile);
    return userProfile;
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const initialSession = await authService.getCurrentSession();
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            await fetchUserProfile(initialSession.user);
            await useHistoryStore.getState().fetchProjects();
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Error initializing session:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user);
        await useHistoryStore.getState().fetchProjects();
      } else {
        setProfile(null);
        useHistoryStore.getState().clearProjects();
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const res = await authService.signIn(email, password);
    if (res.data?.user) {
      await fetchUserProfile(res.data.user);
      await useHistoryStore.getState().fetchProjects();
    }
    setLoading(false);
    return res;
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    const res = await authService.signUp(email, password, displayName);
    if (res.data?.user) {
      await fetchUserProfile(res.data.user, displayName);
      await useHistoryStore.getState().fetchProjects();
    }
    setLoading(false);
    return res;
  };

  const signOut = async (): Promise<AuthResponse<null>> => {
    setLoading(true);
    const res = await authService.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    useHistoryStore.getState().clearProjects();
    setLoading(false);
    return res;
  };

  const refreshProfile = async (): Promise<AuthProfile | null> => {
    if (!user) return null;
    return await fetchUserProfile(user);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
