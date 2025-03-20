import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { sectionStyles, colors } from '../styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Failure: React.FC = () => {
  return (
    <Box sx={{
      ...sectionStyles.section,
      bgcolor: colors.background.light,
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        background: `linear-gradient(135deg, ${colors.destructive}, transparent)`,
      }} />

      <Container sx={sectionStyles.container}>
        <Box sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '800px',
          mx: 'auto',
        }}>
          <ErrorOutlineIcon sx={{
            fontSize: '5rem',
            color: colors.destructive,
            mb: 3,
          }} />

          <Typography
            variant="h2"
            sx={{
              ...sectionStyles.heading,
              mb: 3,
            }}
          >
            Oops! Something Went Wrong
          </Typography>

          <Typography
            sx={{
              fontSize: '1.25rem',
              lineHeight: 1.6,
              mb: 4,
              color: colors.text.secondary,
            }}
          >
            We encountered an issue while processing your signature. This could be due to
            a temporary system error or network connectivity problem. Please try again.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/sign-petition"
              variant="contained"
              sx={{
                bgcolor: colors.destructive,
                color: colors.text.light,
                px: 4,
                py: 1.5,
                fontSize: '1.125rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: `${colors.destructive}E6`,
                },
              }}
            >
              Try Again
            </Button>
            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              sx={{
                borderColor: colors.destructive,
                color: colors.destructive,
                px: 4,
                py: 1.5,
                fontSize: '1.125rem',
                fontWeight: 500,
                '&:hover': {
                  borderColor: colors.destructive,
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              Contact Support
            </Button>
          </Box>

          <Box sx={{
            mt: 6,
            p: 3,
            ...sectionStyles.glassmorphism,
            bgcolor: colors.background.light,
          }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Ubuntu, sans-serif',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Need Help?
            </Typography>
            <Typography sx={{ color: colors.text.secondary }}>
              If you continue to experience issues, please contact our support team.
              We're here to help ensure your voice is heard in our petition for
              consumer rights.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Failure; 