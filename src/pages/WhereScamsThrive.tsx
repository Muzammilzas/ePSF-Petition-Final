import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, Alert, useTheme, useMediaQuery, Grid, FormControlLabel, Checkbox, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { collectMetaDetails } from '../utils/metaDetails';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../components/Home/common/animations';
import { supabase } from '../supabase';

const WhereScamsThrivePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    newsletterConsent: false,
    metaDetails: {
      browser: '',
      device_type: '',
      screen_resolution: '',
      user_agent: '',
      timezone: '',
      language: '',
      ip_address: '',
      city: '',
      region: '',
      country: '',
      latitude: '',
      longitude: ''
    }
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const navigate = useNavigate();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'newsletterConsent' ? checked : value
    }));

    // If this is the newsletter consent checkbox and it was just checked
    if (name === 'newsletterConsent' && checked && formData.email) {
      try {
        // Add to newsletter contact list
        const newsletterContactData = {
          email: formData.email,
          attributes: {
            NAME: formData.fullName,
            EMAIL: formData.email,
            SIGNUP_DATE: new Date().toLocaleString('en-US', {
              timeZone: 'America/New_York',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }),
            SIGNUP_SOURCE: "Where Scams Thrive Landing Page"
          },
          listIds: [17], // Updated to use template ID 17 for newsletter
          updateEnabled: true,
          emailBlacklisted: false
        };

        console.log('Adding/Updating newsletter contact with data:', newsletterContactData);

        const newsletterResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': import.meta.env.VITE_BREVO_API_KEY
          },
          body: JSON.stringify(newsletterContactData)
        });

        if (!newsletterResponse.ok) {
          // If creating fails, try updating
          const updateResponse = await fetch(`https://api.brevo.com/v3/contacts/${formData.email}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'api-key': import.meta.env.VITE_BREVO_API_KEY
            },
            body: JSON.stringify({
              attributes: newsletterContactData.attributes,
              listIds: newsletterContactData.listIds,
              emailBlacklisted: false
            })
          });

          if (!updateResponse.ok) {
            throw new Error('Failed to update newsletter contact');
          }
        }

        // Send newsletter welcome email
        const welcomeEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': import.meta.env.VITE_BREVO_API_KEY
          },
          body: JSON.stringify({
            sender: {
              name: 'ePublic Safety Foundation',
              email: 'info@epublicsf.org'
            },
            to: [{ email: formData.email }],
            templateId: 17,
            params: {
              name: formData.fullName,
              email: formData.email,
              signup_date: new Date().toLocaleString('en-US', {
                timeZone: 'America/New_York',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }),
              signup_source: "Where Scams Thrive Landing Page"
            }
          })
        });

        if (!welcomeEmailResponse.ok) {
          console.error('Failed to send newsletter welcome email:', await welcomeEmailResponse.json());
        }

        console.log('Newsletter subscription and welcome email processed successfully');
      } catch (error) {
        console.error('Error managing newsletter subscription:', error);
        setError('There was an error subscribing to the newsletter. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!executeRecaptcha) {
      console.error('reCAPTCHA not initialized');
      setError('Form validation not yet available. Please try again.');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Executing reCAPTCHA...');
      const token = await executeRecaptcha('download_report');
      console.log('reCAPTCHA token received:', !!token);
      
      if (!token) {
        throw new Error('Failed to execute reCAPTCHA');
      }

      // Collect meta details for the download
      const metaDetails = await collectMetaDetails();
      console.log('Collected meta details:', metaDetails);

      // Basic form validation
      if (!formData.email || !formData.fullName) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Send admin notification
      const downloadTime = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      // Prepare email data with correct property names
      const adminEmailData = {
        report: {
          reporter_name: formData.fullName,
          reporter_email: formData.email,
          download_time: downloadTime,
          newsletter_consent: formData.newsletterConsent ? "Yes" : "No",
          lead_source: "Where Scams Thrive"
        },
        metaDetails: {
          browser: metaDetails.browser || "Unknown",
          device_type: metaDetails.device_type || "Unknown",
          screen_resolution: metaDetails.screen_resolution || "Unknown",
          timezone: metaDetails.timezone || "Unknown",
          ip_address: metaDetails.ip_address || "Unknown",
          city: metaDetails.city || "Unknown",
          region: metaDetails.region || "Unknown",
          country: metaDetails.country || "Unknown"
        }
      };

      // Send admin notification
      const adminResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': import.meta.env.VITE_BREVO_API_KEY
        },
        body: JSON.stringify({
          to: [{ email: 'zasprince007@gmail.com' }],
          templateId: 14,
          params: adminEmailData
        })
      });

      if (!adminResponse.ok) {
        const errorData = await adminResponse.json();
        console.error('Admin notification failed:', errorData);
        throw new Error('Failed to send admin notification');
      }

      const adminResult = await adminResponse.json();
      console.log('Admin notification sent successfully:', adminResult);

      // Send user notification
      const userResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': import.meta.env.VITE_BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: 'ePublic Safety Foundation',
            email: 'info@epublicsf.org'
          },
          to: [{ email: formData.email }],
          templateId: 10,
          params: {
            Name: formData.fullName,
            Email: formData.email,
            'Newsletter Consent': formData.newsletterConsent ? 'Yes' : 'No',
            'Lead Source': 'Where Scams Thrive Landing Page',
            City: metaDetails.city,
            Region: metaDetails.region,
            Country: metaDetails.country,
            'Ip Address': metaDetails.ip_address,
            Browser: metaDetails.browser,
            'Device Type': metaDetails.device_type,
            'Screen Resolution': metaDetails.screen_resolution,
            TimeZone: metaDetails.timezone
          }
        })
      });

      const userResult = await userResponse.json();
      if (!userResponse.ok) {
        console.error('Failed to send user notification:', userResult);
        throw new Error('Failed to send confirmation email');
      }

      setShowSuccessMessage(true);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setError(error.message || 'Failed to process your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 9999999,
          '& .grecaptcha-badge': {
            position: 'static !important',
            margin: '0 24px 24px 0',
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px !important'
          }
        }}
      />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 1
          }
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            py: { xs: 8, md: 12 },
            position: 'relative',
            zIndex: 2
          }}
        >
          <Grid 
            container 
            spacing={{ xs: 6, md: 8 }}
            alignItems="center"
          >
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
                      mb: 3,
                      fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                      background: 'linear-gradient(45deg, #FFFFFF 30%, rgba(255,255,255,0.8) 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    See Where You're Most at Risk — and Why It's Being Ignored
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      mb: 3,
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: { xs: '1.5rem', md: '1.75rem' }
                    }}
                  >
                    Some states make it far too easy for scammers to operate — and families are paying the price.
                  </Typography>

                  <Typography
                    sx={{
                      mb: 4,
                      fontSize: '1.1rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.8
                    }}
                  >
                    This fact sheet highlights 5 states where legal protections are weakest, cancellation periods are shortest, and buyers are left holding the bag.
                  </Typography>

                  <Box 
                    component="ul" 
                    sx={{ 
                      pl: 3,
                      mb: 4,
                      '& li': {
                        mb: 2,
                        fontSize: '1.1rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        '&::before': {
                          content: '"✓"',
                          color: theme.palette.secondary.main,
                          mr: 2,
                          fontWeight: 'bold'
                        }
                      }
                    }}
                  >
                    <Typography component="li">
                      The 5 states where scams thrive
                    </Typography>
                    <Typography component="li">
                      What makes those areas more dangerous for buyers
                    </Typography>
                    <Typography component="li">
                      What lawmakers aren't fixing
                    </Typography>
                    <Typography component="li">
                      How to protect yourself if you live in one of them
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: '1.1rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.8,
                      fontStyle: 'italic'
                    }}
                  >
                    This guide is also part of our fight for change — sign the petition after reading to help protect others.
                  </Typography>
                </motion.div>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={5}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transform: isMobile ? 'none' : 'translateY(-20px)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 3,
                      color: theme.palette.primary.main,
                      fontSize: { xs: '1.75rem', md: '2rem' }
                    }}
                  >
                    Get Your Free Fact Sheet
                  </Typography>

                  <Typography
                    sx={{
                      mb: 4,
                      color: 'text.secondary'
                    }}
                  >
                    Enter your email to get the fact sheet instantly.
                    No spam — just real insight that could save you thousands.
                  </Typography>

                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      sx={{ mb: 3 }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          name="newsletterConsent"
                          checked={formData.newsletterConsent}
                          onChange={handleChange}
                          color="primary"
                        />
                      }
                      label="Get scam alerts and tips straight to your inbox—no spam, just protection."
                      sx={{ mb: 4 }}
                    />

                    {error && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Get My Free Fact Sheet
                    </Button>
                  </form>

                  <Typography
                    sx={{
                      mt: 3,
                      fontSize: '0.9rem',
                      color: 'text.secondary',
                      textAlign: 'center'
                    }}
                  >
                    👉 It's free. No strings attached. Just protection you can actually use.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccessMessage(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Thank you! Your fact sheet has been sent to your email.
        </Alert>
      </Snackbar>
    </>
  );
};

const WhereScamsThrive: React.FC = () => {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
  
  console.log('Initializing reCAPTCHA with site key:', !!recaptchaSiteKey);
  
  if (!recaptchaSiteKey) {
    console.error('reCAPTCHA site key is missing');
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          Form is temporarily unavailable. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      <WhereScamsThrivePage />
    </GoogleReCaptchaProvider>
  );
};

export default WhereScamsThrive; 