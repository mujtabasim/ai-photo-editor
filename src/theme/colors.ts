export const colors = {
  primary: '#6C4DFF',            // Premium AI Purple
  primaryLight: '#8B5CF6',       // Accent Purple
  primaryDark: '#5534E0',
  accent: '#8B5CF6',
  accentLight: '#C084FC',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#FAFAFC',         // Crisp clean white/off-white background
  secondaryBackground: '#F4F4F8',
  card: '#FFFFFF',
  cardDark: '#111827',
  border: '#ECECF3',             // Soft subtle border
  borderLight: '#F3F4F6',
  textPrimary: '#111827',        // Sharp dark text
  textSecondary: '#6B7280',      // Muted slate gray
  textMuted: '#9CA3AF',
  textWhite: '#FFFFFF',
  glassBackground: 'rgba(255, 255, 255, 0.88)',
  glassBorder: 'rgba(236, 236, 243, 0.7)',
  glassDarkBackground: 'rgba(17, 24, 39, 0.90)',
  gradients: {
    primary: ['#6C4DFF', '#8B5CF6'],
    accent: ['#8B5CF6', '#C084FC'],
    hero: ['#F5F3FF', '#EDE9FE', '#FAFAFC'],
    heroBanner: ['#6C4DFF', '#8B5CF6'],
    card: ['#FFFFFF', '#FAFAFC'],
    emerald: ['#10B981', '#059669'],
    sunset: ['#F43F5E', '#FB7185'],
    ocean: ['#3B82F6', '#1D4ED8'],
    cyber: ['#6C4DFF', '#8B5CF6', '#EC4899'],
    glass: ['rgba(255, 255, 255, 0.90)', 'rgba(250, 250, 252, 0.60)'],
  }
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 28,
    elevation: 8,
  },
  glow: {
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    elevation: 10,
  }
};
