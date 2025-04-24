import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GavelIcon from '@mui/icons-material/Gavel';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { sectionStyles, colors } from '../styles';

// Motion component wrappers
const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionGrid = motion(Grid);

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeInOut"
    }
  })
};

const iconVariants = {
  hidden: { scale: 0, rotate: -45 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    }
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3
    }
  }
};

interface Problem {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  bgColor: string;
}

const Problem: React.FC = () => {
  const problems: Problem[] = [
    {
      icon: <ErrorOutlineIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Scams and Fraud',
      description: 'Companies trick owners into bad deals with misleading information and hidden fees.',
      image: '/images/Scams and Fraud.png',
      bgColor: 'rgba(237, 247, 247, 1)'
    },
    {
      icon: <WarningAmberIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Limited Cancellation Rights',
      description: "Once you sign, you're trapped in an unwanted contract with virtually no way out.",
      image: '/images/Limited Cancellation Rights.png',
      bgColor: 'rgba(237, 247, 247, 1)'
    },
    {
      icon: <GavelIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Short Rescission Period',
      description: 'The legal timeframe to cancel is unfairly brief, often passing before issues are discovered.',
      image: '/images/Short Rescission Period.png',
      bgColor: 'rgba(237, 247, 247, 1)'
    },
    {
      icon: <MoneyOffIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Aggressive Promotions',
      description: 'High-pressure sales tactics hide the truth and rush you into decisions.',
      image: '/images/Aggressive Promotions.png',
      bgColor: 'rgba(237, 247, 247, 1)'
    }
  ];

  // Define fixed image sizes to ensure consistency
  const iconSize = {
    width: 35,
    height: 35,
  };

  return (
    <MotionBox 
      id="learn-more" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      sx={{
        ...sectionStyles.section,
        bgcolor: colors.primary,
        py: { xs: 10, md: 12 },
      }}
    >
      <MotionContainer variants={sectionVariants} sx={sectionStyles.container}>
        <MotionBox 
          variants={fadeInUpVariants}
          sx={{ position: 'relative', zIndex: 1, mb: 6, textAlign: 'center' }}
        >
          <MotionTypography
            variant="h2"
            variants={fadeInUpVariants}
            sx={{
              ...sectionStyles.heading,
              color: '#fff',
              mb: 2,
            }}
          >
            Timeshare Owners Denied Their Rights
          </MotionTypography>
          <MotionTypography
            variants={fadeInUpVariants}
            sx={{
              ...sectionStyles.subheading,
              color: '#fff',
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.9,
            }}
          >
            As a consumer, you have rights—but timeshare companies often deny these basic principles.
          </MotionTypography>
        </MotionBox>

        <Grid container spacing={4}>
          <MotionGrid 
            item 
            xs={12} 
            md={6}
            variants={imageVariants}
          >
            <Box
              component="img"
              src="/images/home-page/Timeshare Owners Denied Their Rights.avif"
              alt="Timeshare rights denied"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            />
          </MotionGrid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {problems.map((problem, index) => (
                <MotionPaper
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                  transition={{ duration: 0.3 }}
                  elevation={0}
                  sx={{
                    p: 3.5,
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 2,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <MotionBox 
                      variants={iconVariants}
                      whileHover="hover"
                      sx={{
                        width: 70,
                        height: 70,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        bgcolor: 'rgba(237, 247, 247, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(1, 189, 155, 0.15)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src={problem.image}
                        alt={problem.title}
                        sx={{
                          width: '56px',
                          height: '56px',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    </MotionBox>
                    <Box>
                      <MotionTypography
                        variant="h6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        sx={{
                          fontFamily: 'Ubuntu, sans-serif',
                          fontWeight: 600,
                          mb: 1,
                          color: colors.text.dark,
                          fontSize: '1.25rem',
                        }}
                      >
                        {problem.title}
                      </MotionTypography>
                      <MotionTypography
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                        sx={{
                          color: colors.text.dark,
                          lineHeight: 1.6,
                          opacity: 0.8,
                          fontSize: '1rem',
                        }}
                      >
                        {problem.description}
                      </MotionTypography>
                    </Box>
                  </Box>
                </MotionPaper>
              ))}
              <MotionTypography
                variants={fadeInUpVariants}
                sx={{
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#fff',
                  opacity: 0.9,
                  textAlign: 'center',
                  mt: 2,
                }}
              >
                This isn't right. You deserve better—and we're here to help.
              </MotionTypography>
            </Box>
          </Grid>
        </Grid>
      </MotionContainer>
    </MotionBox>
  );
};

export default Problem; 