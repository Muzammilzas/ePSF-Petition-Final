import React from 'react';
import { Box, Container, Typography, useTheme, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../common/animations';
import ShieldIcon from '@mui/icons-material/Shield';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

const WhoWeAreSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        py: { xs: 10, md: 15 },
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 0% 0%, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 70%)`,
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 100% 100%, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 70%)`,
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Box sx={{ 
              textAlign: 'center', 
              mb: 8,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '-20px',
                width: '120px',
                height: '4px',
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                borderRadius: '2px'
              }
            }}>
              <FamilyRestroomIcon sx={{ 
                fontSize: '3rem', 
                color: theme.palette.primary.main,
                mb: 2
              }} />
              <Typography 
                variant="h2" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  color: theme.palette.primary.main,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                Who We Are
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Paper
              elevation={0}
              sx={{
                maxWidth: '900px',
                mx: 'auto',
                p: { xs: 3, md: 6 },
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative'
              }}
            >
              <Box sx={{ 
                position: 'absolute',
                top: -20,
                left: -20,
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: theme.palette.primary.main,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldIcon sx={{ fontSize: '2.5rem', color: 'white' }} />
              </Box>

              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  lineHeight: 1.8,
                  color: 'text.primary',
                  fontWeight: 500,
                  textAlign: 'center'
                }}
              >
                ePublic Safety Foundation is a family-founded nonprofit dedicated to protecting consumers from financial deception — especially in timeshares in Florida, estate-related scams, and deceptive timeshare exit company practices.
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                We were created to help people like you understand your rights, avoid predatory contracts, and take action when things go wrong. Too many families are being misled, trapped in lifelong timeshare obligations, or defrauded of inheritances with no clear way out. We're here to change that.
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  textAlign: 'center'
                }}
              >
                From pushing for stronger protections to helping you report a scam — everything we do is rooted in one goal:
              </Typography>

              <Box 
                sx={{ 
                  mt: 6,
                  p: 4,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: 1
                  }
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  To keep everyday people safe, informed, and empowered.
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default WhoWeAreSection; 