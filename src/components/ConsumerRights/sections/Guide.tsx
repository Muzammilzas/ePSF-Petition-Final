import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import { sectionStyles, colors } from '../styles';

const Guide: React.FC = () => {
  return (
    <Box sx={{
      ...sectionStyles.section,
      bgcolor: colors.background.light,
      py: { xs: 6, sm: 8, md: 12 },
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={{ xs: 6, md: 8 }} 
          alignItems="center"
          direction={{ xs: 'column-reverse', md: 'row' }}
        >
          <Grid item xs={12} md={7}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                component="span"
                sx={{
                  display: 'inline-block',
                  bgcolor: `${colors.primary}15`,
                  color: colors.primary,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 600,
                  mb: { xs: 2, md: 3 },
                }}
              >
                OUR MISSION
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  mb: { xs: 3, md: 4 },
                  color: colors.text.primary,
                  lineHeight: 1.2,
                }}
              >
                ePublic Safety Foundation: Your Rights Advocate
              </Typography>

              <Typography
                sx={{
                  color: colors.text.secondary,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  mb: { xs: 2, md: 3 },
                  lineHeight: 1.7,
                  maxWidth: { xs: '100%', md: '90%' },
                }}
              >
                At ePublic Safety Foundation, we're a nonprofit dedicated to defending consumer rights. We've seen how timeshare owners suffer from unfair practices, and we're stepping up with a powerful petition.
              </Typography>

              <Typography
                sx={{
                  color: colors.text.secondary,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  mb: { xs: 4, md: 5 },
                  lineHeight: 1.7,
                  maxWidth: { xs: '100%', md: '90%' },
                }}
              >
                With our expertise and your support, we'll demand the protections you deserve. Let us guide you to justice!
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 2, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                width: { xs: '100%', sm: 'auto' },
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
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: 50,
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    width: { xs: '100%', sm: 'auto' },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '&:hover': {
                      bgcolor: colors.primary,
                      filter: 'brightness(0.9)',
                    },
                  }}
                >
                  Join the Fight for Justice
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ 
              position: 'relative',
              width: { xs: '240px', sm: '280px' },
              height: { xs: '240px', sm: '280px' },
              margin: '0 auto',
            }}>
              {/* Circular background layers */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  bgcolor: `${colors.primary}10`,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  height: '80%',
                  borderRadius: '50%',
                  bgcolor: `${colors.primary}15`,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60%',
                  height: '60%',
                  borderRadius: '50%',
                  bgcolor: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldIcon sx={{ 
                  fontSize: { xs: 60, sm: 80 },
                  color: '#fff',
                }} />
              </Box>

              {/* Labels */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bgcolor: '#fff',
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  borderRadius: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Typography
                  sx={{
                    color: colors.primary,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 600,
                  }}
                >
                  Defending Your Rights
                </Typography>
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  bgcolor: '#fff',
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  borderRadius: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 600,
                  }}
                >
                  ePSF
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Guide; 