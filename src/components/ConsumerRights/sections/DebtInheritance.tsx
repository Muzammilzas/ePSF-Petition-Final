import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { sectionStyles, colors } from '../styles';

// Create motion components
const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);

// Define animations
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 75 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.17, 0.67, 0.83, 0.67] // Bouncy easing
    }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.6,
      duration: 0.4,
      type: "spring",
      stiffness: 200
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(1, 189, 155, 0.3)",
  },
  tap: {
    scale: 0.98
  }
};

const imageRevealVariants = {
  hidden: { 
    clipPath: "inset(0 100% 0 0)",
    opacity: 0
  },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { 
      duration: 1.2,
      ease: "easeInOut",
      delay: 0.3
    }
  }
};

const DebtInheritance: React.FC = () => {
  return (
    <MotionBox 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={sectionVariants}
      sx={{
        ...sectionStyles.section,
        bgcolor: colors.background.light,
        py: { xs: 10, md: 12 },
      }}
    >
      <MotionContainer variants={sectionVariants} sx={sectionStyles.container}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox>
              <MotionTypography
                variant="h2"
                variants={textRevealVariants}
                sx={{
                  ...sectionStyles.heading,
                  mb: 3,
                }}
              >
                Protect Your Family From Inherited Timeshare Debt
              </MotionTypography>
              <MotionTypography
                variants={textRevealVariants}
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
              </MotionTypography>
              <MotionBox 
                sx={{ display: 'flex', gap: 2 }}
                initial="hidden"
                animate="visible"
              >
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
                  Protect My Family Now
                </motion.a>
              </MotionBox>
            </MotionBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MotionBox 
              sx={{ 
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2
              }}
              variants={imageRevealVariants}
            >
              <Box
                component="img"
                src="/images/debt inheritance .webp"
                alt="End Debt Inheritance"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition: 'transform 0.7s ease',
                  '&:hover': {
                    transform: 'scale(1.03)'
                  }
                }}
              />
            </MotionBox>
          </Grid>
        </Grid>
      </MotionContainer>
    </MotionBox>
  );
};

export default DebtInheritance; 