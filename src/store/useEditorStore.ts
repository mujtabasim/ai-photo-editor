import { create } from 'zustand';
import { EditorState, AdjustmentState, Layer, ProjectHistory } from '../types';

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

const defaultLayers: Layer[] = [
  { id: 'layer_bg', name: 'Background Image', type: 'image', isVisible: true, isLocked: true, opacity: 1 },
  { id: 'layer_ai_mask', name: 'AI Subject Cutout', type: 'ai_mask', isVisible: true, isLocked: false, opacity: 1 },
];

interface EditorStore extends EditorState {
  setProject: (project: ProjectHistory) => void;
  setSelectedImage: (uri: string) => void;
  setActiveTool: (toolId: string | null) => void;
  updateAdjustment: (key: keyof AdjustmentState, value: number) => void;
  resetAdjustments: () => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  undo: () => void;
  redo: () => void;
  setZoomScale: (scale: number) => void;
  setProcessing: (isProcessing: boolean, progress?: number) => void;
  clearEditor: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  currentProject: null,
  selectedImageUri: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
  activeTool: 'bg-remover',
  adjustments: defaultAdjustments,
  layers: defaultLayers,
  history: [{ timestamp: Date.now(), action: 'Original Image Loaded' }],
  historyIndex: 0,
  zoomScale: 1,
  isProcessing: false,
  processingProgress: 0,

  setProject: (project) => {
    set({
      currentProject: project,
      selectedImageUri: project.processedUrl || project.originalUrl,
      activeTool: project.toolUsed,
    });
  },

  setSelectedImage: (uri) => {
    set({ selectedImageUri: uri });
  },

  setActiveTool: (toolId) => {
    set({ activeTool: toolId });
  },

  updateAdjustment: (key, value) => {
    const state = get();
    const newAdjustments = { ...state.adjustments, [key]: value };
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ timestamp: Date.now(), action: `Adjusted ${key} (${value})` });
    
    set({
      adjustments: newAdjustments,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  resetAdjustments: () => {
    set({ adjustments: defaultAdjustments });
  },

  toggleLayerVisibility: (layerId) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, isVisible: !layer.isVisible } : layer
      ),
    }));
  },

  toggleLayerLock: (layerId) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, isLocked: !layer.isLocked } : layer
      ),
    }));
  },

  undo: () => {
    const { historyIndex } = get();
    if (historyIndex > 0) {
      set({ historyIndex: historyIndex - 1 });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({ historyIndex: historyIndex + 1 });
    }
  },

  setZoomScale: (scale) => set({ zoomScale: scale }),

  setProcessing: (isProcessing, progress = 0) => set({ isProcessing, processingProgress: progress }),

  clearEditor: () => {
    set({
      currentProject: null,
      selectedImageUri: null,
      activeTool: null,
      adjustments: defaultAdjustments,
      history: [],
      historyIndex: 0,
      zoomScale: 1,
      isProcessing: false,
    });
  },
}));
