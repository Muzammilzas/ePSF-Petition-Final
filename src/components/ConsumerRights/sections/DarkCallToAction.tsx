import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { sectionStyles, colors } from '../styles';

const DarkCallToAction: React.FC = () => {
  return (
    <Box sx={{
      ...sectionStyles.section,
      bgcolor: '#000',
      color: colors.text.light,
      position: 'relative',
      py: { xs: 12, md: 16 },
      overflow: 'hidden',
    }}>
      <Container sx={{ 
        ...sectionStyles.container,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: 6, md: 10 },
      }}>
        <Box sx={{ maxWidth: '600px' }}>
          <Typography
            sx={{
              color: '#FF4444',
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              mb: 2,
            }}
          >
            Urgent Warning
          </Typography>
          <Typography
            variant="h2"
            sx={{
              ...sectionStyles.heading,
              color: 'inherit',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3rem' },
              fontWeight: 700,
            }}
          >
            Without Action, Your Rights Fade
          </Typography>
          <Typography
            sx={{
              fontSize: '1.125rem',
              lineHeight: 1.7,
              mb: 4,
              opacity: 0.7,
              color: '#fff',
            }}
          >
            If we don't fight, timeshare companies will keep denying your rights. Scams will
            grow, cancellation will stay impossible, and owners will suffer. Don't let your
            consumer rights slip away—sign now to stop this injustice!
          </Typography>
          <Button
            variant="contained"
            href="#sign-petition"
            sx={{
              ...sectionStyles.button,
              bgcolor: '#FF4444',
              color: '#fff',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                bgcolor: '#FF4444',
                filter: 'brightness(0.9)',
              },
              '&::after': {
                content: '"→"',
                marginLeft: 1,
                transition: 'transform 0.2s',
              },
              '&:hover::after': {
                transform: 'translateX(4px)',
              },
            }}
          >
            Sign Before It's Too Late
          </Button>
        </Box>

        <Box sx={{
          position: 'relative',
          width: { xs: '100%', md: '500px' },
          bgcolor: 'transparent',
        }}>
          <Box
            component="img"
            src="/images/Without Action.webp"
            alt="Rights Lost"
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block',
              opacity: 1,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default DarkCallToAction; 