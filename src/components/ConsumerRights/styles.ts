import { Theme } from '@mui/material';

export const colors = {
  primary: '#01BD9B', // Teal
  secondary: '#E0AC3F', // Gold
  destructive: '#ef4444', // Red for warning/error states
  background: {
    light: '#FFFFFF',
    dark: '#2C3E50',
    accent: '#F5F9FF',
    card: '#FFFFFF',
    gold: '#E0AC3F', // Gold background for problem section
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
    position: 'relative',
    overflow: 'hidden',
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
    lineHeight: 1.2,
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
  glassmorphism: {
    bgcolor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: 2,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
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
  tag: {
    display: 'inline-block',
    px: 3,
    py: 1,
    mb: 2,
    bgcolor: `${colors.primary}20`,
    color: colors.primary,
    borderRadius: 1,
    fontSize: '0.875rem',
    fontWeight: 600,
    fontFamily: 'Ubuntu, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  formInput: {
    '& .MuiOutlinedInput-root': {
      bgcolor: colors.background.light,
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      '&:hover fieldset': {
        borderColor: colors.primary,
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.primary,
      },
    },
  },
  bulletPoint: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 2,
    '& svg': {
      color: colors.primary,
      fontSize: '1.25rem',
    },
  }
}; 