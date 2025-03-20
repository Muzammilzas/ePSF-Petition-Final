import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid } from '@mui/material';

const Plan: React.FC = () => {
  const steps = [
    {
      title: 'Sign Our Petition',
      description: 'Demand timeshare scam prevention and fair laws with one click.'
    },
    {
      title: 'Unite as Owners',
      description: 'Join our timeshare owners group to amplify your voice.'
    },
    {
      title: 'Secure Your Rights',
      description: 'Push for stronger cancellation rights and a fair rescission period.'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'primary.light', py: 8 }}>
      <Container>
        <Typography variant="h3" sx={{ mb: 6, fontWeight: 'bold', textAlign: 'center' }}>
          3 Steps to Reclaim Your Consumer Rights
        </Typography>
        <Grid container spacing={4} sx={{ maxWidth: 'lg', mx: 'auto' }}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 96, 
                  height: 96, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {index + 1}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {step.title}
                </Typography>
                <Typography>
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            component={Link}
            to="/sign-petition"
            variant="contained"
            color="primary"
            size="large"
            sx={{ py: 1.5, px: 4 }}
          >
            Add Your Name
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Plan; 