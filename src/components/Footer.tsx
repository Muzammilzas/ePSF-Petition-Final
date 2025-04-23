import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
          © {new Date().getFullYear()} Timeshare Petition Platform. All rights reserved.
          {' • '}
          <Link
            component={RouterLink}
            to="/privacy-policy"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Privacy Policy
          </Link>
          {' • '}
          <Link
            component={RouterLink}
            to="/data-deletion-request"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Data Deletion Request
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          ePSF is proudly sponsored by{' '}
          <Link
            href="https://ezverifi.com/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            eZverifi
          </Link>
          .
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 