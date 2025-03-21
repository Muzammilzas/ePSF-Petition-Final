import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { sectionStyles, colors } from '../styles';

const DebtInheritance: React.FC = () => {
  return (
    <Box sx={{
      ...sectionStyles.section,
      bgcolor: colors.background.light,
      py: { xs: 10, md: 12 },
    }}>
      <Container sx={sectionStyles.container}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  ...sectionStyles.heading,
                  mb: 3,
                }}
              >
                Protect Your Family From Inherited Timeshare Debt
              </Typography>
              <Typography
                sx={{
                  color: colors.text.secondary,
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                Did you know timeshare debt doesn't always end with you? Without clear protections, 
                unfair contracts and fees can pass onto your loved ones, burdening future generations 
                with debt they didn't create. At ePublic Safety Foundation, we believe debt shouldn't 
                be your legacy. Sign our petition now—together, we can stop unfair debt inheritance 
                and ensure your family's financial freedom.
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
                src="/images/debt inheritance .webp"
                alt="End Debt Inheritance"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DebtInheritance; 