import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { sectionStyles, colors } from '../styles';

const Footer: React.FC = () => {
  const quickLinks = [
    { text: 'Start Here', href: '/start-here' },
    { text: 'About Us', href: '/about' },
    { text: 'Our Team', href: '/team' },
    { text: 'Contact', href: '/contact' },
    { text: 'Help Desk', href: '/help' },
  ];

  const updates = [
    { text: 'Latest News', href: '/news' },
    { text: 'Press Room', href: '/press' },
    { text: 'Blog', href: '/blog' },
    { text: 'FAQ', href: '/faq' },
    { text: 'Terms of Use', href: '/terms' },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: 'https://facebook.com' },
    { icon: <TwitterIcon />, href: 'https://twitter.com' },
    { icon: <LinkedInIcon />, href: 'https://linkedin.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: colors.background.light,
        py: 6,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container sx={sectionStyles.container}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box
                component="img"
                src="/assets/logo.png"
                alt="ePublic Safety Foundation"
                sx={{ height: 40 }}
              />
            </Box>
            <Typography sx={{ color: colors.text.secondary, mb: 2 }}>
              Protecting consumers by advocating for stronger rights and fair treatment in the timeshare industry.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {socialLinks.map((social, index) => (
                <MuiLink
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: colors.text.secondary,
                    '&:hover': {
                      color: colors.primary,
                    },
                  }}
                >
                  {social.icon}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Ubuntu, sans-serif',
                fontWeight: 600,
                mb: 3,
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link, index) => (
                <MuiLink
                  key={index}
                  href={link.href}
                  sx={{
                    color: colors.text.secondary,
                    textDecoration: 'none',
                    display: 'block',
                    '&:hover': {
                      color: colors.primary,
                    },
                  }}
                >
                  {link.text}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Ubuntu, sans-serif',
                fontWeight: 600,
                mb: 3,
              }}
            >
              Updates
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {updates.map((link, index) => (
                <MuiLink
                  key={index}
                  href={link.href}
                  sx={{
                    color: colors.text.secondary,
                    textDecoration: 'none',
                    display: 'block',
                    '&:hover': {
                      color: colors.primary,
                    },
                  }}
                >
                  {link.text}
                </MuiLink>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            color: colors.text.secondary,
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} ePublic Safety Foundation. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 