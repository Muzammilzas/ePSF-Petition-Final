import React from 'react';
import { Box, Container, Button, AppBar, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { sectionStyles, colors } from '../styles';

const Navbar: React.FC = () => {
  const navLinks = [
    { text: 'To Process', href: '/to-process' },
    { text: 'My Mission', href: '/my-mission' },
    { text: 'My Help', href: '/my-help' },
    { text: 'Sign Process', href: '/sign-process' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'transparent',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container sx={sectionStyles.container}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="ePublic Safety Foundation"
              sx={{ height: 40 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 4 }}>
            {navLinks.map((link, index) => (
              <Button
                key={index}
                component={Link}
                to={link.href}
                sx={{
                  color: colors.text.primary,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    color: colors.primary,
                  },
                }}
              >
                {link.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 