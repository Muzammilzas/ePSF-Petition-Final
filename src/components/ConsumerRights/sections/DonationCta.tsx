import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { sectionStyles, colors } from '../styles';
import { Link } from 'react-router-dom';

const DonationCta: React.FC = () => {
  return (
    <Box sx={{
      ...sectionStyles.section,
      py: { xs: 0, md: 0 },
      mt: { xs: 2, md: 3 },
      mb: { xs: 5, md: 8 },
    }}>
      <Container maxWidth="lg">
        {/* Main Banner */}
        <Box 
          sx={{ 
            background: `linear-gradient(90deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
            borderRadius: { xs: 2, md: 4 },
            overflow: 'hidden',
            color: '#fff',
            position: 'relative',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Background Elements */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'radial-gradient(circle at 10% 50%, #ffffff 0%, transparent 25%), radial-gradient(circle at 90% 50%, #ffffff 0%, transparent 25%)',
            zIndex: 0,
          }} />
          
          {/* Content Container */}
          <Box sx={{
            position: 'relative',
            zIndex: 1,
            px: { xs: 3, sm: 5, md: 6 },
            py: { xs: 4, sm: 5 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 4, md: 2 },
          }}>
            {/* Text Content */}
            <Box sx={{ maxWidth: { md: '60%' } }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                  fontWeight: 700,
                  mb: { xs: 1, md: 1.5 },
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                You've Taken a Stand. Now Help Us Take the Next Step.
              </Typography>
              
              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  mb: 3,
                  opacity: 0.9,
                  maxWidth: '700px',
                }}
              >
                Your donation powers our fight for fair contracts, ending inheritance debt, and bringing real change.
              </Typography>

              {/* Mini Bullet Points Inside Banner */}
              <Box sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1.5, md: 3 },
                mt: 0.5
              }}>
                {['Stop forced inheritance', 'Support legal reform', 'Protect families'].map((item, index) => (
                  <Typography 
                    key={index}
                    sx={{ 
                      fontSize: '0.85rem',
                      opacity: 0.9,
                      display: 'flex',
                      alignItems: 'center',
                      mr: { sm: 2 },
                      '&:before': {
                        content: '""',
                        display: 'inline-block',
                        width: 6,
                        height: 6,
                        bgcolor: '#ffffff',
                        borderRadius: '50%',
                        mr: 1.5,
                        flexShrink: 0
                      }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
            
            {/* Action Button */}
            <Box>
              <Button
                component={Link}
                to="/donation"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#fff',
                  color: colors.secondary,
                  borderRadius: 50,
                  px: { xs: 3, md: 5 },
                  py: { xs: 1.25, md: 1.75 },
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  minWidth: { xs: '100%', sm: '220px' },
                  '&:hover': {
                    bgcolor: '#f8f8f8',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                    transform: 'translateY(-3px)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                Donate to Support
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DonationCta; 