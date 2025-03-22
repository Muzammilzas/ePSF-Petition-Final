import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, useMediaQuery, useTheme, SxProps, Theme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Define types for navigation items
type NavItemBase = {
  text: string;
  variant: 'text' | 'outlined' | 'contained';
  sx: SxProps<Theme>;
};

type NavItemWithLink = NavItemBase & {
  link: string;
  external?: boolean;
  action?: undefined;
};

type NavItemWithAction = NavItemBase & {
  action: () => void;
  link?: undefined;
  external?: undefined;
};

type NavItem = NavItemWithLink | NavItemWithAction;

const Navigation: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Navigation links based on user status
  const getNavigationItems = (): NavItem[] => {
    if (isAdmin) {
      return [
        {
          text: 'DASHBOARD',
          link: '/admin/dashboard',
          variant: 'text',
          sx: {
            color: '#01BD9B',
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            width: isMobile ? '100%' : 'auto',
          }
        },
        {
          text: 'SIGN OUT',
          action: handleSignOut,
          variant: 'outlined',
          sx: {
            borderColor: '#01BD9B',
            color: '#01BD9B',
            borderRadius: '4px',
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            px: 3,
            width: isMobile ? '100%' : 'auto',
            '&:hover': {
              borderColor: '#01BD9B',
              backgroundColor: 'rgba(1, 189, 155, 0.04)',
            },
          }
        }
      ];
    } else {
      return [
        {
          text: 'Donate Now',
          link: 'https://epublicsf.org/donation',
          external: true,
          variant: 'contained',
          sx: {
            color: '#fff',
            bgcolor: '#E0AC3F',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 500,
            py: 0.7,
            px: 2,
            textTransform: 'none',
            width: isMobile ? '100%' : 'auto',
            mb: isMobile ? 1 : 0,
            '&:hover': {
              bgcolor: '#c99a38',
            },
          }
        },
        {
          text: 'Get Involved',
          link: 'https://epublicsf.org/volunteer/',
          external: true,
          variant: 'contained',
          sx: {
            color: '#fff',
            bgcolor: '#01BD9B',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 500,
            py: 0.7,
            px: 2,
            textTransform: 'none',
            width: isMobile ? '100%' : 'auto',
            mb: isMobile ? 1 : 0,
            '&:hover': {
              bgcolor: '#00a589',
            },
          }
        },
        {
          text: 'Report a Scam',
          link: 'https://epublicsf.org/report-scams/',
          external: true,
          variant: 'contained',
          sx: {
            color: '#fff',
            bgcolor: '#01BD9B',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 500,
            py: 0.7,
            px: 2,
            textTransform: 'none',
            width: isMobile ? '100%' : 'auto',
            '&:hover': {
              bgcolor: '#00a589',
            },
          }
        }
      ];
    }
  };

  // Mobile drawer content
  const drawer = (
    <Box
      sx={{ width: 250, p: 2 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {getNavigationItems().map((item, index) => (
          <ListItem key={index} sx={{ mb: 1, display: 'block' }}>
            {'action' in item ? (
              <Button
                onClick={item.action}
                variant={item.variant}
                fullWidth
                sx={item.sx}
              >
                {item.text}
              </Button>
            ) : 'external' in item && item.external ? (
              <Button
                component="a"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                variant={item.variant}
                fullWidth
                sx={item.sx}
              >
                {item.text}
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to={item.link as string}
                variant={item.variant}
                fullWidth
                sx={item.sx}
              >
                {item.text}
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 3 } }}>
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
              height: isMobile ? '32px' : '40px',
              width: 'auto',
            }} 
          />
        </Box>

        {/* Right section - Buttons or Hamburger based on screen size */}
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{ color: '#333' }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {getNavigationItems().map((item, index) => (
              'action' in item ? (
                <Button
                  key={index}
                  onClick={item.action}
                  variant={item.variant}
                  sx={item.sx}
                >
                  {item.text}
                </Button>
              ) : 'external' in item && item.external ? (
                <Button
                  key={index}
                  component="a"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={item.variant}
                  sx={item.sx}
                >
                  {item.text}
                </Button>
              ) : (
                <Button
                  key={index}
                  component={RouterLink}
                  to={item.link}
                  variant={item.variant}
                  sx={item.sx}
                >
                  {item.text}
                </Button>
              )
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 