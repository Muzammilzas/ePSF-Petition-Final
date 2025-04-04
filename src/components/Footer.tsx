import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

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