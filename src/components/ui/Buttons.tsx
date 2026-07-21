import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react.createContext' ? require('react-native') : require('react-native');
import { colors, radii, shadows } from '../../theme/colors';
import { useHaptics } from '../../hooks/useHaptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const { lightImpact } = useHaptics();

  const handlePress = () => {
    lightImpact();
    onPress();
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 38;
      case 'lg': return 54;
      default: return 46;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      onPress={handlePress}
      style={[
        styles.primaryBtn,
        { height: getHeight() },
        disabled && styles.disabledBtn,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.primaryText, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const { lightImpact } = useHaptics();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || isLoading}
      onPress={() => { lightImpact(); onPress(); }}
      style={[
        styles.secondaryBtn,
        disabled && styles.disabledBtn,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.primary} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.secondaryText, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export const GradientButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  isLoading,
  disabled,
  icon,
  style,
  textStyle,
}) => {
  const { mediumImpact } = useHaptics();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || isLoading}
      onPress={() => { mediumImpact(); onPress(); }}
      style={[styles.gradientBtn, shadowStyle.glow, style]}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.primaryText, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export const IconButton: React.FC<{
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}> = ({ icon, onPress, size = 42, backgroundColor = '#F8FAFC', style }) => {
  const { lightImpact } = useHaptics();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => { lightImpact(); onPress(); }}
      style={[
        styles.iconBtn,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
};

export const FloatingActionButton: React.FC<{
  icon: React.ReactNode;
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
}> = ({ icon, onPress, label, style }) => {
  const { mediumImpact } = useHaptics();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => { mediumImpact(); onPress(); }}
      style={[styles.fab, shadowStyle.glow, style]}
    >
      {icon}
      {label && <Text style={styles.fabLabel}>{label}</Text>}
    </TouchableOpacity>
  );
};

const shadowStyle = StyleSheet.create({
  glow: shadows.glow,
});

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
    ...shadows.md,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryBtn: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radii.xl,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  secondaryText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  gradientBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    height: 56,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    zIndex: 100,
  },
  fabLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
