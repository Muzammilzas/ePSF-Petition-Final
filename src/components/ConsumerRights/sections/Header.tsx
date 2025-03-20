import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { sectionStyles, colors } from '../styles';

const Header: React.FC = () => {
  return (
    <Box sx={{
      minHeight: '92vh',
      bgcolor: colors.background.dark,
      position: 'relative',
      overflow: 'hidden',
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
        opacity: 0.1,
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        },
      }} />

      <Container sx={{ ...sectionStyles.container, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  fontFamily: 'Ubuntu, sans-serif',
                  color: colors.secondary,
                  fontWeight: 600,
                  letterSpacing: 2,
                  mb: 2,
                  display: 'block',
                }}
              >
                CONSUMER PROTECTION INITIATIVE
              </Typography>
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
                Your Consumer Rights
                <Box component="span" sx={{ color: colors.primary, display: 'block' }}>
                  Matter
                </Box>
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
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/sign-petition"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    ...sectionStyles.button,
                    bgcolor: colors.primary,
                    color: colors.text.light,
                    '&:hover': {
                      bgcolor: colors.primary,
                      filter: 'brightness(0.9)',
                    },
                  }}
                >
                  Sign the Petition
                </Button>
                <Button
                  component={Link}
                  to="#learn-more"
                  variant="outlined"
                  sx={{
                    ...sectionStyles.button,
                    borderColor: colors.text.light,
                    color: colors.text.light,
                    '&:hover': {
                      borderColor: colors.primary,
                      color: colors.primary,
                      bgcolor: 'transparent',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  p: 2,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Placeholder for hero image */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`,
                    opacity: 0.5,
                  }}
                />

                <Box sx={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 2,
                }}>
                  <Paper sx={{
                    bgcolor: colors.background.card,
                    p: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontFamily: 'Ubuntu, sans-serif',
                        color: colors.primary,
                        fontWeight: 700 
                      }}
                    >
                      5K+
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'Roboto, sans-serif',
                        color: colors.text.secondary 
                      }}
                    >
                      Signatures
                    </Typography>
                  </Paper>
                  <Paper sx={{
                    bgcolor: colors.background.card,
                    p: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontFamily: 'Ubuntu, sans-serif',
                        color: colors.primary,
                        fontWeight: 700 
                      }}
                    >
                      98%
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'Roboto, sans-serif',
                        color: colors.text.secondary 
                      }}
                    >
                      Support Rate
                    </Typography>
                  </Paper>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Header; 