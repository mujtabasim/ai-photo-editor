import { create } from 'zustand';
import { ProjectHistory } from '../types';
import { MOCK_PROJECTS } from '../constants/mockData';

interface HistoryState {
  projects: ProjectHistory[];
  searchQuery: string;
  filterFavoriteOnly: boolean;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (id: string) => void;
  deleteProject: (id: string) => void;
  addProject: (project: ProjectHistory) => void;
  setFilterFavoriteOnly: (status: boolean) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  projects: MOCK_PROJECTS,
  searchQuery: '',
  filterFavoriteOnly: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleFavorite: (id) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      ),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
  },

  addProject: (project) => {
    set((state) => ({
      projects: [project, ...state.projects],
    }));
  },

  setFilterFavoriteOnly: (status) => set({ filterFavoriteOnly: status }),
}));
