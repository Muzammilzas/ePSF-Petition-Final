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
  image: string;
}

const Problem: React.FC = () => {
  const problems: Problem[] = [
    {
      icon: <ErrorOutlineIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Scams and Fraud',
      description: 'Companies trick owners into bad deals with misleading information and hidden fees.',
      image: '/images/Scams and Fraud.png'
    },
    {
      icon: <WarningAmberIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Limited Cancellation Rights',
      description: "Once you sign, you're trapped in an unwanted contract with virtually no way out.",
      image: '/images/Limited Cancellation Rights.png'
    },
    {
      icon: <GavelIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Short Rescission Period',
      description: 'The legal timeframe to cancel is unfairly brief, often passing before issues are discovered.',
      image: '/images/Short Rescission Period.png'
    },
    {
      icon: <MoneyOffIcon sx={{ fontSize: 40, color: colors.destructive }} />,
      title: 'Aggressive Promotions',
      description: 'High-pressure sales tactics hide the truth and rush you into decisions.',
      image: '/images/Aggressive Promotions.png'
    }
  ];

  return (
    <Box id="learn-more" sx={{
      ...sectionStyles.section,
      bgcolor: colors.primary,
      py: { xs: 10, md: 12 },
    }}>
      <Container sx={sectionStyles.container}>
        <Box sx={{ position: 'relative', zIndex: 1, mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              ...sectionStyles.heading,
              color: '#fff',
              mb: 2,
            }}
          >
            Timeshare Owners Denied Their Rights
          </Typography>
          <Typography
            sx={{
              ...sectionStyles.subheading,
              color: '#fff',
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.9,
            }}
          >
            As a consumer, you have rights—but timeshare companies often deny these basic principles.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/sec-section.webp"
              alt="Timeshare rights denied"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {problems.map((problem, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 2,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box 
                      sx={{
                        width: 60,
                        height: 60,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        component="img"
                        src={problem.image}
                        alt={problem.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
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
                  color: '#fff',
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