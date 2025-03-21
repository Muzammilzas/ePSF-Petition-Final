import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Left section - Logo */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
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

        {/* Right section - Buttons based on user status */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {isAdmin ? (
            /* Admin buttons for logged in users */
            <>
              <Button
                component={RouterLink}
                to="/admin/dashboard"
                sx={{
                  color: '#01BD9B',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                DASHBOARD
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outlined"
                sx={{
                  borderColor: '#01BD9B',
                  color: '#01BD9B',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  px: 3,
                  '&:hover': {
                    borderColor: '#01BD9B',
                    backgroundColor: 'rgba(1, 189, 155, 0.04)',
                  },
                }}
              >
                SIGN OUT
              </Button>
            </>
          ) : (
            /* Links for non-logged in users */
            <>
              <Button
                component="a"
                href="https://epublicsf.org/donation"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#fff',
                  bgcolor: '#E0AC3F',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  py: 0.7,
                  px: 2,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#c99a38',
                  },
                }}
              >
                Donate Now
              </Button>
              <Button
                component="a"
                href="https://epublicsf.org/volunteer/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#fff',
                  bgcolor: '#01BD9B',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  py: 0.7,
                  px: 2,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#00a589',
                  },
                }}
              >
                Get Involved
              </Button>
              <Button
                component="a"
                href="https://epublicsf.org/report-scams/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#fff',
                  bgcolor: '#01BD9B',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  py: 0.7,
                  px: 2,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#00a589',
                  },
                }}
              >
                Report a Scam
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 