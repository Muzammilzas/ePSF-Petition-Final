import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { sectionStyles, colors } from '../styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Success: React.FC = () => {
  return (
    <Box sx={{
      ...sectionStyles.section,
      bgcolor: colors.background.light,
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        background: `linear-gradient(135deg, ${colors.primary}, transparent)`,
      }} />

      <Container sx={sectionStyles.container}>
        <Box sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '800px',
          mx: 'auto',
        }}>
          <CheckCircleIcon sx={{
            fontSize: '5rem',
            color: colors.primary,
            mb: 3,
          }} />

          <Typography
            variant="h2"
            sx={{
              ...sectionStyles.heading,
              mb: 3,
            }}
          >
            Thank You for Taking Action!
          </Typography>

          <Typography
            sx={{
              fontSize: '1.25rem',
              lineHeight: 1.6,
              mb: 4,
              color: colors.text.secondary,
            }}
          >
            Your signature has been added to our petition. Together, we're making a difference
            in protecting consumer rights in the timeshare industry. We'll keep you updated
            on our progress and next steps.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/share"
              variant="contained"
              sx={{
                bgcolor: colors.primary,
                color: colors.text.light,
                px: 4,
                py: 1.5,
                fontSize: '1.125rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: `${colors.primary}E6`,
                },
              }}
            >
              Share with Others
            </Button>
            <Button
              component={Link}
              to="/"
              variant="outlined"
              sx={{
                borderColor: colors.primary,
                color: colors.primary,
                px: 4,
                py: 1.5,
                fontSize: '1.125rem',
                fontWeight: 500,
                '&:hover': {
                  borderColor: colors.primary,
                  bgcolor: 'rgba(1, 189, 155, 0.1)',
                },
              }}
            >
              Return Home
            </Button>
          </Box>

          <Box sx={{
            mt: 6,
            p: 3,
            ...sectionStyles.glassmorphism,
            bgcolor: colors.background.light,
          }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Ubuntu, sans-serif',
                fontWeight: 600,
                mb: 2,
              }}
            >
              What's Next?
            </Typography>
            <Typography sx={{ color: colors.text.secondary }}>
              We'll send you updates about the petition's progress and ways you can
              further support the cause. Make sure to check your email and follow us
              on social media for the latest news.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Success; 