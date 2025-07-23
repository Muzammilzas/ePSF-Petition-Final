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
  const [dropdownOpen, setDropdownOpen] = useState(false); // desktop dropdown
  const [scamDropdownOpen, setScamDropdownOpen] = useState(false); // mobile collapsible
  const [dropdownHover, setDropdownHover] = useState(false); // sticky hover for dropdown
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
          text: 'ANALYTICS',
          link: '/admin/analytics',
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
          text: 'SCAM REPORTS',
          link: '/admin/scam-reports',
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
      // New public navigation structure
      return [
        {
          text: 'Home',
          link: '/',
          variant: 'text',
          sx: {
            color: '#01BD9B', fontWeight: 600, fontSize: '1rem', textTransform: 'none', '&:hover': { color: '#fff', backgroundColor: '#01BD9B' },
          }
        },
        {
          text: 'Sign Petition',
          link: '/petition',
          variant: 'text',
          sx: {
            color: '#01BD9B', fontWeight: 600, fontSize: '1rem', textTransform: 'none', '&:hover': { color: '#fff', backgroundColor: '#01BD9B' },
          }
        },
        // Scam Resources will be rendered after Sign Petition
        {
          text: 'Consumer Rights',
          link: '/consumer-rights',
          variant: 'text',
          sx: {
            color: '#01BD9B', fontWeight: 600, fontSize: '1rem', textTransform: 'none', '&:hover': { color: '#fff', backgroundColor: '#01BD9B' },
          }
        },
        {
          text: 'Donate',
          link: '/donate',
          variant: 'text',
          sx: {
            color: '#01BD9B', fontWeight: 600, fontSize: '1rem', textTransform: 'none', '&:hover': { color: '#fff', backgroundColor: '#01BD9B' },
          }
        },
        {
          text: 'Report a Scam',
          link: '/report-scam',
          variant: 'text',
          sx: {
            color: '#01BD9B', fontWeight: 600, fontSize: '1rem', textTransform: 'none', '&:hover': { color: '#fff', backgroundColor: '#01BD9B' },
          }
        },
        // Dropdown for Scam Resources handled separately in render
      ];
    }
  };

  // Scam Resources dropdown items
  const scamResources = [
    { text: 'Timeshare Scam', link: '/timeshare-scam' },
    { text: 'Timeshare Scam Checklist', link: '/timeshare-scam-checklist' },
    { text: 'How Timeshare Scams Work', link: '/how-timeshare-scams-work' },
    { text: 'Timeshare Scam Awareness', link: '/timeshare-scam-awareness' },
  ];

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
        {/* Scam Resources collapsible section for mobile */}
        <ListItem sx={{ mb: 1, display: 'block' }}>
          <Box sx={{ width: '100%' }}>
            <Button
              fullWidth
              variant="text"
              sx={{ color: '#01BD9B', fontWeight: 600, fontSize: '1rem', textTransform: 'none', justifyContent: 'flex-start', backgroundColor: scamDropdownOpen ? 'rgba(1,189,155,0.08)' : 'transparent', '&:hover': { color: '#fff', backgroundColor: '#01BD9B' } }}
              onClick={() => setScamDropdownOpen((open) => !open)}
            >
              Scam Resources
            </Button>
            {scamDropdownOpen && (
              <List sx={{ pl: 2 }}>
                {scamResources.map((item, idx) => (
                  <ListItem key={idx} sx={{ p: 0 }}>
                    <Button
                      component={RouterLink}
                      to={item.link}
                      variant="text"
                      fullWidth
                      sx={{ color: '#01BD9B', fontWeight: 500, fontSize: '0.95rem', textTransform: 'none', justifyContent: 'flex-start', '&:hover': { color: '#fff', backgroundColor: '#01BD9B' } }}
                    >
                      {item.text}
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </ListItem>
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
            {/* Home and Sign Petition */}
            {getNavigationItems().slice(0,2).map((item, index) => (
              'action' in item ? (
                <Button
                  key={index}
                  onClick={item.action}
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
            {/* Scam Resources dropdown for desktop */}
            <Box
              sx={{ position: 'relative' }}
              onMouseEnter={() => { setDropdownOpen(true); setDropdownHover(true); }}
              onMouseLeave={() => { setDropdownHover(false); setTimeout(() => { if (!dropdownHover) setDropdownOpen(false); }, 100); }}
            >
              <Button
                variant="text"
                sx={{ color: '#01BD9B', fontWeight: 600, fontSize: '1rem', textTransform: 'none', backgroundColor: dropdownOpen ? 'rgba(1,189,155,0.08)' : 'transparent', '&:hover': { color: '#fff', backgroundColor: '#01BD9B' } }}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                Scam Resources
              </Button>
              {dropdownOpen && (
                <Box
                  onMouseEnter={() => { setDropdownOpen(true); setDropdownHover(true); }}
                  onMouseLeave={() => { setDropdownHover(false); setTimeout(() => { if (!dropdownHover) setDropdownOpen(false); }, 100); }}
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    bgcolor: '#fff',
                    boxShadow: 3,
                    borderRadius: 1,
                    minWidth: { xs: 220, sm: 260 },
                    maxWidth: '90vw',
                    zIndex: 10,
                    p: { xs: 1, sm: 1.5 },
                    mt: 1,
                    overflow: 'auto',
                  }}
                >
                  <List sx={{ p: 0, m: 0 }}>
                    {scamResources.map((item, idx) => (
                      <ListItem key={idx} sx={{ p: 0, mb: 0.5, '&:last-child': { mb: 0 } }}>
                        <Button
                          component={RouterLink}
                          to={item.link}
                          variant="text"
                          sx={{
                            color: '#01BD9B',
                            fontWeight: 500,
                            fontSize: { xs: '1rem', sm: '1.05rem' },
                            textTransform: 'none',
                            justifyContent: 'flex-start',
                            width: '100%',
                            px: 3,
                            py: 1.2,
                            borderRadius: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            '&:hover': { color: '#fff', backgroundColor: '#01BD9B' },
                          }}
                        >
                          {item.text}
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
            {/* The rest of the menu */}
            {getNavigationItems().slice(2).map((item, index) => (
              'action' in item ? (
                <Button
                  key={index+2}
                  onClick={item.action}
                  variant={item.variant}
                  sx={item.sx}
                >
                  {item.text}
                </Button>
              ) : (
                <Button
                  key={index+2}
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