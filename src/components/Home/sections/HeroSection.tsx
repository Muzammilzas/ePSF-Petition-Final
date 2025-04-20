import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { fadeInUp, staggerContainer, slideInFromRight } from '../common/animations';
import ShieldIcon from '@mui/icons-material/Shield';
import GavelIcon from '@mui/icons-material/Gavel';
import { HERO_CONTENT } from '../common/constants';

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`,
        color: 'white',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/images/pattern.png)',
          opacity: 0.05,
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.light}00 70%)`,
          transform: 'translateY(-50%)',
          zIndex: 1,
          display: { xs: 'none', md: 'block' }
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 8, md: 0 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Box sx={{ mb: 6 }}>
                  <Typography 
                    component="span"
                    sx={{ 
                      color: theme.palette.primary.light,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      mb: 2,
                      display: 'block'
                    }}
                  >
                    ePublic Safety Foundation
                  </Typography>
                  <Typography 
                    variant="h1" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      lineHeight: 1.1,
                      mb: 3,
                      background: `linear-gradient(to right, #fff, ${theme.palette.primary.light})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {HERO_CONTENT.title}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4,
                      opacity: 0.9,
                      fontSize: { xs: '1.2rem', md: '1.5rem' },
                      fontWeight: 400,
                      color: theme.palette.primary.contrastText
                    }}
                  >
                    {HERO_CONTENT.subtitle}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 6,
                      opacity: 0.8,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      lineHeight: 1.8,
                      color: theme.palette.primary.contrastText,
                      maxWidth: '600px'
                    }}
                  >
                    {HERO_CONTENT.description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    component={Link}
                    to="/petition"
                    size="large"
                    startIcon={<GavelIcon />}
                    sx={{ 
                      backgroundColor: '#fff',
                      color: theme.palette.primary.main,
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '30px',
                      boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.contrastText,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px 0 rgba(0,0,0,0.3)',
                        transition: 'all 0.3s'
                      }
                    }}
                  >
                    {HERO_CONTENT.primaryCta}
                  </Button>
                  <Button 
                    variant="outlined" 
                    component={Link}
                    to="/report-scam"
                    size="large"
                    startIcon={<ShieldIcon />}
                    sx={{ 
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: theme.palette.primary.contrastText,
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '30px',
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: theme.palette.primary.contrastText,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s'
                      }
                    }}
                  >
                    {HERO_CONTENT.secondaryCta}
                  </Button>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideInFromRight}
            >
              <Box
                component="img"
                src="/images/hero-image.png"
                alt="Consumer Protection"
                sx={{
                  width: '100%',
                  maxWidth: '500px',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))',
                  transform: 'scale(1.1)'
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; 