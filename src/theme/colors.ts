export const colors = {
  primary: '#5B5FEF',
  primaryLight: '#8184F8',
  primaryDark: '#4347C9',
  accent: '#7C4DFF',
  accentLight: '#A482FF',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#FFFFFF',
  secondaryBackground: '#F8FAFC',
  card: '#FFFFFF',
  cardDark: '#0F172A',
  border: '#E5E7EB',
  borderLight: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textWhite: '#FFFFFF',
  glassBackground: 'rgba(255, 255, 255, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',
  glassDarkBackground: 'rgba(15, 23, 42, 0.85)',
  gradients: {
    primary: ['#5B5FEF', '#7C4DFF'],
    accent: ['#7C4DFF', '#C084FC'],
    emerald: ['#10B981', '#059669'],
    sunset: ['#FF6B6B', '#FF8E53'],
    ocean: ['#00C6FF', '#0072FF'],
    cyber: ['#8A2387', '#E94057', '#F27121'],
    gold: ['#F59E0B', '#D97706'],
    glass: ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)'],
  }
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#5B5FEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: '#5B5FEF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  }
};
