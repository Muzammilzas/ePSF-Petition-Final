import React, { useEffect } from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SuccessMessage: React.FC = () => {
  useEffect(() => {
    // Google Analytics event tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'G-4F6WJQT672',
        'event_category': 'form',
        'event_label': 'report_scam',
        'value': 1.0,
        'currency': 'USD'
      });
    }
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        minHeight: '100vh',
        py: 8,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 6 }, 
            borderRadius: 2,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <CheckCircleOutlineIcon 
            color="success" 
            sx={{ fontSize: 64, mb: 2 }} 
          />
          <Typography variant="h3" component="h1" color="primary" gutterBottom id="report-scam-success-message">
            Thank you. Your story matters.
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: 600 }} color="secondary" id="report-scam-success-description">
            Your report has been submitted successfully.
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600 }}>
            You've taken an important step to protect others and help stop timeshare scams from spreading.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SuccessMessage; 