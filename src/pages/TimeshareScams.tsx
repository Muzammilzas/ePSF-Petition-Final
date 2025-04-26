import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../components/Home/common/animations';

// Icons
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import WarningIcon from '@mui/icons-material/Warning';
import SecurityIcon from '@mui/icons-material/Security';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';

const DreamVacationSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    color: theme.palette.primary.main,
                    mb: 3,
                    lineHeight: 1.2
                  }}
                >
                  Protect Your Dream Vacation from Timeshare Scams
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    maxWidth: '600px',
                    lineHeight: 1.6
                  }}
                >
                  You're dreaming of the perfect getaway—a hassle-free vacation every year. A timeshare sounds like the answer, but what if it's a trap?
                </Typography>
                <Button
                  component={Link}
                  to="/timeshare-scam"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem'
                  }}
                >
                  Report a Scam
                </Button>
              </motion.div>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              component={motion.div}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  bgcolor: 'error.light',
                  color: 'error.contrastText',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Don't Let Your Dream Become a Nightmare
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    Timeshare scams can turn your dream into a nightmare. Learn how to protect yourself before it's too late.
                  </Typography>
                </Box>
                <BeachAccessIcon 
                  sx={{ 
                    position: 'absolute',
                    right: -20,
                    bottom: -20,
                    fontSize: 120,
                    opacity: 0.2,
                    transform: 'rotate(-15deg)'
                  }} 
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const ScamTrapSection = () => {
  const theme = useTheme();
  const traps = [
    {
      title: "Fake Offer",
      icon: <MoneyOffIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />,
      description: "A too-good-to-be-true deal lures you in via email or call."
    },
    {
      title: "High-Pressure Sales Pitch",
      icon: <AccessTimeIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />,
      description: "Scammers push you to sign fast, leaving no time to think."
    },
    {
      title: "Hidden Fees and Legal Traps",
      icon: <DescriptionIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />,
      description: "Contracts hide costly fees and binding clauses."
    },
    {
      title: "Difficulty Canceling or Reselling",
      icon: <BlockIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />,
      description: "Canceling is a nightmare, and reselling often leads to losses."
    },
    {
      title: "Financial Loss or Credit Damage",
      icon: <CreditCardOffIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />,
      description: "You're left with debt and damaged credit."
    }
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 1
                  }}
                >
                  The Timeshare Scam Trap
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    fontSize: '1.1rem'
                  }}
                >
                  Don't let scammers steal your dream vacation and your money
                </Typography>

                <Grid container spacing={2}>
                  {traps.map((trap, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 3,
                          display: 'flex',
                          flexDirection: 'column',
                          bgcolor: '#ffffff',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          {trap.icon}
                          <Box>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: '1.1rem',
                                mb: 0.5
                              }}
                            >
                              {trap.title}
                            </Typography>
                            <Typography 
                              color="text.secondary"
                              sx={{
                                fontSize: '1rem',
                                lineHeight: 1.5
                              }}
                            >
                              {trap.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box
              component={motion.div}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              sx={{
                width: '100%',
                height: '100%',
                minHeight: 500,
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1562664377-709f2c337eb2?auto=format&fit=crop&w=800&q=80"
                alt="Warning about timeshare scams"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  minHeight: 500
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 3
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 600,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  Don't Let Your Dream Vacation Turn Into a Nightmare
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const SafetyGuideSection = () => {
  const theme = useTheme();
  const steps = [
    {
      title: "Research First",
      icon: <SearchIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      description: "Verify the company and offer. If it's too good to be true, it's a scam."
    },
    {
      title: "Avoid Pressure",
      icon: <BlockIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      description: "Don't sign on the spot. Review contracts carefully—look for hidden fees."
    },
    {
      title: "Report Suspicious Activity",
      icon: <ReportIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      description: "Report scams and get help fast."
    }
  ];
  
  return (
    <Box 
      sx={{ 
        py: { xs: 6, md: 10 },
        bgcolor: `${theme.palette.primary.main}08`
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                textAlign: 'center',
                color: theme.palette.primary.main,
                mb: 1
              }}
            >
              Your Guide to Safety
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 6,
                fontSize: '1.1rem'
              }}
            >
              At ePublic Safety Foundation, we're consumer safety experts who've helped countless people avoid timeshare scams. We're here to guide you to safety.
            </Typography>

            <Grid container spacing={3}>
              {steps.map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: '#ffffff',
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      {step.icon}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          fontSize: '1.1rem'
                        }}
                      >
                        {step.title}
                      </Typography>
                    </Box>
                    <Typography 
                      color="text.secondary"
                      sx={{
                        fontSize: '1rem',
                        lineHeight: 1.5
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

const CallToActionSection = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: '100%',
                    bgcolor: theme.palette.success.light,
                    color: 'success.contrastText'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 40 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Enjoy Your Vacation Worry-Free
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 3 }}>
                    Imagine a scam-free vacation—your money safe, your credit intact, and your dream getaway secured. With our help, you'll enjoy peace of mind.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: '100%',
                    bgcolor: theme.palette.error.light,
                    color: 'error.contrastText'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                    <ErrorOutlineIcon sx={{ fontSize: 40 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Don't Risk Financial Ruin
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 3 }}>
                    Ignore the warning signs, and you could face debt, credit damage, and a vacation nightmare. Act now to avoid regret—don't let scammers win.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="h4" sx={{ mb: 3, color: theme.palette.primary.main }}>
                Take Control Today
              </Typography>
              <Typography sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                Timeshare scams are dangerous, but you can outsmart them. Follow our plan, report suspicious offers, and secure your dream vacation.
              </Typography>
              <Button
                component={Link}
                to="/timeshare-scam"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem'
                }}
              >
                Report a Scam Now
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

const TimeshareScams: React.FC = () => {
  return (
    <Box>
      <DreamVacationSection />
      <ScamTrapSection />
      <SafetyGuideSection />
      <CallToActionSection />
    </Box>
  );
};

export default TimeshareScams; 