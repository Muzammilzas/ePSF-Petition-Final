import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import WarningIcon from '@mui/icons-material/Warning';
import SecurityIcon from '@mui/icons-material/Security';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import GavelIcon from '@mui/icons-material/Gavel';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReportIcon from '@mui/icons-material/Report';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const TimeshareScamAwareness: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Hero Section with Split Design */}
      <Box
        sx={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            flex: 1,
            bgcolor: theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            p: { xs: 4, md: 8 },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100px',
              background: `linear-gradient(to right, ${theme.palette.primary.main}, transparent)`,
              transform: 'skewX(-5deg)',
              transformOrigin: 'top',
              display: { xs: 'none', md: 'block' },
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, mb: 4, fontWeight: 800 }}>
                Don't Get Trapped Spot Timeshare Scams Early
              </Typography>
              <Typography variant="h3" sx={{ mb: 3, color: theme.palette.secondary.main }}>
                Your Perfect Vacation Dream
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, lineHeight: 1.6 }}>
                You're envisioning a flawless vacation—sun, relaxation, and memories to last a lifetime. A timeshare seems like the key to making it happen every year. But what if it's a scam?
              </Typography>
              <Button
                component={Link}
                to="/timeshare-scam"
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  borderRadius: '30px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Join the Fight Now
              </Button>
            </motion.div>
          </Box>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1562664377-709f2c337eb2?auto=format&fit=crop&w=1200&q=80"
            alt="Vacation warning"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.8)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningIcon sx={{ fontSize: '120px', color: 'white', opacity: 0.8 }} />
          </Box>
        </Box>
      </Box>

      {/* Warning Signs Section */}
      <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: theme.palette.primary.main,
                position: 'relative',
              }}
            >
              The Timeshare Scam Danger
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 6,
                fontSize: '1.1rem',
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Timeshare scams can turn your dream into a trap. Watch for these warning signs
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  icon: <ErrorOutlineIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />,
                  title: "High-Pressure Sales",
                  description: "They push you to sign immediately, leaving no time to think."
                },
                {
                  icon: <MoneyOffIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
                  title: "Upfront Fees",
                  description: "They demand big payments before you see the full deal."
                },
                {
                  icon: <GavelIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
                  title: "No Written Exit Policy",
                  description: "There's no clear way to cancel, locking you in."
                }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: '100%',
                        borderRadius: '20px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Box sx={{ mb: 2 }}>{item.icon}</Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {item.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mt: 4,
                fontSize: '1.1rem'
              }}
            >
              These tactics can leave you stuck, financially drained, and stressed.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Guide Section */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Typography variant="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 700, color: theme.palette.primary.main }}>
              Your Expert Ally
            </Typography>
            <Typography variant="h5" sx={{ mb: 6, textAlign: 'center', color: 'text.secondary' }}>
              The ePublic Safety Foundation is here to protect you. We're experts in identifying timeshare scams and empowering you to avoid them.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Safety Plan Section */}
      <Box sx={{ py: 10, bgcolor: `${theme.palette.primary.main}08` }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Typography variant="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 700, color: theme.palette.primary.main }}>
              3 Steps to Stay Safe
            </Typography>
            <Typography sx={{ mb: 6, textAlign: 'center', color: 'text.secondary' }}>
              Protect yourself with this simple plan
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  icon: <SearchIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
                  title: "Check the Company",
                  description: "Research their reputation before engaging."
                },
                {
                  icon: <AccessTimeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
                  title: "Take Your Time",
                  description: "Don't sign under pressure—review all terms carefully."
                },
                {
                  icon: <ReportIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
                  title: "Report Red Flags",
                  description: "Contact ePublic Safety Foundation if something feels off."
                }
              ].map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: '100%',
                        borderRadius: '20px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Box sx={{ mb: 2 }}>{step.icon}</Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {step.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Success/Failure Section */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
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
                    Vacation with Confidence
                  </Typography>
                </Box>
                <Typography>
                  Picture a worry-free vacation—your money safe, no traps, just pure enjoyment. You've outsmarted the scammers.
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
                    Avoid the Trap
                  </Typography>
                </Box>
                <Typography>
                  Ignore the signs, and you'll be stuck with fees, no exit, and a ruined dream. Don't let scammers win.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 10,
          bgcolor: theme.palette.primary.main,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
              Stay One Step Ahead
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Timeshare scams are sneaky, but you're smarter. Follow our plan and sign the petition at ePublic Safety Foundation to stay protected!
            </Typography>
            <Button
              component={Link}
              to="/timeshare-scam"
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                borderRadius: '30px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              Sign the Petition Now
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default TimeshareScamAwareness; 