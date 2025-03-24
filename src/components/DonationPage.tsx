import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SecurityIcon from '@mui/icons-material/Security';
import GavelIcon from '@mui/icons-material/Gavel';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const DonationPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Donate - ePSF";
  }, []);

  const DonateButton = () => (
    <Button
      component="a"
      href="https://www.paypal.com/donate/?hosted_button_id=CJ3BQFH766EXG"
      target="_blank"
      rel="noopener noreferrer"
      variant="contained"
      color="primary"
      size="large"
      startIcon={<CheckCircleIcon />}
      sx={{
        px: 4,
        py: 1.5,
        borderRadius: '50px',
        fontSize: '1.125rem',
        fontWeight: 500,
        textTransform: 'none',
        boxShadow: '0 4px 10px rgba(1, 189, 155, 0.3)',
        '&:hover': {
          boxShadow: '0 6px 14px rgba(1, 189, 155, 0.4)',
          transform: 'scale(1.03)',
          transition: 'all 0.3s ease',
        }
      }}
    >
      Donate Now
    </Button>
  );

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        minHeight: '100vh',
        py: 8,
        background: 'linear-gradient(180deg, rgba(1,189,155,0.05) 0%, rgba(224,172,63,0.05) 100%)',
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box component={motion.div} variants={itemVariants} textAlign="center" mb={8}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #01BD9B, #E0AC3F)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Join the Movement
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 600,
              mb: 3,
              color: 'text.primary'
            }}
          >
            End Timeshare Fraud for Good
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              color: 'text.secondary'
            }}
          >
            Your donation is more than a gift—it's a stand against a system that traps honest families in lifetime contracts, hidden fees, and inherited debt.
          </Typography>
          <DonateButton />
        </Box>

        {/* Mission Statement */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 8,
            borderRadius: 2,
            background: 'white',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }
          }}
        >
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
            At ePublic Safety Foundation, we are on a mission to reform predatory timeshare practices through public education, legal advocacy, and consumer protection efforts. With your support, we can create a future where individuals and families are protected from deception, financial manipulation, and automatic timeshare inheritance.
          </Typography>
        </Paper>

        {/* Impact Sections */}
        <Grid container spacing={4} mb={8}>
          <Grid item xs={12} md={6}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              elevation={3}
              sx={{ p: 4, height: '100%', borderRadius: 2 }}
            >
              <Box display="flex" alignItems="center" mb={3}>
                <HandshakeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Empowering Change
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Your donation empowers our work to:
              </Typography>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Expose and challenge misleading timeshare promotions</li>
                <li>Educate consumers on their legal rights</li>
                <li>Advocate for policy changes like longer rescission periods</li>
                <li>End the automatic inheritance of unwanted contracts</li>
                <li>Protect heirs from being trapped in inherited timeshare debt</li>
              </ul>
              <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>
                Community support fuels every step of this mission. Together, we are shifting power back to the people.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              elevation={3}
              sx={{ p: 4, height: '100%', borderRadius: 2 }}
            >
              <Box display="flex" alignItems="center" mb={3}>
                <GavelIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Your Impact
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Every dollar you give strengthens the fight against timeshare fraud. Your generosity supports:
              </Typography>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Free educational content on safe contracts</li>
                <li>Tools to help people exit abusive timeshare agreements</li>
                <li>Public safety campaigns targeting deceptive timeshare sales</li>
                <li>Advocacy to stop automatic inheritance of timeshare obligations</li>
              </ul>
            </Paper>
          </Grid>
        </Grid>

        {/* Champion Section */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 8,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #01BD9B 0%, #E0AC3F 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 600 }}>
            Become a Timeshare Justice Champion
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', mb: 4 }}>
            When you donate to ePublic Safety Foundation, you don't just support a cause—you join a community committed to justice. You stand up for families misled by fine print, false promises, and silent inheritance traps.
          </Typography>
          <Button
            component="a"
            href="https://www.paypal.com/donate/?hosted_button_id=CJ3BQFH766EXG"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Donate and Take a Stand
          </Button>
        </Paper>

        {/* Promise Section */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          elevation={3}
          sx={{ p: 4, mb: 8, borderRadius: 2 }}
        >
          <Box display="flex" alignItems="center" mb={3}>
            <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Your Donation, Our Promise
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem' }}>
            We commit to transparency and integrity in how your contributions are used. Every dollar is invested in protecting individuals from timeshare abuse and advocating for a system that puts people first—including protecting future generations from inherited financial burdens they never agreed to.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.125rem', fontWeight: 500 }}>
            We'll keep you informed about the impact you're making—and we'll keep fighting until the system is fair.
          </Typography>
        </Paper>

        {/* Final CTA */}
        <Box
          component={motion.div}
          variants={itemVariants}
          textAlign="center"
          mb={4}
        >
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            How to Donate
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Simple steps. Immediate impact. Choose your donation method and give with confidence. Your support—no matter the amount—makes a real difference in our ability to protect consumers nationwide.
          </Typography>
          <DonateButton />
        </Box>
      </Container>
    </Box>
  );
};

export default DonationPage; 