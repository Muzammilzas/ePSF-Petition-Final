import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { sectionStyles, colors } from '../styles';

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const
    }
  }
};

const imageVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
      delay: 0.3
    }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.6
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 15px -3px rgba(1, 189, 155, 0.2)"
  },
  tap: {
    scale: 0.98
  }
};

const Header: React.FC = () => {
  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        ...sectionStyles.section,
        minHeight: '92vh',
        bgcolor: colors.background.light,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'none',
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
          opacity: 0.05,
          background: `radial-gradient(circle, ${colors.primary} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <Container sx={{ ...sectionStyles.container, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox variants={containerVariants}>
              <MotionBox 
                variants={itemVariants}
                sx={{
                  ...sectionStyles.tag,
                  bgcolor: `${colors.primary}15`,
                  color: colors.primary,
                }}
              >CONSUMER PROTECTION</MotionBox>
              
              <MotionTypography
                variant="h1"
                variants={itemVariants}
                sx={{
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  color: colors.text.primary,
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                Your Consumer Rights Matter
              </MotionTypography>
              
              <MotionTypography
                variant="h5"
                variants={itemVariants}
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  color: colors.text.secondary,
                  mb: 4,
                  maxWidth: '600px',
                  lineHeight: 1.5,
                }}
              >
                Sign our petition to protect timeshare owners from unfair practices and demand stronger consumer protections.
              </MotionTypography>
              
              <MotionTypography
                variants={itemVariants}
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  color: colors.text.secondary,
                  mb: 4,
                  maxWidth: '600px',
                  lineHeight: 1.7,
                }}
              >
                You're a timeshare owner who deserves fairness, not frustration. 
                Yet, shady companies deny you basic consumer rights with scams, fraud, 
                and contracts you can't escape. ePublic Safety Foundation is here to 
                fight for you—sign our petition to demand the protections you're entitled to!
              </MotionTypography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <motion.a
                  href="/sign/84dec50d-d877-4f15-9250-f5364124371a"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    backgroundColor: colors.primary,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                  }}
                >
                  Protect My Rights Now
                </motion.a>
              </Box>
            </MotionBox>
          </Grid>
          
          <MotionGrid item xs={12} md={6} variants={imageVariants}>
            <Box
              component="img"
              src="/images/First-section.webp"
              alt="Consumer rights protection"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 0,
                boxShadow: 'none',
              }}
            />
          </MotionGrid>
        </Grid>
      </Container>
    </MotionBox>
  );
};

export default Header;