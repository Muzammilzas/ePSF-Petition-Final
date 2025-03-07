import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#F0F1F2',
        boxShadow: 'none'  // Remove shadow for a cleaner look
      }}
    >
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <img 
            src="/your-logo.png" 
            alt="ePSF Logo" 
            style={{ 
              height: '40px',
              width: 'auto',
            }} 
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 