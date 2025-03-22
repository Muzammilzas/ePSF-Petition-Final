import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
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

const DonationComplete: React.FC = () => {
  // Scroll to top on page load and set page title
  useEffect(() => {
    // Set page title
    document.title = "You Fought Timeshare Debt";
    
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
                  background: '#01BD9B',
                  borderRadius: '50%',
                  width: '70px',
                  height: '70px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '24px',
                  boxShadow: '0 6px 16px rgba(1, 189, 155, 0.2)'
                }}
              >
                <FavoriteIcon sx={{ fontSize: 32, color: 'white' }} />
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
                  color: 'primary.main',
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}
              >
                You Fought Timeshare Debt
              </Typography>
              <Typography 
                variant="h4" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 600, 
                  color: 'secondary.main',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  mb: 3
                }}
              >
                Thank You for Standing Up for Families Like Yours
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
                  Because you completed your donation, you're helping us fight back against deceptive timeshare contracts, protect families from inherited debt, and push for stronger consumer laws.
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
                  Your support means more families will escape contracts they never signed up for—and future generations won't be stuck paying for past mistakes.
                </Typography>
                
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.7,
                    fontWeight: 500,
                    fontStyle: 'italic',
                    color: 'primary.main'
                  }}
                >
                  You didn't just give—you empowered change.
                </Typography>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  component={Link}
                  to="/"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: '50px',
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 10px rgba(1, 189, 155, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 14px rgba(1, 189, 155, 0.4)',
                    }
                  }}
                >
                  Return Home
                </Button>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DonationComplete; 