import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { sectionStyles, colors } from '../styles';

const CallToAction: React.FC = () => {
  const futurePoints = [
    'Timeshare scams are stopped cold.',
    'You have clear cancellation rights to exit bad deals.',
    'A longer rescission period protects your choices.',
    'Companies respect your consumer rights.',
  ];

  return (
    <Box sx={{
      ...sectionStyles.section,
      bgcolor: colors.background.light,
      py: { xs: 10, md: 12 },
    }}>
      <Container sx={sectionStyles.container}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            sx={{
              color: colors.primary,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              mb: 2,
            }}
          >
            TAKE ACTION
          </Typography>
          <Typography
            variant="h2"
            sx={{
              ...sectionStyles.heading,
              mb: 2,
            }}
          >
            Stand Up for Your Rights Today
          </Typography>
          <Typography
            sx={{
              color: colors.text.secondary,
              fontSize: '1.125rem',
              mb: 6,
            }}
          >
            Sign the Timeshare Fraud Petition Now
          </Typography>
        </Box>

        <Grid container spacing={8} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Ubuntu, sans-serif',
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                A Future Where Your Rights Win
              </Typography>

              <Typography sx={{ mb: 3, color: colors.text.secondary }}>
                Imagine a world where:
              </Typography>

              <Box sx={{ mb: 4 }}>
                {futurePoints.map((point, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: `${colors.primary}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          fontSize: 16,
                          color: colors.primary,
                        }}
                      />
                    </Box>
                    <Typography>{point}</Typography>
                  </Box>
                ))}
              </Box>

              <Typography sx={{ mb: 4, color: colors.text.secondary }}>
                Your signature makes this real. Join us to create a safer, fairer future
                for all timeshare owners!
              </Typography>

              <Box sx={{ 
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-start' },
                mt: 5,
              }}>
                <Typography
                  component="a"
                  href="/sign/84dec50d-d877-4f15-9250-f5364124371a"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    bgcolor: colors.primary,
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.5, md: 2 },
                    borderRadius: 28,
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    '&:hover': {
                      filter: 'brightness(0.9)',
                    },
                  }}
                >
                  Sign the Petition →
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/third-section.webp"
              alt="Stand Up for Your Rights"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CallToAction; 