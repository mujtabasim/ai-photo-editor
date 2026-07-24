import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import {
  Scissors, Eraser, Sparkles, ArrowUpSquare, Palette, Wand2,
  UserRound, Smile, Sun, Cloud, FileText, Layers, Copy,
  Maximize, Crop, Filter, EyeOff, ShoppingBag, Paintbrush,
  WandSparkles, ArchiveRestore, Brush, Image as ImageIcon
} from 'lucide-react-native';
import { colors, radii, shadows } from '../../theme/colors';
import { useHaptics } from '../../hooks/useHaptics';

const ICON_MAP: Record<string, React.ElementType> = {
  Scissors,
  Eraser,
  Sparkles,
  ArrowUpSquare,
  Palette,
  Wand2,
  UserRound,
  Smile,
  Sun,
  Cloud,
  FileText,
  Layers,
  Copy,
  Maximize,
  Crop,
  Filter,
  EyeOff,
  ShoppingBag,
  Paintbrush,
  WandSparkles,
  ArchiveRestore,
  Brush,
};

export const getLucideIcon = (name?: string, size = 20, color = colors.primary) => {
  const IconComponent = (name && ICON_MAP[name]) ? ICON_MAP[name] : Sparkles;
  return <IconComponent size={size} color={color} />;
};

export const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  return (
    <View style={[styles.glassContainer, style]}>
      {children}
    </View>
  );
};

export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}> = ({ children, onPress, style }) => {
  const { lightImpact } = useHaptics();

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => {
          lightImpact();
          onPress();
        }}
        style={[styles.card, shadows.sm, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, shadows.sm, style]}>{children}</View>;
};

export const FeatureCard: React.FC<{
  title: string;
  description: string;
  iconName?: string;
  badge?: string;
  onPress: () => void;
  gradientColors?: string[];
  isComingSoon?: boolean;
}> = ({ title, description, iconName, badge, onPress, isComingSoon }) => {
  const { lightImpact } = useHaptics();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => {
        lightImpact();
        onPress();
      }}
      style={[styles.featureCard, shadows.sm]}
    >
      <View style={styles.featureHeader}>
        <View style={styles.iconPlaceholder}>
          {getLucideIcon(iconName, 20, colors.primary)}
        </View>
        {badge && (
          <View style={[styles.badge, isComingSoon && styles.comingSoonBadge]}>
            <Text style={[styles.badgeText, isComingSoon && styles.comingSoonText]}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription} numberOfLines={2}>{description}</Text>
    </TouchableOpacity>
  );
};

export const StatCard: React.FC<{
  label: string;
  value: string;
  subtext?: string;
  icon?: React.ReactNode;
}> = ({ label, value, subtext, icon }) => {
  return (
    <View style={[styles.statCard, shadows.sm]}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtext && <Text style={styles.statSubtext}>{subtext}</Text>}
    </View>
  );
};

export const PlanCard: React.FC<{
  title: string;
  price: string;
  period: string;
  isSelected: boolean;
  isPopular?: boolean;
  onSelect: () => void;
}> = ({ title, price, period, isSelected, isPopular, onSelect }) => {
  const { selection } = useHaptics();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        selection();
        onSelect();
      }}
      style={[
        styles.planCard,
        isSelected && styles.planCardSelected,
        isPopular && !isSelected && styles.planCardPopular,
      ]}
    >
      {isPopular && (
        <View style={styles.popularTag}>
          <Text style={styles.popularTagText}>MOST POPULAR • SAVE 46%</Text>
        </View>
      )}
      <View style={styles.planRow}>
        <View>
          <Text style={styles.planTitle}>{title}</Text>
          <Text style={styles.planPeriod}>{period}</Text>
        </View>
        <Text style={styles.planPrice}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  glassContainer: {
    backgroundColor: colors.glassBackground,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    width: '48%',
    marginBottom: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: radii.xl,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  badge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  comingSoonBadge: {
    backgroundColor: '#FEF3C7',
  },
  comingSoonText: {
    color: '#D97706',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statSubtext: {
    fontSize: 11,
    color: colors.success,
    marginTop: 2,
    fontWeight: '600',
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    borderWidth: 2,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 12,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F5F3FF',
  },
  planCardPopular: {
    borderColor: colors.accent,
  },
  popularTag: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  popularTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  planPeriod: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
});
