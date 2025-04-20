import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button,
  useTheme,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../common/animations';
import { RIGHTS_CONTENT } from '../common/constants';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const KnowYourRightsSection: React.FC = () => {
  const theme = useTheme();

  const cards = [
    {
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      title: "Where Timeshare Scams Thrive",
      description: "5 states with the weakest protections — and how they leave buyers at risk."
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Before You Sign a Contract",
      description: "Learn what to check, what to question, and what to avoid before you're locked in. Understand why timeshares are hard to sell and how to avoid long-term regrets."
    },
    {
      icon: <WarningIcon sx={{ fontSize: 40 }} />,
      title: "Spotting Exit Scams",
      description: "How to tell if a timeshare exit service is legitimate — or just another scam."
    }
  ];

  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div variants={fadeInUp}>
              <Typography 
                variant="h2" 
                component="h2"
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Stay Informed. Stay Protected.
              </Typography>
              
              <Typography 
                variant="h5"
                sx={{ 
                  color: 'text.secondary',
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 2
                }}
              >
                Most people don't know they're walking into a trap — until it's too late.
              </Typography>

              <Typography 
                variant="h6"
                sx={{ 
                  color: 'text.secondary',
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 6
                }}
              >
                That's why we created these quick, must-read fact sheets to help you avoid the most common timeshare scams.
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            {cards.map((card, index) => (
              <Grid item xs={12} md={4} key={index} sx={{ display: 'flex' }}>
                <motion.div variants={fadeInUp} style={{ width: '100%' }}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2
                    }}>
                      <Box sx={{ 
                        color: theme.palette.primary.main
                      }}>
                        {card.icon}
                      </Box>
                      <Typography 
                        variant="h5"
                        sx={{ 
                          fontWeight: 600,
                          flex: 1
                        }}
                      >
                        {card.title}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      sx={{ 
                        color: 'text.secondary',
                        mb: 3,
                        flex: 1
                      }}
                    >
                      {card.description}
                    </Typography>

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        mt: 'auto',
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        py: 1.5,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark
                        }
                      }}
                    >
                      Stay Informed. Stay Protected.
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ 
            textAlign: 'center',
            mt: 8
          }}>
            <motion.div variants={fadeInUp}>
              <Typography
                sx={{
                  color: 'text.secondary',
                  maxWidth: '900px',
                  mx: 'auto',
                  mb: 4
                }}
              >
                These resources are free, easy to understand, and made to help you protect yourself and your family
                — especially if you're wondering how can you get rid of a timeshare or need a trusted timeshare
                attorney.
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default KnowYourRightsSection;