import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, radii, shadows } from '../../theme/colors';
import { useHaptics } from '../../hooks/useHaptics';

export const FloatingTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { lightImpact } = useHaptics();

  const getIcon = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'index': return isFocused ? '🏠' : '🏠';
      case 'history': return isFocused ? '🕒' : '🕒';
      case 'explore': return isFocused ? '✨' : '✨';
      case 'profile': return isFocused ? '👤' : '👤';
      default: return '📱';
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'index': return 'Home';
      case 'history': return 'History';
      case 'explore': return 'Explore';
      case 'profile': return 'Profile';
      default: return routeName;
    }
  };

  return (
    <View style={styles.floatingContainer}>
      <View style={[styles.glassBar, shadows.lg]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            lightImpact();
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[styles.tabButton, isFocused && styles.tabButtonActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.icon, isFocused && styles.iconActive]}>
                {getIcon(route.name, isFocused)}
              </Text>
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {getLabel(route.name)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  glassBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: radii.full,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  tabButtonActive: {
    backgroundColor: '#EEF2FF',
  },
  icon: {
    fontSize: 18,
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
