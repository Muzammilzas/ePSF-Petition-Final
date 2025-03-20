import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GavelIcon from '@mui/icons-material/Gavel';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { sectionStyles, colors } from '../styles';

const Problem: React.FC = () => {
  const problems = [
    {
      icon: <ErrorOutlineIcon sx={{ fontSize: 40, color: colors.primary }} />,
      title: 'Deceptive Sales Tactics',
      description: 'High-pressure sales presentations and misleading information about benefits and costs.',
    },
    {
      icon: <WarningAmberIcon sx={{ fontSize: 40, color: colors.primary }} />,
      title: 'Contract Traps',
      description: 'Complex contracts with hidden fees and unfair terms designed to lock you in.',
    },
    {
      icon: <GavelIcon sx={{ fontSize: 40, color: colors.primary }} />,
      title: 'Limited Legal Recourse',
      description: 'Restrictive clauses that make it difficult to seek justice when wronged.',
    },
    {
      icon: <MoneyOffIcon sx={{ fontSize: 40, color: colors.primary }} />,
      title: 'Financial Burden',
      description: 'Escalating maintenance fees and unexpected costs that strain your finances.',
    }
  ];

  return (
    <Box sx={{
      bgcolor: colors.background.light,
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
            Timeshare Owners Denied Their Rights
          </Typography>
          <Typography
            sx={{
              ...sectionStyles.subheading,
              color: colors.text.secondary,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            We've identified key issues that timeshare owners face when their consumer rights are violated.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {problems.map((problem, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  ...sectionStyles.card,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: `linear-gradient(135deg, ${colors.primary}10, transparent)`,
                  borderRadius: '0 0 0 100%',
                }} />
                
                <Box sx={{ mb: 2 }}>
                  {problem.icon}
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
                  {problem.title}
                </Typography>
                <Typography 
                  sx={{ 
                    ...sectionStyles.bodyText,
                    color: colors.text.secondary,
                  }}
                >
                  {problem.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: colors.primary,
              color: colors.text.light,
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
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
                It's Time for Change
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: 'Roboto, sans-serif',
                  maxWidth: '800px',
                  fontSize: '1.125rem',
                  opacity: 0.9,
                }}
              >
                These practices have gone unchecked for too long. By signing our petition, you join thousands of others demanding stronger consumer protections and accountability in the timeshare industry.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Problem; 