import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../common/animations';
import { WHY_THIS_MATTERS } from '../common/constants';

const WhyThisMattersSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        py: { xs: 10, md: 15 },
        bgcolor: theme.palette.primary.main,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary.dark})`,
          opacity: 0.4
        }
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Box sx={{ 
              maxWidth: '800px',
              mx: 'auto'
            }}>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontWeight: 700,
                  mb: 4,
                  textAlign: 'center',
                  color: 'white',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '4px',
                    bgcolor: theme.palette.secondary.main
                  }
                }}
              >
                {WHY_THIS_MATTERS.title}
              </Typography>

              <Typography 
                variant="h5"
                sx={{ 
                  textAlign: 'center',
                  mb: 6,
                  fontSize: '1.5rem',
                  lineHeight: 1.8,
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                {WHY_THIS_MATTERS.description}
              </Typography>

              <Typography 
                variant="h4"
                sx={{ 
                  textAlign: 'center',
                  fontWeight: 600,
                  color: theme.palette.secondary.main
                }}
              >
                {WHY_THIS_MATTERS.callToAction}
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default WhyThisMattersSection; 