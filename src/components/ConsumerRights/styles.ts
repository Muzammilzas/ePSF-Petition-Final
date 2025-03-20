import { Theme } from '@mui/material';

export const colors = {
  primary: '#01BD9B', // Teal
  secondary: '#E0AC3F', // Gold
  accent: '#E0AC3F', // Using Gold as accent
  background: {
    light: '#FFFFFF',
    dark: '#2C3E50',
    accent: '#F5F9FF',
    card: '#FFFFFF'
  },
  text: {
    primary: '#2C3E50',
    secondary: '#64748B',
    light: '#FFFFFF',
    dark: '#1A1A1A'
  }
};

export const sectionStyles = {
  section: {
    py: { xs: 8, md: 12 },
  },
  container: {
    maxWidth: '1440px !important',
    px: { xs: 2, sm: 4, md: 6 },
  },
  heading: {
    fontFamily: 'Ubuntu, sans-serif',
    fontSize: { xs: '2rem', md: '2.5rem' },
    fontWeight: 700,
    color: colors.text.primary,
    mb: 3,
  },
  subheading: {
    fontFamily: 'Ubuntu, sans-serif',
    fontSize: { xs: '1.25rem', md: '1.5rem' },
    color: colors.text.secondary,
    mb: 4,
    fontWeight: 500,
  },
  bodyText: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1rem',
    lineHeight: 1.7,
    color: colors.text.primary,
  },
  card: {
    bgcolor: colors.background.card,
    borderRadius: 2,
    p: 3,
    height: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      transform: 'translateY(-4px)',
    },
  },
  button: {
    fontFamily: 'Roboto, sans-serif',
    borderRadius: 2,
    py: 1.5,
    px: 4,
    fontSize: '1rem',
    fontWeight: 500,
    textTransform: 'none',
    transition: 'all 0.3s ease',
  },
  primaryButton: {
    bgcolor: colors.primary,
    color: colors.text.light,
    '&:hover': {
      bgcolor: colors.primary,
      filter: 'brightness(0.9)',
    },
  },
  outlineButton: {
    border: `2px solid ${colors.primary}`,
    color: colors.primary,
    '&:hover': {
      bgcolor: `${colors.primary}10`,
      border: `2px solid ${colors.primary}`,
    },
  },
  gradientOverlay: {
    background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`,
    opacity: 0.1,
  },
} as const; 