import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { sectionStyles, colors } from '../styles';

const Header: React.FC = () => {
  return (
    <Box
      sx={{
        ...sectionStyles.section,
        minHeight: '92vh',
        bgcolor: colors.background.dark,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.5))',
          zIndex: 1,
        },
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url('/assets/pattern.svg')`,
          backgroundSize: '100px 100px',
        }}
      />

      <Container sx={{ ...sectionStyles.container, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Box sx={sectionStyles.tag}>CONSUMER PROTECTION</Box>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  color: colors.text.light,
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                Your Consumer Rights Matter
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  color: colors.text.light,
                  opacity: 0.9,
                  mb: 4,
                  maxWidth: '600px',
                  lineHeight: 1.5,
                }}
              >
                Sign our petition to protect timeshare owners from unfair practices and demand stronger consumer protections.
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  color: colors.text.light,
                  opacity: 0.8,
                  mb: 4,
                  maxWidth: '600px',
                  lineHeight: 1.7,
                }}
              >
                You're a timeshare owner who deserves fairness, not frustration. 
                Yet, shady companies deny you basic consumer rights with scams, fraud, 
                and contracts you can't escape. ePublic Safety Foundation is here to 
                fight for you—sign our petition to demand the protections you're entitled to!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography
                  component="a"
                  href="/sign/84dec50d-d877-4f15-9250-f5364124371a"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    bgcolor: colors.primary,
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: 50,
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '&:hover': {
                      bgcolor: colors.primary,
                      filter: 'brightness(0.9)',
                    },
                  }}
                >
                  Sign the Petition
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src="/assets/images/signing-petition.jpg"
                alt="Person signing a petition"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: '#fff',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Typography
                  sx={{
                    color: colors.primary,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  Rights Matter
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Header; 