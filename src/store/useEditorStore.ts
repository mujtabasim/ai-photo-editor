import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import { EditorState, AdjustmentState, ProjectHistory, EditorSnapshot } from '../types';

const defaultAdjustments: AdjustmentState = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0,
  exposure: 0,
  vibrance: 0,
  shadows: 0,
  highlights: 0,
  temperature: 0,
  tint: 0,
};

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
  if (url.startsWith('data:') && url.length > 100000) {
    return null;
  }
  return url;
};

const sanitizeProject = (p: ProjectHistory | null): ProjectHistory | null => {
  if (!p) return null;
  return {
    ...p,
    processedUrl: sanitizeUrl(p.processedUrl) || (p.originalUrl?.startsWith('data:') ? '' : p.originalUrl),
    thumbnailUrl: sanitizeUrl(p.thumbnailUrl) || (p.originalUrl?.startsWith('data:') ? '' : p.originalUrl),
    originalUrl: sanitizeUrl(p.originalUrl) || '',
  };
};

interface EditorStore extends EditorState {
  setProject: (project: ProjectHistory) => void;
  setSelectedImage: (uri: string) => void;
  setActiveTool: (toolId: string | null) => void;
  updateAdjustment: (key: keyof AdjustmentState, value: number) => void;
  resetAdjustments: () => void;
  undo: () => void;
  redo: () => void;
  setZoomScale: (scale: number) => void;
  setProcessing: (isProcessing: boolean, progress?: number) => void;
  clearEditor: () => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      currentProject: null,
      selectedImageUri: null,
      activeTool: null,
      adjustments: defaultAdjustments,
      history: [],
      historyIndex: 0,
      zoomScale: 1,
      isProcessing: false,
      processingProgress: 0,

      setProject: (project) => {
        if (!project) return;
        const uri =
          project.processedUrl ||
          project.processed_url ||
          project.originalUrl ||
          project.original_url ||
          project.thumbnailUrl ||
          project.thumbnail_url ||
          (project as any).storageUrl ||
          (project as any).storage_url ||
          (project as any).imageUri ||
          (project as any).imageUrl ||
          (project as any).url ||
          null;

        const tool = project.toolUsed || (project as any).tool_used || 'Original';
        const snapshot: EditorSnapshot = {
          imageUri: uri,
          adjustments: defaultAdjustments,
          activeTool: tool,
          timestamp: Date.now(),
        };

        set({
          currentProject: project,
          selectedImageUri: uri,
          activeTool: tool,
          adjustments: defaultAdjustments,
          history: [snapshot],
          historyIndex: 0,
        });

        // Dynamically require useHistoryStore to avoid circular dependency
        try {
          const { useHistoryStore } = require('./useHistoryStore');
          useHistoryStore.getState().addProject(project);
        } catch (e) {}
      },

      setSelectedImage: (uri) => {
        const state = get();
        if (state.selectedImageUri === uri) return;
        const snapshot: EditorSnapshot = {
          imageUri: uri,
          adjustments: { ...state.adjustments },
          activeTool: state.activeTool,
          timestamp: Date.now(),
        };
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);
        set({
          selectedImageUri: uri,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      setActiveTool: (toolId) => {
        set({ activeTool: toolId });
      },

      updateAdjustment: (key, value) => {
        const state = get();
        if (state.adjustments[key] === value) return;
        const newAdjustments = { ...state.adjustments, [key]: value };
        const snapshot: EditorSnapshot = {
          imageUri: state.selectedImageUri,
          adjustments: newAdjustments,
          activeTool: state.activeTool,
          timestamp: Date.now(),
        };
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);
        set({
          adjustments: newAdjustments,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      resetAdjustments: () => {
        const state = get();
        const snapshot: EditorSnapshot = {
          imageUri: state.selectedImageUri,
          adjustments: defaultAdjustments,
          activeTool: state.activeTool,
          timestamp: Date.now(),
        };
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);
        set({
          adjustments: defaultAdjustments,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      undo: () => {
        const { historyIndex, history } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const snapshot = history[newIndex];
          set({
            historyIndex: newIndex,
            selectedImageUri: snapshot.imageUri,
            adjustments: { ...snapshot.adjustments },
            activeTool: snapshot.activeTool,
          });
        }
      },

      redo: () => {
        const { historyIndex, history } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const snapshot = history[newIndex];
          set({
            historyIndex: newIndex,
            selectedImageUri: snapshot.imageUri,
            adjustments: { ...snapshot.adjustments },
            activeTool: snapshot.activeTool,
          });
        }
      },

      setZoomScale: (scale) => set({ zoomScale: scale }),

      setProcessing: (isProcessing, progress = 0) => set({ isProcessing, processingProgress: progress }),

      clearEditor: () => {
        const defaultSnapshot: EditorSnapshot = {
          imageUri: null,
          adjustments: defaultAdjustments,
          activeTool: null,
          timestamp: Date.now(),
        };
        set({
          currentProject: null,
          selectedImageUri: null,
          activeTool: null,
          adjustments: defaultAdjustments,
          history: [defaultSnapshot],
          historyIndex: 0,
          zoomScale: 1,
          isProcessing: false,
        });
      },
    }),
    {
      name: 'ai_photo_editor_current_session',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        currentProject: sanitizeProject(state.currentProject),
        selectedImageUri: sanitizeUrl(state.selectedImageUri),
        activeTool: state.activeTool,
        adjustments: state.adjustments,
      }),
    }
  )
);
