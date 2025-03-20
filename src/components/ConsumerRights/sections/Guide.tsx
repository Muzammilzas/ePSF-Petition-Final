import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import GroupsIcon from '@mui/icons-material/Groups';
import GavelIcon from '@mui/icons-material/Gavel';
import { sectionStyles, colors } from '../styles';

const Guide: React.FC = () => {
  const features = [
    {
      icon: <ShieldIcon sx={{ fontSize: 48, color: colors.primary }} />,
      title: 'Consumer Protection',
      description: 'We advocate for stronger regulations and oversight in the timeshare industry to protect your rights and interests.',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 48, color: colors.primary }} />,
      title: 'Community Support',
      description: 'Join a network of timeshare owners working together to create positive change in the industry.',
    },
    {
      icon: <GavelIcon sx={{ fontSize: 48, color: colors.primary }} />,
      title: 'Legal Advocacy',
      description: 'We push for legal reforms to ensure fair treatment and transparent practices in timeshare operations.',
    }
  ];

  return (
    <Box sx={{
      bgcolor: colors.background.accent,
      py: { xs: 8, md: 12 },
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      }} />

      <Container sx={sectionStyles.container}>
        <Box sx={{ position: 'relative', zIndex: 1, mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              ...sectionStyles.heading,
              color: colors.text.primary,
              mb: 2,
            }}
          >
            How We Fight for Your Rights
          </Typography>
          <Typography
            sx={{
              ...sectionStyles.subheading,
              color: colors.text.secondary,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            At ePublic Safety Foundation, we're dedicated to protecting consumer rights through multiple channels.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  ...sectionStyles.card,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '150px',
                  height: '150px',
                  background: `linear-gradient(135deg, ${colors.primary}10, transparent)`,
                  borderRadius: '0 0 0 100%',
                }} />
                
                <Box 
                  sx={{ 
                    mb: 3,
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: `${colors.primary}10`,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: 'Ubuntu, sans-serif',
                    mb: 2,
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  sx={{ 
                    ...sectionStyles.bodyText,
                    color: colors.text.secondary,
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: colors.primary,
              color: colors.text.light,
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              maxWidth: '800px',
              mx: 'auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: `linear-gradient(135deg, ${colors.secondary}40, transparent)`,
              borderRadius: '0 0 0 100%',
            }} />
            
            <Box sx={{ position: 'relative' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontFamily: 'Ubuntu, sans-serif',
                  mb: 2,
                  fontWeight: 700 
                }}
              >
                Join Our Movement
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '1.125rem',
                  opacity: 0.9,
                  mb: 0,
                }}
              >
                Together, we can create lasting change in the timeshare industry and protect consumer rights for generations to come.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Guide; 