import { create } from 'zustand';
import { AppSettings } from '../types';

interface SettingsState {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  autoSaveToGallery: true,
  highQualityExport: true,
  notificationsEnabled: true,
  hapticsEnabled: true,
  language: 'English (US)',
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,

  updateSetting: (key, value) => {
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    }));
  },

  resetSettings: () => set({ settings: defaultSettings }),
}));
