import React from 'react';
import { Box, Container, Typography, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../common/animations';
import { FINAL_CTA } from '../common/constants';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { trackButtonClick } from '../../../services/googleAnalytics';

const CallToActionSection: React.FC = () => {
  const handleClick = () => {
    trackButtonClick('sign_petition_cta');
  };

  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #01BD9B 0%, #01BD9B 40%, #E0AC3F 100%)',
        color: 'white',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/images/pattern.png)',
          opacity: 0.1,
          zIndex: 1
        }
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Typography 
              variant="h2" 
              component="h2" 
              textAlign="center" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 6
              }}
            >
              {FINAL_CTA.title}
            </Typography>

            <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 6 }}>
              <List>
                {FINAL_CTA.actions.map((action, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={action}
                      primaryTypographyProps={{
                        sx: { 
                          fontSize: '1.2rem',
                          color: 'white',
                          opacity: 0.9
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Typography 
              variant="h5" 
              textAlign="center" 
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                mb: 6,
                opacity: 0.9,
                fontWeight: 600
              }}
            >
              {FINAL_CTA.conclusion}
            </Typography>

            <Box sx={{ textAlign: 'center' }}>
              <Button
                component={Link}
                to="/petition"
                variant="contained"
                size="large"
                onClick={handleClick}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  backgroundColor: 'white',
                  color: '#01BD9B',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  }
                }}
              >
                Sign the Petition Now
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CallToActionSection; 