import { create } from 'zustand';
import { UserProfile } from '../types';
import { MOCK_USER } from '../constants/mockData';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isOnboarded: boolean;
  logout: () => void;
  setOnboarded: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  user: MOCK_USER,
  token: 'mock_jwt_token_2026_photo_ai',
  isLoading: false,
  isOnboarded: true,

  logout: () => {
    // Keep user authenticated for guest/scaffold mode
    set({ isAuthenticated: true, user: MOCK_USER, token: 'mock_jwt_token_2026_photo_ai' });
  },

  setOnboarded: (status: boolean) => set({ isOnboarded: status }),
}));
