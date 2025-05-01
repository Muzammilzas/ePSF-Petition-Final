import React from 'react';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { trackButtonClick } from '../../../services/googleAnalytics';

const SignPetitionSection: React.FC = () => {
  const theme = useTheme();

  const handleClick = () => {
    trackButtonClick('sign_petition_section');
  };

  return (
    <Box sx={{ 
      py: { xs: 10, md: 15 },
      bgcolor: 'background.paper',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          textAlign: 'center',
          position: 'relative'
        }}>
          <Typography 
            variant="h2" 
            component="h2"
            sx={{ 
              fontWeight: 800,
              color: theme.palette.secondary.main,
              mb: 4,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Sign the Petition
          </Typography>

          <Typography 
            variant="body1"
            sx={{ 
              mb: 6,
              fontSize: '1.25rem',
              lineHeight: 1.8,
              maxWidth: '800px',
              mx: 'auto',
              color: theme.palette.text.secondary
            }}
          >
            Help us demand new laws that protect consumers from deceptive practices — especially in timeshare sales, inheritance scams, and other financial traps targeting the vulnerable. We're calling on lawmakers to step in and finally hold bad actors accountable.
          </Typography>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxWidth: '800px',
            mx: 'auto',
            mb: 6,
            p: 4,
            borderLeft: `4px solid ${theme.palette.secondary.main}`,
            bgcolor: `${theme.palette.secondary.main}10`
          }}>
            <Typography 
              variant="h5"
              sx={{ 
                color: theme.palette.secondary.main,
                fontWeight: 600,
                textAlign: 'left'
              }}
            >
              Your voice matters — and your signature helps make it louder.
            </Typography>

            <Typography 
              variant="h5"
              sx={{ 
                color: theme.palette.secondary.main,
                fontWeight: 600,
                textAlign: 'left'
              }}
            >
              Your voice is power. One signature can help protect thousands.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/petition"
            variant="contained"
            size="large"
            onClick={handleClick}
            sx={{
              bgcolor: theme.palette.secondary.main,
              color: 'white',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                bgcolor: theme.palette.secondary.dark
              }
            }}
          >
            Sign the Petition Now to be part of the change.
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SignPetitionSection; 