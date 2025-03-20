import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GavelIcon from '@mui/icons-material/Gavel';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { sectionStyles, colors } from '../styles';

interface Problem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Problem: React.FC = () => {
  const problems: Problem[] = [
    {
      icon: <ErrorOutlineIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Scams and Fraud',
      description: 'Companies trick owners into bad deals with misleading information and hidden fees.',
    },
    {
      icon: <WarningAmberIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Limited Cancellation Rights',
      description: "Once you sign, you're trapped in an unwanted contract with virtually no way out.",
    },
    {
      icon: <GavelIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Short Rescission Period',
      description: 'The legal timeframe to cancel is unfairly brief, often passing before issues are discovered.',
    },
    {
      icon: <MoneyOffIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Aggressive Promotions',
      description: 'High-pressure sales tactics hide the truth and rush you into decisions.',
    }
  ];

  return (
    <Box id="learn-more" sx={{
      ...sectionStyles.section,
      bgcolor: colors.background.gold,
      py: { xs: 10, md: 12 },
    }}>
      <Container sx={sectionStyles.container}>
        <Box sx={{ position: 'relative', zIndex: 1, mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              ...sectionStyles.heading,
              color: colors.text.dark,
              mb: 2,
            }}
          >
            Timeshare Owners Denied Their Rights
          </Typography>
          <Typography
            sx={{
              ...sectionStyles.subheading,
              color: colors.text.dark,
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.8,
            }}
          >
            As a consumer, you have rights—but timeshare companies often deny these basic principles.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Box sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80"
                  alt="Timeshare rights denied"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {problems.map((problem, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                    }}>
                      {problem.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Ubuntu, sans-serif',
                          fontWeight: 600,
                          mb: 1,
                          color: colors.text.dark,
                        }}
                      >
                        {problem.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: colors.text.dark,
                          lineHeight: 1.6,
                          opacity: 0.8,
                        }}
                      >
                        {problem.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
              <Typography
                sx={{
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: colors.text.dark,
                  opacity: 0.9,
                  textAlign: 'center',
                  mt: 2,
                }}
              >
                This isn't right. You deserve better—and we're here to help.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Problem; 