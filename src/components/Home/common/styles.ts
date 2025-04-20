import { SxProps, Theme } from '@mui/material';

export const commonStyles = {
  section: {
    py: { xs: 6, md: 8 },
    px: { xs: 2, sm: 4, md: 6 },
  },
  gradientBackground: {
    background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
    color: 'white',
  },
  cardHover: {
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
    },
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  textGradient: {
    background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sectionTitle: {
    mb: 4,
    textAlign: 'center',
    '& .MuiTypography-h2': {
      fontWeight: 700,
      mb: 2,
    },
    '& .MuiTypography-body1': {
      maxWidth: '800px',
      mx: 'auto',
      color: 'text.secondary',
    },
  },
  buttonGroup: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap',
    justifyContent: 'center',
    mt: 4,
  },
  container: {
    maxWidth: '1200px',
    mx: 'auto',
    width: '100%',
  },
} as Record<string, SxProps<Theme>>;

export const heroStyles = {
  root: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    ...commonStyles.gradientBackground,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    ...commonStyles.container,
    py: { xs: 8, md: 12 },
    px: { xs: 2, sm: 4, md: 6 },
  },
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.1,
    backgroundImage: 'url(/images/pattern.png)',
    backgroundSize: 'cover',
  },
} as Record<string, SxProps<Theme>>;

export const colors = {
  primary: '#01BD9B',
  secondary: '#E0AC3F',
  text: {
    primary: '#1A1A1A',
    secondary: '#666666'
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff'
  }
};

export const sectionStyles = {
  container: {
    maxWidth: '1200px',
    mx: 'auto',
    px: { xs: 2, sm: 3, md: 4 }
  },
  title: {
    fontSize: { xs: '2rem', md: '3rem' },
    fontWeight: 700,
    textAlign: 'center',
    mb: 4
  },
  subtitle: {
    fontSize: { xs: '1.1rem', md: '1.25rem' },
    color: 'text.secondary',
    textAlign: 'center',
    maxWidth: '800px',
    mx: 'auto',
    mb: 6
  },
  paper: {
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: (theme: Theme) => theme.shadows[4]
    }
  },
  icon: {
    fontSize: 40,
    color: colors.primary,
    mb: 2
  },
  button: {
    py: 2,
    px: 4,
    fontSize: '1.1rem',
    borderRadius: 2,
    textTransform: 'none'
  }
}; 