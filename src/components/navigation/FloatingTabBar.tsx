import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Clock, Sparkles, User, Image as ImageIcon } from 'lucide-react-native';
import { colors, radii, shadows } from '../../theme/colors';
import { useHaptics } from '../../hooks/useHaptics';

export const FloatingTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { lightImpact } = useHaptics();

  const renderIcon = (routeName: string, isFocused: boolean) => {
    const iconColor = isFocused ? '#FFFFFF' : '#6B7280';
    const iconSize = 20;

    switch (routeName) {
      case 'index':
        return <Home size={iconSize} color={iconColor} />;
      case 'history':
        return <Clock size={iconSize} color={iconColor} />;
      case 'explore':
        return <Sparkles size={iconSize} color={iconColor} />;
      case 'profile':
        return <User size={iconSize} color={iconColor} />;
      default:
        return <ImageIcon size={iconSize} color={iconColor} />;
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
              activeOpacity={0.85}
            >
              {renderIcon(route.name, isFocused)}
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
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: radii.full,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.full,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
