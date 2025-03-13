import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <Link to="/">
              <img 
                src="/your-logo.png" 
                alt="ePSF Logo" 
                style={{ 
                  height: '40px',
                  width: 'auto',
                }} 
              />
            </Link>
          ) : (
            <img 
              src="/your-logo.png" 
              alt="ePSF Logo" 
              style={{ 
                height: '40px',
                width: 'auto',
              }} 
            />
          )}
        </Box>
        
        <Box>
          {user && isAdmin && (
            <Button 
              color="primary" 
              variant="contained"
              onClick={() => navigate('/admin/dashboard')}
              sx={{ 
                color: '#FFFFFF',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#01a989' // Slightly darker shade for hover
                }
              }}
            >
              Admin Dashboard
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 