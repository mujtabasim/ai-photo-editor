import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import { ProjectHistory } from '../types';
import { historyApi } from '../services';

interface HistoryState {
  projects: ProjectHistory[];
  loading: boolean;
  searchQuery: string;
  filterFavoriteOnly: boolean;
  fetchProjects: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addProject: (project: ProjectHistory) => void;
  setFilterFavoriteOnly: (status: boolean) => void;
  clearProjects: () => void;
}

const customStorage = {
  getItem: async (name: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(name);
      } catch (e) {
        return null;
      }
    }
    try {
      const SecureStore = require('expo-secure-store');
      return await SecureStore.getItemAsync(name);
    } catch (e) {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(name, value);
      } catch (e) {
        console.warn(`[Storage Quota Warning] Could not setItem '${name}' into localStorage:`, e);
      }
      return;
    }
    try {
      const SecureStore = require('expo-secure-store');
      await SecureStore.setItemAsync(name, value);
    } catch (e) {}
  },
  removeItem: async (name: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(name);
      } catch (e) {}
      return;
    }
    try {
      const SecureStore = require('expo-secure-store');
      await SecureStore.deleteItemAsync(name);
    } catch (e) {}
  },
};

const sanitizeUrl = (url?: string | null): string | null => {
  if (!url) return null;
  // If base64 string is larger than 100KB, avoid dumping megabytes into localStorage
  if (url.startsWith('data:') && url.length > 100000) {
    return null;
  }
  return url;
};

const sanitizeProject = (p: ProjectHistory): ProjectHistory => ({
  ...p,
  processedUrl: sanitizeUrl(p.processedUrl) || (p.originalUrl?.startsWith('data:') ? '' : p.originalUrl),
  thumbnailUrl: sanitizeUrl(p.thumbnailUrl) || (p.originalUrl?.startsWith('data:') ? '' : p.originalUrl),
  originalUrl: sanitizeUrl(p.originalUrl) || '',
});

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      projects: [],
      loading: false,
      searchQuery: '',
      filterFavoriteOnly: false,

      fetchProjects: async () => {
        set({ loading: true });
        try {
          const fetchedProjects = await historyApi.getHistory();
          set({ projects: fetchedProjects || [], loading: false });
        } catch (e) {
          console.warn('[useHistoryStore] Error fetching projects:', e);
          set({ loading: false });
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleFavorite: async (id) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
          ),
        }));
        await historyApi.toggleFavorite(id);
      },

      deleteProject: async (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
        await historyApi.deleteProject(id);
      },

      addProject: (project) => {
        set((state) => {
          const filtered = state.projects.filter((p) => p.id !== project.id);
          return {
            projects: [project, ...filtered],
          };
        });
        historyApi.saveProject(project);
      },

      clearProjects: () => {
        set({ projects: [] });
      },

      setFilterFavoriteOnly: (status) => set({ filterFavoriteOnly: status }),
    }),
    {
      name: 'ai_photo_editor_history_storage',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        projects: (state.projects || []).slice(0, 15).map(sanitizeProject),
      }),
    }
  )
);
