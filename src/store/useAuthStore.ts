import { create } from 'zustand';
import { UserProfile } from '../types';
import { MOCK_USER } from '../constants/mockData';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  setOnboarded: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  user: MOCK_USER,
  token: 'mock_jwt_token_2026_photo_ai',
  isLoading: false,
  isOnboarded: true,

  login: async (email: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ isAuthenticated: true, isLoading: false });
  },

  register: async (name: string, email: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    set({ isAuthenticated: true });
  },

  setOnboarded: (status: boolean) => set({ isOnboarded: status }),
}));
