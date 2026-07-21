import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { colors, radii, shadows } from '../../theme/colors';
import { PrimaryButton, SecondaryButton } from './Buttons';

export const ProgressIndicator: React.FC<{
  progress: number; // 0 to 100
  label?: string;
}> = ({ progress, label }) => {
  return (
    <View style={styles.progressWrapper}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, progress))}%` }]} />
      </View>
    </View>
  );
};

export const SkeletonLoader: React.FC<{
  width?: number | string;
  height?: number;
  borderRadius?: number;
}> = ({ width = '100%', height = 20, borderRadius = radii.md }) => {
  return (
    <View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius },
      ]}
    />
  );
};

export const LoadingOverlay: React.FC<{
  visible: boolean;
  message?: string;
}> = ({ visible, message = 'AI is working its magic...' }) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={[styles.loadingBox, shadows.lg]}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingMessage}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  icon?: string;
}> = ({ title, description, actionTitle, onAction, icon = '📁' }) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Text style={{ fontSize: 32 }}>{icon}</Text>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      {actionTitle && onAction && (
        <PrimaryButton
          title={actionTitle}
          onPress={onAction}
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );
};

export const ConfirmationModal: React.FC<{
  visible: boolean;
  title: string;
  message: string;
  confirmTitle?: string;
  cancelTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}> = ({
  visible,
  title,
  message,
  confirmTitle = 'Confirm',
  cancelTitle = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={[styles.dialogBox, shadows.lg]}>
          <Text style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.dialogMessage}>{message}</Text>

          <View style={styles.dialogActions}>
            <SecondaryButton
              title={cancelTitle}
              onPress={onCancel}
              style={{ flex: 1 }}
            />
            <PrimaryButton
              title={confirmTitle}
              onPress={onConfirm}
              style={[
                { flex: 1 },
                isDestructive && { backgroundColor: colors.error },
              ]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  progressWrapper: {
    width: '100%',
    marginVertical: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  track: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
  skeleton: {
    backgroundColor: '#E2E8F0',
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['2xl'],
    padding: 24,
    alignItems: 'center',
    width: 260,
    gap: 16,
  },
  loadingMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginVertical: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  dialogBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['2xl'],
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  dialogMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
