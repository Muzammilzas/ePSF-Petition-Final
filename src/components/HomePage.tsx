import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreatePetition = () => {
    navigate('/create-petition');
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <img 
            src="/your-logo.png" 
            alt="ePSF Logo" 
            style={{ 
              height: '60px',
              width: 'auto',
            }} 
          />
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Welcome to ePSF Timeshare Reform Petition
        </Typography>
        
        <Typography variant="body1" paragraph>
          Join our movement to reform timeshare laws and protect consumers from predatory practices. 
          Create a petition to advocate for change in your community.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreatePetition}
          sx={{ mt: 2 }}
        >
          Create a Petition
        </Button>
        
        {/* Admin Login Link */}
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #eee' }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Administrator Access
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('/admin/login')}
            sx={{ 
              backgroundColor: '#E0AC3F',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#c99a38'
              }
            }}
          >
            Admin Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage; 