import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  LinearProgress,
  TextField,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleSignPetition = () => {
    navigate('/sign/1'); // Replace with your actual petition ID
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/images/timeshare-hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Tired of Timeshare Scams and Unfair Contracts?
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            You Deserve Fairness—Sign Our Petition to Fight Back
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleSignPetition}
            sx={{
              fontSize: '1.2rem',
              py: 2,
              px: 4,
              backgroundColor: '#01BD9B',
              '&:hover': {
                backgroundColor: '#01a989',
              },
            }}
          >
            Sign Now
          </Button>
        </Container>
      </Box>

      {/* Problem Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                The Timeshare Trap Is Real
              </Typography>
              <Typography variant="body1" paragraph>
                You've been hit with high-pressure sales, hidden fees, and promises that vanish. 
                Timeshare fraud locks you in, while short rescission periods and limited cancellation 
                rights leave you stuck. These shady promotions exploit owners like you every day. 
                It's not just unfair—it's wrong.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, bgcolor: 'error.light', color: 'white' }}>
                <Typography variant="h4" gutterBottom>
                  The Reality:
                </Typography>
                <Typography variant="h6" component="div" gutterBottom>
                  • 85% of buyers regret their purchase
                </Typography>
                <Typography variant="h6" component="div" gutterBottom>
                  • Only 3-10 days to rescind
                </Typography>
                <Typography variant="h6" component="div">
                  • Thousands trapped in contracts
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Guide Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <img 
                src="/your-logo.png" 
                alt="ePublic Safety Foundation" 
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                Meet Your Ally: ePublic Safety Foundation
              </Typography>
              <Typography variant="body1" paragraph>
                We're the nonprofit fighting for timeshare owners like you. With years of advocacy, 
                we've seen the scams and heard the stories. Now, we're leading the charge with a 
                petition to stop timeshare fraud and demand fair laws.
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                Trust us to guide this movement—you're in good hands.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Plan Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom align="center">
            Our 3-Step Plan to Protect You
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              {
                title: '1. Sign the Petition',
                description: 'Add your name to demand timeshare scam prevention and stronger cancellation rights.',
                icon: '✍️'
              },
              {
                title: '2. Join the Owners Group',
                description: 'Unite with thousands in our timeshare owners group to amplify your voice.',
                icon: '👥'
              },
              {
                title: '3. Push for Change',
                description: "We'll deliver your signatures to lawmakers for a fair rescission period and real protections.",
                icon: '⚖️'
              }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h1" align="center" sx={{ mb: 2 }}>
                      {step.icon}
                    </Typography>
                    <Typography variant="h5" component="h3" gutterBottom align="center">
                      {step.title}
                    </Typography>
                    <Typography variant="body1" align="center">
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: '#01BD9B', color: 'white' }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom align="center">
            Take Action: Sign Today
          </Typography>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
            Your Signature Can End Timeshare Fraud
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSignPetition}
              sx={{
                fontSize: '1.2rem',
                py: 2,
                px: 4,
                bgcolor: 'white',
                color: '#01BD9B',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Sign the Petition Now
            </Button>
          </Box>
          <Box sx={{ mt: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={30} 
              sx={{ 
                height: 20, 
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white',
                }
              }} 
            />
            <Typography variant="body1" align="center" sx={{ mt: 1 }}>
              3,000 of 10,000 signatures collected
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Success Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                Imagine a Fair Timeshare Future
              </Typography>
              <Typography variant="body1" paragraph>
                Picture this: No more scams. Clear cancellation rights. A rescission period that 
                gives you time to think. With your signature, we'll win tougher laws and peace 
                of mind for timeshare owners everywhere.
              </Typography>
              <Typography variant="h6" color="primary">
                You'll be part of a victory that changes lives!
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  bgcolor: '#01BD9B',
                  color: 'white',
                  borderRadius: 2
                }}
              >
                <Typography variant="h4" gutterBottom>
                  What We'll Achieve Together:
                </Typography>
                <Typography variant="body1" component="div" paragraph>
                  ✓ Extended rescission periods
                </Typography>
                <Typography variant="body1" component="div" paragraph>
                  ✓ Transparent contracts and fees
                </Typography>
                <Typography variant="body1" component="div" paragraph>
                  ✓ Fair cancellation policies
                </Typography>
                <Typography variant="body1" component="div">
                  ✓ Strong consumer protections
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box sx={{ py: 6, bgcolor: 'grey.900', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                About ePublic Safety Foundation
              </Typography>
              <Typography variant="body1" paragraph>
                We're here to protect consumers like you from unfair timeshare practices. 
                Learn more about our nonprofit mission and join the fight.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Connect With Us
              </Typography>
              <Button color="inherit" sx={{ mr: 2 }}>About Us</Button>
              <Button color="inherit" sx={{ mr: 2 }}>Contact</Button>
              <Button color="inherit">Privacy Policy</Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 