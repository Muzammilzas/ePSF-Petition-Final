import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

const iconVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
      delay: 1.2
    }
  },
  hover: {
    scale: 1.1,
    color: "#E0AC3F",
    transition: {
      duration: 0.3
    }
  }
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      delay: 0.5
    }
  }
};

const DonationCancel: React.FC = () => {
  // Scroll to top on page load and set page title
  useEffect(() => {
    // Set page title
    document.title = "Still Time to Act - ePSF";
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Restore original title when component unmounts
    return () => {
      document.title = "ePSF Timeshare Reform Petition";
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: '80vh',
        py: 6,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.04,
          background: 'radial-gradient(circle at 25% 25%, #01BD9B 1px, transparent 1px), radial-gradient(circle at 75% 75%, #E0AC3F 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          zIndex: -1,
        }
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }
            }}
          >
            <Box sx={{ position: 'relative', textAlign: 'center', mb: 4 }}>
              <motion.div 
                variants={iconVariants}
                whileHover="hover"
                style={{ 
                  display: 'inline-flex',
                  background: '#E0AC3F', // Using secondary color (gold)
                  borderRadius: '50%',
                  width: '70px',
                  height: '70px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '24px',
                  boxShadow: '0 6px 16px rgba(224, 172, 63, 0.2)'
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 32, color: 'white' }} />
              </motion.div>
            </Box>

            <motion.div variants={itemVariants}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 700, 
                  color: 'secondary.main', // Using secondary color
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                  textTransform: 'none',
                  letterSpacing: '0.05em'
                }}
              >
                Still Time to Act
              </Typography>
              <Typography 
                variant="h4" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 600, 
                  color: 'primary.main', // Using primary color
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  mb: 3
                }}
              >
                You Were So Close to Making a Difference
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ my: 4 }}>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.7,
                    mb: 3
                  }}
                >
                  We noticed you didn't finish your donation. Just one contribution could help us protect families from inheriting unwanted timeshare debt, fight unfair cancellation rules, and push for real legal reform.
                </Typography>
                
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.7,
                    mb: 3
                  }}
                >
                  If you had completed your donation, you could've helped a family avoid a lifetime contract—and helped us move one step closer to justice.
                </Typography>
                
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.7,
                    fontWeight: 500,
                    mb: 4,
                    color: 'secondary.main'
                  }}
                >
                  You still have the power to make that change.
                </Typography>
              </Box>
            </motion.div>

            <motion.div 
              variants={buttonVariants}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  component="a"
                  href="https://www.paypal.com/donate/?hosted_button_id=CJ3BQFH766EXG"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: '50px',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    boxShadow: '0 4px 10px rgba(1, 189, 155, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 14px rgba(1, 189, 155, 0.4)',
                      transform: 'scale(1.03)',
                      transition: 'all 0.3s ease',
                    }
                  }}
                >
                  Complete Your Donation Now
                </Button>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DonationCancel;