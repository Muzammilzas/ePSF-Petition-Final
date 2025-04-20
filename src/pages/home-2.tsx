import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button,
  useTheme,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../components/Home/common/animations';

// Icons
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import DescriptionIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import GroupsIcon from '@mui/icons-material/Groups';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import FlagIcon from '@mui/icons-material/Flag';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const testimonials = [
  {
    name: "Priya Mehra",
    image: "/images/home-page/testimonials/Priya Mehra.avif",
    quote: "I didn't know I was signing my life away.",
    story: "It sounded like a dream. A guaranteed vacation spot, every year. But after the first year, the fees went up... and up. And we could never book when we wanted. We tried to cancel, but it felt like hitting a wall. Signing this petition was the first time I felt like maybe someone was finally listening."
  },
  {
    name: "Sofia Bennett",
    image: "/images/home-page/testimonials/Sofia Bennett.avif",
    quote: "We were threatened when we tried to leave.",
    story: "When we called to cancel, they told us we'd ruin our credit, that we'd be sued, that there was no way out. We felt bullied. And honestly, we backed down. This petition is a chance to stand up — not just for us, but for every family they've scared into silence."
  },
  {
    name: "Daniel Wu",
    image: "/images/home-page/testimonials/Daniel Wu.avif",
    quote: "We trusted them. That was the mistake.",
    story: "They made it sound so simple. Three days to cancel. But there were hidden clauses we didn't even know existed. By the time we figured it out, it was too late. I'm speaking up now because I don't want anyone else to go through what we did. This petition matters."
  },
  {
    name: "Claire Morgan",
    image: "/images/home-page/testimonials/Claire Morgan.avif",
    quote: "It was our honeymoon trip... and it turned into a trap.",
    story: "We went to the presentation for the free gift. They kept us there for hours, pressuring us until we gave in. We walked out with paperwork we didn't fully understand and debt we weren't ready for. This petition is a way to protect couples like us from being taken advantage of."
  },
  {
    name: "Lucas Reyes",
    image: "/images/home-page/testimonials/Lucas Reyes.avif",
    quote: "The fees cost more than the place was worth.",
    story: "Every year the fees went up, and the service went down. We stopped going, but we still had to pay. There was no way out — just threats and bills. This petition is our chance to finally say: enough is enough."
  },
  {
    name: "Dr. Amina Yousaf",
    image: "/images/home-page/testimonials/Dr. Amina Yousaf.avif",
    quote: "They promised flexibility. What we got was a headache.",
    story: "They said we could book anytime, anywhere. But nothing was ever available. The whole thing felt like a lie. We called over and over. We got nowhere. Now, I'm using my voice. This petition is how we start holding these companies accountable."
  },
  {
    name: "Nia Thompson",
    image: "/images/home-page/testimonials/Nia Thompson.avif",
    quote: "My parents signed a contract... and now it's my problem.",
    story: "They thought it was an investment. But when they passed, the bills started coming to me. I never signed anything, but they're still coming after me. I signed the petition because this shouldn't be allowed to happen to families. It has to stop."
  },
  {
    name: "Yasmin El-Tayeb",
    image: "/images/home-page/testimonials/Yasmin El-Tayeb.avif",
    quote: "We were in a tough spot, and they knew it.",
    story: "They saw we were vulnerable and made us an offer that sounded like a lifeline. It wasn't. It made everything worse. This petition gives me hope that we're finally calling out the manipulation — and doing something about it."
  },
  {
    name: "Astrid Novak",
    image: "/images/home-page/testimonials/Astrid Novak.avif",
    quote: "I was too embarrassed to talk about it — until now.",
    story: "I felt ashamed. Like I should've known better. But then I realized... this didn't just happen to me. It's happening to thousands of people. We're not alone. And this petition? It's the beginning of something bigger."
  }
];

const TestimonialsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: 'background.default',
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
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                textAlign: 'center',
                color: theme.palette.primary.main
              }}
            >
              Real Stories. Real Impact.
            </Typography>

            <Typography
              sx={{
                fontSize: '1.2rem',
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                mb: 6,
                textAlign: 'center'
              }}
            >
              These are just a few of the thousands of stories we've heard. Each one represents a family that deserved better.
            </Typography>
          </motion.div>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'auto',
              pb: 4,
              px: { xs: 2, md: 0 },
              '::-webkit-scrollbar': {
                height: '8px',
              },
              '::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '10px',
              },
              '::-webkit-scrollbar-thumb': {
                background: theme.palette.primary.main,
                borderRadius: '10px',
              },
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'thin',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  minWidth: { xs: '300px', md: '400px' },
                  maxWidth: { xs: '300px', md: '400px' },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                  flex: '0 0 auto'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={testimonial.image}
                    alt={testimonial.name}
                    sx={{
                      width: 64,
                      height: 64,
                      border: `2px solid ${theme.palette.primary.main}`
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: theme.palette.primary.main,
                        fontStyle: 'italic'
                      }}
                    >
                      {testimonial.quote}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: '1rem',
                    lineHeight: 1.6
                  }}
                >
                  {testimonial.story}
                </Typography>
              </Paper>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

const HeroSection = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        pt: { xs: 12, md: 16 },
        pb: { xs: 10, md: 14 },
        bgcolor: theme.palette.primary.main,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)',
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
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
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    fontWeight: 800,
                    mb: 4,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                    textAlign: { xs: 'center', md: 'left' },
                    background: 'linear-gradient(45deg, #FFFFFF 30%, rgba(255,255,255,0.8) 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  We're Taking a Stand Against Consumer Exploitation
                </Typography>
                
                <Typography 
                  variant="h4"
                  sx={{ 
                    mb: 4,
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: { xs: 'center', md: 'left' },
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    fontWeight: 500
                  }}
                >
                  You deserve protection — not confusion, intimidation, or silence.
                </Typography>

                <Typography 
                  sx={{ 
                    maxWidth: '800px',
                    mb: 6,
                    lineHeight: 1.8,
                    textAlign: { xs: 'center', md: 'left' },
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    color: 'rgba(255, 255, 255, 0.85)'
                  }}
                >
                  Every day, people are scammed, misled, or left in the dark when it comes to their consumer rights. 
                  From timeshare traps, inheritance fraud, and shady sales tactics to questions like how do I get out 
                  of a timeshare, the damage is real — and often ignored.
                  <br/><br/>
                  The truth is, many victims don't even realize they've been targeted until it's too late. 
                  We're here to change that.
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 3,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                  <Button
                    component={Link}
                    to="/petition"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)'
                      }
                    }}
                  >
                    Sign the Petition Now
                  </Button>
                  <Button
                    component={Link}
                    to="/consumer-rights"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.9)',
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Learn Your Rights
                  </Button>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  position: 'relative',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg) translateY(-10px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    bottom: -20,
                    left: -20,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    borderRadius: '20px',
                    zIndex: 0
                  }
                }}
              >
                <Box
                  component="img"
                  src="/images/home-page/We're Taking a Stand Against Consumer.avif"
                  alt="Taking a Stand Against Consumer Exploitation"
                  sx={{
                    width: '100%',
                    height: { xs: '300px', md: '400px' },
                    objectFit: 'cover',
                    borderRadius: '10px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          transform: 'skewX(-20deg) translateX(50%)',
          zIndex: 0
        }}
      />
    </Box>
  );
};

