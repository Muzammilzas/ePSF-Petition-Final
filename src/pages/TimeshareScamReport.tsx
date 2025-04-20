import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../components/Home/common/animations';

// Icons
import WarningIcon from '@mui/icons-material/Warning';
import SecurityIcon from '@mui/icons-material/Security';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';

const TimeshareScamReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const scamTypes = [
    "A high-pressure sales pitch you now regret",
    "A contract that promised one thing and delivered another",
    'A "timeshare exit company" that took your money and disappeared',
    "Or even a situation where your elderly parent was misled"
  ];

  const reportableItems = [
    "Misleading or aggressive timeshare sales tactics",
    "Contracts with confusing or hidden fees",
    "Timeshare exit services that took payment but gave no help",
    "Resellers demanding upfront money or making false guarantees",
    "Any situation where you or a loved one felt deceived or pressured"
  ];

  const afterReporting = [
    "Your story is reviewed by our team",
    "You can stay anonymous if you'd prefer",
    "We may contact you (only if needed) for more info",
    "You'll help us track common scams and push for stronger laws",
    "We'll connect you with helpful resources whenever possible"
  ];

  const handleReportClick = () => {
    navigate('/report-scam');
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 12, md: 16 },
          pb: { xs: 10, md: 14 },
          bgcolor: theme.palette.primary.main,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={7}>
                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h1" 
                    component="h1"
                    sx={{ 
                      fontWeight: 800,
                      mb: 4,
                      fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                      background: 'linear-gradient(45deg, #FFFFFF 30%, rgba(255,255,255,0.8) 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Report a Timeshare Scam
                  </Typography>

                  <Typography 
                    variant="h4"
                    sx={{ 
                      mb: 4,
                      color: 'rgba(255, 255, 255, 0.9)',
                      maxWidth: '800px'
                    }}
                  >
                    If you've been misled, trapped, or scammed — you're not alone.
                  </Typography>

                  <Typography 
                    sx={{ 
                      fontSize: '1.2rem',
                      mb: 6,
                      maxWidth: '800px',
                      lineHeight: 1.8,
                      color: 'rgba(255, 255, 255, 0.85)'
                    }}
                  >
                    Timeshare scams are more common than most people realize. Whether you're stuck in a contract 
                    you didn't fully understand, paid thousands to a fake exit company, or were pressured into a 
                    deal that turned out to be something else entirely — we're here to help.
                  </Typography>

                  <Box
                    component="a"
                    href="/report-scam"
                    sx={{
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        bgcolor: 'white',
                        color: theme.palette.primary.main,
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 10,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Take action now — Report a Timeshare Scam
                    </Button>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={5}>
                <motion.div 
                  variants={fadeInUp}
                  style={{
                    position: 'relative',
                    perspective: '1000px'
                  }}
                >
                  <Box
                    component="img"
                    src="/images/timeshare-scam/report-a-timeshare-scam.avif"
                    alt="Report a Timeshare Scam"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 3,
                      transform: 'rotateY(-5deg) rotateX(5deg)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      transition: 'all 0.5s ease',
                      '&:hover': {
                        transform: 'rotateY(0deg) rotateX(0deg) scale(1.02)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
                      }
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                      borderRadius: 3,
                      pointerEvents: 'none'
                    }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>

        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 1
          }}
        />
      </Box>

      {/* Why It Matters Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          bgcolor: 'background.paper'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h2" 
                    component="h2"
                    sx={{ 
                      fontWeight: 700,
                      mb: 4,
                      color: theme.palette.primary.main
                    }}
                  >
                    Why It Matters
                  </Typography>
                  
                  <Typography 
                    sx={{ 
                      mb: 4,
                      fontSize: '1.1rem',
                      color: 'text.secondary',
                      lineHeight: 1.8
                    }}
                  >
                    Timeshare scams often go unreported — and scammers count on that silence to keep doing 
                    it to others. When you speak up, you help expose patterns, build data that can be shared 
                    with lawmakers, and support real change.
                  </Typography>

                  <Typography 
                    sx={{ 
                      mb: 3,
                      fontSize: '1.1rem',
                      color: 'text.secondary'
                    }}
                  >
                    Whether it's:
                  </Typography>

                  <List>
                    {scamTypes.map((type, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <ListItemIcon>
                          <WarningIcon sx={{ color: theme.palette.primary.main }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={type}
                          primaryTypographyProps={{
                            sx: { fontSize: '1.1rem' }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    component={Link}
                    to="/report-scam"
                    variant="contained"
                    size="large"
                    startIcon={<SecurityIcon />}
                    sx={{
                      mt: 4,
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      py: 2,
                      px: 6,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark
                      }
                    }}
                  >
                    You can make a difference. Start your report here.
                  </Button>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div variants={fadeInUp}>
                  <Box 
                    component="img"
                    src="/images/timeshare-scam/Why It Matters-timeshare.avif"
                    alt="Why Reporting Timeshare Scams Matters"
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
                      }
                    }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* What You Can Report Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          bgcolor: 'background.default',
          position: 'relative',
          overflow: 'hidden'
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
                    mb: 4,
                    color: theme.palette.primary.main
                  }}
                >
                  What You Can Report
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: '1.2rem',
                    color: 'text.secondary',
                    maxWidth: '800px',
                    mx: 'auto',
                    mb: 6
                  }}
                >
                  We're here to document every type of timeshare-related deception. Your experience matters, no matter the form it took.
                </Typography>
              </motion.div>
            </Box>

            <Grid container spacing={3}>
              {reportableItems.slice(0, -1).map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(8px)',
                          bgcolor: 'rgba(0, 0, 0, 0.02)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CheckCircleIcon 
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontSize: 28,
                          mt: 0.5
                        }} 
                      />
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 1
                          }}
                        >
                          {item}
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.95rem'
                          }}
                        >
                          Every detail helps build a stronger case for consumer protection.
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}

              {/* Centered last item */}
              <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
                <motion.div variants={fadeInUp}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        color: theme.palette.primary.main,
                        fontSize: 28,
                        mt: 0.5
                      }} 
                    />
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 1
                        }}
                      >
                        {reportableItems[reportableItems.length - 1]}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.95rem'
                        }}
                      >
                        Every detail helps build a stronger case for consumer protection.
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>

            <Box 
              sx={{ 
                mt: 8,
                p: 4,
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: 4,
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: '1.2rem',
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  mb: 3
                }}
              >
                If you're unsure whether it counts — report it anyway. We'll review it.
              </Typography>
              <Button
                component={Link}
                to="/report-scam"
                variant="contained"
                size="large"
                startIcon={<ReportProblemIcon />}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  py: 2,
                  px: 6,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Start Your Report Now
              </Button>
            </Box>
          </motion.div>
        </Container>

        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: 0,
            width: '30%',
            height: '80%',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.primary.main}02)`,
            transform: 'skewY(-20deg)',
            zIndex: 0
          }}
        />
      </Box>

      {/* What Happens After Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          bgcolor: theme.palette.primary.main,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
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
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography 
                  variant="h2" 
                  component="h2"
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'center',
                    fontSize: { xs: '2rem', md: '3rem' },
                    background: 'linear-gradient(45deg, #FFFFFF 30%, rgba(255,255,255,0.8) 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  What Happens After You Report
                </Typography>

                <Typography 
                  sx={{ 
                    mb: 8,
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    maxWidth: '800px',
                    mx: 'auto',
                    color: 'rgba(255,255,255,0.9)'
                  }}
                >
                  Your report sets in motion a series of actions designed to protect consumers and stop scammers.
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <SecurityIcon sx={{ fontSize: 40, color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: 'white'
                        }}
                      >
                        Initial Review
                      </Typography>
                      <Typography sx={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>
                        Your story is reviewed by our team of consumer protection experts, with the option to remain anonymous.
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <WarningIcon sx={{ fontSize: 40, color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: 'white'
                        }}
                      >
                        Data Analysis
                      </Typography>
                      <Typography sx={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>
                        We track patterns and build evidence to push for stronger consumer protection laws.
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 40, color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: 'white'
                        }}
                      >
                        Support & Resources
                      </Typography>
                      <Typography sx={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>
                        We'll connect you with helpful resources and guidance for your situation.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box 
                  sx={{ 
                    mt: 8,
                    p: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center'
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontSize: '1.2rem',
                      fontStyle: 'italic',
                      mb: 3,
                      color: 'rgba(255,255,255,0.9)'
                    }}
                  >
                    We're not a law firm, but we are committed advocates — and your voice matters here.
                  </Typography>
                  <Button
                    component={Link}
                    to="/report-scam"
                    variant="contained"
                    size="large"
                    startIcon={<ReportProblemIcon />}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      py: 2,
                      px: 6,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Let us know what happened — Submit a Report Now
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </motion.div>
        </Container>

        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 1
          }}
        />
      </Box>

      {/* Final Call to Action */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          bgcolor: 'background.paper',
          textAlign: 'center'
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
                component="h2"
                sx={{ 
                  fontWeight: 700,
                  mb: 4,
                  color: theme.palette.primary.main
                }}
              >
                Your Voice Could Save Someone Else
              </Typography>

              <Typography 
                sx={{ 
                  mb: 6,
                  fontSize: '1.2rem',
                  color: 'text.secondary'
                }}
              >
                Scammers rely on silence. But your report has the power to warn others, support reform, and stop the cycle.
              </Typography>

              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={4}>
                  <Button
                    component={Link}
                    to="/report-scam"
                    variant="contained"
                    fullWidth
                    startIcon={<ReportProblemIcon />}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Report a Timeshare Scam
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    component={Link}
                    to="/timeshare-scam-checklist"
                    variant="outlined"
                    fullWidth
                    startIcon={<DescriptionIcon />}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Download Our Free Checklist
                  </Button>
                </Grid>
              </Grid>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default TimeshareScamReport; 