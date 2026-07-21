import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../store/useSettingsStore';

export function useHaptics() {
  const hapticsEnabled = useSettingsStore((s) => s.settings.hapticsEnabled);

  const lightImpact = useCallback(() => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, [hapticsEnabled]);

  const mediumImpact = useCallback(() => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  }, [hapticsEnabled]);

  const heavyImpact = useCallback(() => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    }
  }, [hapticsEnabled]);

  const selection = useCallback(() => {
    if (hapticsEnabled) {
      Haptics.selectionAsync().catch(() => {});
    }
  }, [hapticsEnabled]);

  const notificationSuccess = useCallback(() => {
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [hapticsEnabled]);

  return { lightImpact, mediumImpact, heavyImpact, selection, notificationSuccess };
}
