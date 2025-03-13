import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" color="error" gutterBottom>
          Access Denied
        </Typography>
        
        <Typography variant="body1" paragraph>
          You do not have permission to access this page. This area is restricted to administrators only.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Unauthorized; 