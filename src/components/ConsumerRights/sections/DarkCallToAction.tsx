import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { sectionStyles, colors } from '../styles';

// Create motion variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const slideUpVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const warningVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const buttonVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      delay: 0.6
    }
  },
  hover: { 
    scale: 1.05,
    boxShadow: "0px 8px 20px rgba(255, 68, 68, 0.4)",
    transition: { duration: 0.3 }
  }
};

const imgVariants = {
  hidden: { 
    opacity: 0,
    rotateY: 30,
    x: 100
  },
  visible: { 
    opacity: 1,
    rotateY: 0,
    x: 0,
    transition: { 
      type: "spring", 
      damping: 20,
      delay: 0.3,
      duration: 0.8
    }
  }
};

// Create motion components
const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const DarkCallToAction: React.FC = () => {
  return (
    <MotionBox 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      sx={{
        ...sectionStyles.section,
        bgcolor: '#000',
        color: colors.text.light,
        position: 'relative',
        py: { xs: 12, md: 16 },
        overflow: 'hidden',
      }}
    >
      <MotionContainer 
        variants={containerVariants}
        sx={{ 
          ...sectionStyles.container,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 6, md: 10 },
        }}
      >
        <MotionBox variants={containerVariants} sx={{ maxWidth: '600px' }}>
          <MotionTypography
            variants={warningVariants}
            sx={{
              color: '#FF4444',
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              mb: 2,
            }}
          >
            Urgent Warning
          </MotionTypography>
          <MotionTypography
            variant="h2"
            variants={slideUpVariants}
            sx={{
              ...sectionStyles.heading,
              color: 'inherit',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3rem' },
              fontWeight: 700,
            }}
          >
            Without Action, Your Rights Fade
          </MotionTypography>
          <MotionTypography
            variants={slideUpVariants}
            sx={{
              fontSize: '1.125rem',
              lineHeight: 1.7,
              mb: 4,
              opacity: 0.7,
              color: '#fff',
            }}
          >
            If we don't fight, timeshare companies will keep denying your rights. Scams will
            grow, cancellation will stay impossible, and owners will suffer. Don't let your
            consumer rights slip away—sign now to stop this injustice!
          </MotionTypography>
          <MotionButton
            variant="contained"
            href="/sign/84dec50d-d877-4f15-9250-f5364124371a"
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            sx={{
              ...sectionStyles.button,
              bgcolor: '#FF4444',
              color: '#fff',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                bgcolor: '#FF4444',
                filter: 'brightness(0.9)',
              },
              '&::after': {
                content: '"→"',
                marginLeft: 1,
                transition: 'transform 0.2s',
              },
              '&:hover::after': {
                transform: 'translateX(4px)',
              },
            }}
          >
            Sign Before It's Too Late
          </MotionButton>
        </MotionBox>

        <MotionBox 
          variants={imgVariants}
          sx={{
            position: 'relative',
            width: { xs: '100%', md: '500px' },
            bgcolor: 'transparent',
          }}
        >
          <Box
            component="img"
            src="/images/Without Action.webp"
            alt="Rights Lost"
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block',
              opacity: 1,
            }}
          />
        </MotionBox>
      </MotionContainer>
    </MotionBox>
  );
};

export default DarkCallToAction; 