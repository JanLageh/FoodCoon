// ─── FoodCoon Design Tokens ───────────────────────────────────────────────────
// Ported 1-to-1 from Flutter AppTheme

export const Colors = {
  // Primary
  primary: '#FF6B35',
  primaryLight: '#FF8F5E',
  primaryDark: '#E55A2B',
  accent: '#FFC857',
  accentGold: '#FFD700',

  // Backgrounds
  bgDark: '#0F0F14',
  bgCard: '#1A1A24',
  bgCardLight: '#22222E',
  bgElevated: '#2A2A38',
  bgGlass: 'rgba(255,255,255,0.1)',

  // Text
  textPrimary: '#F5F5F7',
  textSecondary: '#B0B0BE',
  textMuted: '#6E6E80',

  // Semantic
  success: '#34C759',
  warning: '#FFB800',
  error: '#FF3B30',
  info: '#0A84FF',

  // Food indicators
  vegGreen: '#4CAF50',
  nonVegRed: '#E53935',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 100,
} as const;

export const FontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Gradient arrays for use with expo-linear-gradient
export const Gradients = {
  primary: ['#FF6B35', '#FF8F5E'] as [string, string],
  card: ['#1A1A24', '#22222E'] as [string, string],
  overlay: ['transparent', 'rgba(0,0,0,0.8)'] as [string, string],
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  elevated: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
};