const WhoWeAreSection = () => {
  const theme = useTheme();
  
  return (
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
                  Who We Are
                </Typography>
                
                <Typography 
                  sx={{ 
                    mb: 4,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: 'text.secondary'
                  }}
                >
                  ePublic Safety Foundation is a family-founded nonprofit dedicated to protecting consumers 
                  from financial deception — especially in timeshares in Florida, estate-related scams, 
                  and deceptive timeshare exit company practices.
                </Typography>

                <Typography 
                  sx={{ 
                    mb: 4,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: 'text.secondary'
                  }}
                >
                  We were created to help people like you understand your rights, avoid predatory contracts, 
                  and take action when things go wrong. Too many families are being misled, trapped in lifelong 
                  timeshare obligations, or defrauded of inheritances with no clear way out.
                </Typography>

                <Box sx={{ 
                  p: 3, 
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  borderRadius: 2,
                  mt: 6
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Our Goal
                  </Typography>
                  <Typography>
                    To keep everyday people safe, informed, and empowered.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <Box sx={{ 
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: 'repeat(2, 1fr)'
                }}>
                  {[
                    { icon: <SecurityIcon sx={{ fontSize: 40 }}/>, text: "Protection" },
                    { icon: <GavelIcon sx={{ fontSize: 40 }}/>, text: "Justice" },
                    { icon: <GroupsIcon sx={{ fontSize: 40 }}/>, text: "Community" },
                    { icon: <HandshakeIcon sx={{ fontSize: 40 }}/>, text: "Support" }
                  ].map((item, index) => (
                    <Paper
                      key={index}
                      elevation={2}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                        {item.icon}
                      </Box>
                      <Typography variant="h6">
                        {item.text}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

const SignPetitionSection = () => {
  const theme = useTheme();
  
  return (
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
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h2" 
                    component="h2"
                    sx={{ 
                      fontWeight: 700,
                      mb: 4,
                      textAlign: 'center',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      background: 'linear-gradient(45deg, #FFFFFF 30%, rgba(255,255,255,0.8) 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Sign the Petition
                  </Typography>
                </motion.div>
              </Grid>
            </Grid>

            <Grid container spacing={6} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={5} order={{ xs: 2, md: 1 }}>
                <motion.div variants={fadeInUp}>
                  <Box 
                    component="img"
                    src="/images/home-page/Sign the Petition- home.avif"
                    alt="Sign the Petition"
                    sx={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      borderRadius: '20px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      transform: 'perspective(1000px) rotateY(-5deg)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'perspective(1000px) rotateY(0deg)'
                      }
                    }}
                  />
                </motion.div>
              </Grid>

              <Grid item xs={12} md={7} order={{ xs: 1, md: 2 }}>
                <motion.div variants={fadeInUp}>
                  <Box sx={{ 
                    p: 4, 
                    borderRadius: 4,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Typography 
                      sx={{ 
                        mb: 4,
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      Help us demand new laws that protect consumers from deceptive practices — especially in 
                      timeshare sales, inheritance scams, and other financial traps targeting the vulnerable.
                    </Typography>

                    <Typography 
                      sx={{ 
                        mb: 4,
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      We're calling on lawmakers to step in and finally hold bad actors accountable.
                      Your voice matters — and your signature helps make it louder.
                    </Typography>

                    <Typography 
                      variant="h5"
                      sx={{ 
                        fontWeight: 600,
                        mb: 6,
                        fontStyle: 'italic',
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.9)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      Your voice is power. One signature can help protect thousands.
                    </Typography>

                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        component={Link}
                        to="/petition"
                        variant="contained"
                        size="large"
                        sx={{
                          bgcolor: 'white',
                          color: theme.palette.primary.main,
                          py: 2,
                          px: 8,
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: '30px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.9)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 25px rgba(0,0,0,0.3)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Sign the Petition Now
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
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
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '40%',
          height: '60%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          transform: 'rotate(-15deg)',
          zIndex: 1
        }}
      />
    </Box>
  );
};

const KnowYourRightsSection = () => {
  const theme = useTheme();
  
  const rights = [
    "How timeshare and estate frauds are designed to trap you",
    "What laws exist to protect you",
    "What actions you can take if you've been targeted",
    "What rights we believe every consumer deserves in the digital age"
  ];

  return (
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
                  Know Your Rights
                </Typography>
                
                <Typography 
                  sx={{ 
                    mb: 4,
                    fontSize: '1.1rem',
                    color: 'text.secondary'
                  }}
                >
                  Most people don't know what protections they already have — let alone how to use them. 
                  That's by design.
                </Typography>

                <Typography 
                  sx={{ 
                    mb: 4,
                    fontSize: '1.1rem',
                    color: 'text.secondary'
                  }}
                >
                  We break down the fine print so you can understand:
                </Typography>

                <List>
                  {rights.map((right, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={right}
                        primaryTypographyProps={{
                          sx: { 
                            fontSize: '1.1rem',
                            color: 'text.primary'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  component={Link}
                  to="/consumer-rights"
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
                  Take back your power — Read the Consumer Rights Guide
                </Button>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <Box 
                  component="img"
                  src="/images/home-page/know your rights-home.avif"
                  alt="Know Your Rights"
                  sx={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg) translateY(-10px)'
                    }
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

const ReportScamSection = () => {
  const theme = useTheme();
  
  const features = [
    "Report what happened",
    "Share your experience anonymously (if you choose)",
    "Help us build a national case for stronger protections"
  ];

  return (
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
                Report a Scam
              </Typography>
              
              <Typography 
                sx={{ 
                  mb: 4,
                  fontSize: '1.1rem',
                  color: 'text.secondary',
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                Your story could save someone else. Whether you've been scammed or almost fell for it, 
                your experience matters.
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <Box 
                  component="img"
                  src="/images/home-page/Timeshare-report-a-scam .avif"
                  alt="Report a Scam"
                  sx={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg) translateY(-10px)'
                    }
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    bgcolor: 'rgba(1, 189, 155, 0.05)',
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.primary.main}`
                  }}
                >
                  <Typography 
                    sx={{ 
                      mb: 4,
                      fontSize: '1.1rem',
                      color: 'text.secondary'
                    }}
                  >
                    We offer a safe, secure way to:
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    {features.map((feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 3,
                          p: 2,
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateX(8px)'
                          }
                        }}
                      >
                        <ArrowForwardIcon 
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: 28
                          }} 
                        />
                        <Typography 
                          sx={{ 
                            fontSize: '1.1rem',
                            color: 'text.primary',
                            fontWeight: 500
                          }}
                        >
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    component={Link}
                    to="/timeshare-scam"
                    variant="contained"
                    size="large"
                    startIcon={<ReportProblemIcon />}
                    fullWidth
                    sx={{
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
                    Help others by speaking up — Report a Scam Today
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: 0,
          width: '30%',
          height: '70%',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`,
          transform: 'skewY(-20deg)',
          zIndex: 0
        }}
      />
    </Box>
  );
};

const StayInformedSection = () => {
  const theme = useTheme();
  
  const infoCards = [
    {
      icon: <WarningIcon sx={{ fontSize: 40 }}/>,
      title: "Where Timeshare Scams Thrive",
      description: "5 states with the weakest protections — and how they leave buyers at risk.",
      image: "/images/home-page/Where Timeshare Scams Thrive.avif",
      link: "/where-scams-thrive"
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }}/>,
      title: "Before You Sign a Contract",
      description: "Learn what to check, what to question, and what to avoid before you're locked in. Understand why timeshares are hard to sell and how to avoid long-term regrets.",
      image: "/images/home-page/Before You Sign a Contract.avif",
      link: "/before-you-sign"
    },
    {
      icon: <ErrorOutlineIcon sx={{ fontSize: 40 }}/>,
      title: "Spotting Exit Scams",
      description: "How to tell if a timeshare exit service is legitimate — or just another scam.",
      image: "/images/home-page/Spotting Exit Scams.avif",
      link: "/spotting-exit-scams"
    }
  ];

  return (
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
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div variants={fadeInUp}>
              <Typography 
                variant="h2" 
                component="h2"
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  color: theme.palette.primary.main
                }}
              >
                Stay Informed. Stay Protected.
              </Typography>
              
              <Typography 
                sx={{ 
                  fontSize: '1.2rem',
                  color: 'text.secondary',
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 2
                }}
              >
                Most people don't know they're walking into a trap — until it's too late. 
                That's why we created these quick, must-read fact sheets to help you avoid 
                the most common timeshare scams.
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            {infoCards.map((card, index) => (
              <Grid item xs={12} md={4} key={index} sx={{ display: 'flex' }}>
                <motion.div variants={fadeInUp} style={{ width: '100%' }}>
                  <Paper
                    elevation={2}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Box 
                      sx={{
                        height: 200,
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <Box
                        component="img"
                        src={card.image}
                        alt={card.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ 
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        mb: 2
                      }}>
                        <Box sx={{ 
                          color: theme.palette.primary.main,
                          flexShrink: 0
                        }}>
                          {card.icon}
                        </Box>
                        <Typography 
                          variant="h5"
                          sx={{ 
                            fontWeight: 600,
                            lineHeight: 1.3
                          }}
                        >
                          {card.title}
                        </Typography>
                      </Box>
                      
                      <Typography 
                        sx={{ 
                          color: 'text.secondary',
                          mb: 3,
                          flexGrow: 1
                        }}
                      >
                        {card.description}
                      </Typography>

                      <Box sx={{ mt: 'auto' }}>
                        <Button
                          component={Link}
                          to={card.link}
                          variant="contained"
                          fullWidth
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            py: 1.5,
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: theme.palette.primary.dark
                            }
                          }}
                        >
                          Learn the Warning Signs
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ 
            textAlign: 'center',
            mt: 6
          }}>
            <Typography
              sx={{
                color: 'text.secondary',
                maxWidth: '900px',
                mx: 'auto',
                fontSize: '1.1rem'
              }}
            >
              These resources are free, easy to understand, and made to help you protect yourself 
              and your family — especially if you're wondering how can you get rid of a timeshare 
              or need a trusted timeshare attorney.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

const WhyThisMattersSection = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: theme.palette.primary.main,
        color: 'white'
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
                textAlign: 'center'
              }}
            >
              Why This Matters
            </Typography>
            
            <Typography 
              sx={{ 
                mb: 6,
                fontSize: '1.2rem',
                lineHeight: 1.8,
                maxWidth: '800px',
                mx: 'auto',
                textAlign: 'center'
              }}
            >
              This work is personal. Our foundation was created after a devastating scam took the lives 
              of an innocent couple. Since then, we've made it our mission to ensure that no one else 
              is left unprotected, unheard, or unaware.
            </Typography>

            <Typography 
              variant="h5"
              sx={{ 
                fontWeight: 600,
                textAlign: 'center',
                fontStyle: 'italic'
              }}
            >
              It's time to say enough is enough — and push for action.
            </Typography>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

const ActionSection = () => {
  const theme = useTheme();
  
  const actions = [
    {
      icon: "✔️",
      title: "Stand up for victims and vulnerable families",
      description: "Sign the Petition"
    },
    {
      icon: "📘",
      title: "Empower yourself",
      description: "Know Your Rights"
    },
    {
      icon: "📩",
      title: "Report a scam",
      description: "Help us expose patterns and push for real protection"
    },
    {
      icon: "📢",
      title: "Share this site with someone who's been scammed",
      description: "Let them know they're not alone"
    }
  ];

  return (
    <Box 
      sx={{ 
        py: { xs: 6, md: 8 },
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
          <Typography 
            variant="h3" 
            component="h2"
            sx={{ 
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
              color: theme.palette.primary.main
            }}
          >
            You Can Make a Difference Today
          </Typography>

          <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
            {actions.map((action, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateX(8px)'
                  }
                }}
              >
                <Typography sx={{ fontSize: '1.25rem', lineHeight: 1 }}>
                  {action.icon}
                </Typography>
                <Box>
                  <Typography 
                    sx={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.25
                    }}
                  >
                    {action.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.9rem'
                    }}
                  >
                    {action.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ 
            textAlign: 'center',
            mt: 4
          }}>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: '700px',
                mx: 'auto',
                fontStyle: 'italic'
              }}
            >
              Together, we can stop the silence, hold scammers accountable, and demand real change.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

const Home2Page = () => {
  return (
    <Box>
      <HeroSection />
      <WhoWeAreSection />
      <TestimonialsSection />
      <SignPetitionSection />
      <KnowYourRightsSection />
      <ReportScamSection />
      <StayInformedSection />
      <WhyThisMattersSection />
      <ActionSection />
    </Box>
  );
};

export default Home2Page; 