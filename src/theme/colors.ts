export const colors = {
  primary: '#6b38d4',            // Lumina Purple
  primaryLight: '#8455ef',       // Lumina Purple Container
  primaryDark: '#5516be',
  accent: '#0058be',             // Lumina Secondary Blue
  accentLight: '#2170e4',
  success: '#22C55E',
  warning: '#a76500',            // Lumina Tertiary Orange/Gold
  error: '#ba1a1a',              // Lumina Error Red
  background: '#fef7ff',         // Lumina Background
  secondaryBackground: '#f3ebf8',// Lumina Container Background
  card: '#ffffff',
  cardDark: '#1d1a23',
  border: '#cbc3d7',             // Lumina Outline Variant
  borderLight: '#ede5f3',        // Lumina Surface Container High
  textPrimary: '#1d1a23',        // Lumina On-Surface
  textSecondary: '#494454',      // Lumina On-Surface Variant
  textMuted: '#7b7486',          // Lumina Outline
  textWhite: '#ffffff',
  glassBackground: 'rgba(254, 247, 255, 0.82)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  glassDarkBackground: 'rgba(29, 26, 35, 0.88)',
  gradients: {
    primary: ['#6b38d4', '#2170e4'], // Lumina Spectrum: Purple to Electric Blue
    accent: ['#8455ef', '#a76500'],
    emerald: ['#10B981', '#059669'],
    sunset: ['#FF6B6B', '#a76500'],
    ocean: ['#0058be', '#2170e4'],
    cyber: ['#8455ef', '#ba1a1a', '#a76500'],
    gold: ['#a76500', '#855000'],
    glass: ['rgba(254, 247, 255, 0.85)', 'rgba(254, 247, 255, 0.5)'],
  }
};

export const radii = {
  sm: 4,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 24, // Matches primary radius (24px)
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#1d1a23',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#6b38d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1d1a23',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: '#6b38d4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 10,
  }
};
