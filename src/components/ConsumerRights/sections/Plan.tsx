import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { sectionStyles, colors } from '../styles';

interface Step {
  number: string;
  title: string;
  description: string;
  action?: string;
  link?: string;
}

const Plan: React.FC = () => {
  const steps: Step[] = [
    {
      number: '1',
      title: 'Sign Our Petition',
      description: 'Demand timeshare scam prevention and fair laws with one click. Your voice matters in this fight.',
    },
    {
      number: '2',
      title: 'Unite as Owners',
      description: 'Join our timeshare owners group to amplify your voice and create a powerful coalition for change.',
    },
    {
      number: '3',
      title: 'Secure Your Rights',
      description: 'Push for stronger cancellation rights and a fair rescission period to protect all consumers.',
    }
  ];

  return (
    <Box sx={{
      ...sectionStyles.section,
      bgcolor: colors.background.light,
      py: { xs: 6, sm: 8, md: 12 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Container maxWidth="lg" sx={{ width: '100%', px: { xs: 2, md: 3 } }}>
        <Box sx={{ 
          textAlign: 'center',
          mb: { xs: 6, md: 10 },
          maxWidth: '800px',
          mx: 'auto',
        }}>
          <Box
            sx={{
              display: 'inline-block',
              bgcolor: `${colors.primary}15`,
              color: colors.primary,
              px: 3,
              py: 1,
              borderRadius: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              mb: 3,
            }}
          >
            THE STRATEGY
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              fontWeight: 700,
              mb: 3,
              lineHeight: 1.2,
              color: colors.text.primary,
            }}
          >
            3 Steps to Reclaim Your Consumer Rights
          </Typography>

          <Typography
            sx={{
              color: colors.text.secondary,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.7,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Here's how we'll fight for you and other timeshare owners across the country.
          </Typography>
        </Box>

        <Grid 
          container 
          spacing={{ xs: 6, md: 8 }}
          justifyContent="center"
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            mb: { xs: 4, md: 6 },
          }}
        >
          {steps.map((step, index) => (
            <Grid 
              item 
              xs={12} 
              md={4} 
              key={index}
              sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: { xs: 80, md: 96 },
                  height: { xs: 80, md: 96 },
                  borderRadius: '50%',
                  bgcolor: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    color: '#fff',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                  }}
                >
                  {step.number}
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: colors.text.primary,
                }}
              >
                {step.title}
              </Typography>

              <Typography
                sx={{
                  color: colors.text.secondary,
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  mb: { xs: 2, md: 4 },
                  maxWidth: { xs: '100%', md: '300px' },
                  px: { xs: 2, md: 0 },
                }}
              >
                {step.description}
              </Typography>

              {step.action && (
                <Box sx={{ 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2 
                }}>
                  <Typography
                    component="a"
                    href={step.link}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.primary,
                      bgcolor: 'transparent',
                      border: `2px solid ${colors.primary}`,
                      px: { xs: 3, md: 4 },
                      py: { xs: 1.5, md: 2 },
                      borderRadius: 50,
                      textDecoration: 'none',
                      fontWeight: 500,
                      transition: 'all 0.2s',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      '&:hover': {
                        bgcolor: `${colors.primary}10`,
                      },
                    }}
                  >
                    {step.action}
                  </Typography>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>

        <Box sx={{ 
          textAlign: 'center', 
          mt: { xs: 2, md: 4 },
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 0 },
        }}>
          <Typography
            sx={{
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              fontWeight: 600,
              mb: { xs: 3, md: 4 },
              color: colors.text.primary,
            }}
          >
            It starts with your signature—take action now!
          </Typography>
          
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
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
              Take the First Step Now
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Plan; 