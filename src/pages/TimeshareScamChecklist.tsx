import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  useTheme,
  Grid,
  Alert,
  Snackbar,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../components/Home/common/animations';
import { supabase } from '../supabase';

const TimeshareScamChecklist = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    newsletterConsent: false,
    metaDetails: {
      city: '',
      region: '',
      country: '',
      ipAddress: '',
      browser: '',
      deviceType: '',
      screenResolution: '',
      timeZone: ''
    }
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getMetaDetails = async () => {
      try {
        // Get browser and device details
        const userAgent = navigator.userAgent;
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(userAgent);
        const isTabletDevice = /iPad|Android/i.test(userAgent) && !isMobileDevice;
        
        // Get IP and location details using a different service
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Get location details using a different service
        const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const locationData = await locationResponse.json();
        
        setFormData(prev => ({
          ...prev,
          metaDetails: {
            city: locationData.city || '',
            region: locationData.region || '',
            country: locationData.country_name || '',
            ipAddress: ipData.ip || '',
            browser: navigator.userAgent,
            deviceType: isMobileDevice ? 'Mobile' : isTabletDevice ? 'Tablet' : 'Desktop',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        }));
      } catch (error) {
        console.error('Error fetching meta details:', error);
        // Set default values if API calls fail
        setFormData(prev => ({
          ...prev,
          metaDetails: {
            ...prev.metaDetails,
            browser: navigator.userAgent,
            deviceType: isMobile ? 'Mobile' : 'Desktop',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        }));
      }
    };

    getMetaDetails();
  }, []);

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
            SIGNUP_TIME: new Date().toLocaleString('en-US', {
              timeZone: 'America/New_York',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }),
            SIGNED_UP_PAGE: window.location.origin + '/timeshare-scam-checklist'
          },
          listIds: [13],
          updateEnabled: true
        };

        console.log('Adding to newsletter list with data:', newsletterContactData);

        const newsletterResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': import.meta.env.VITE_BREVO_API_KEY
          },
          body: JSON.stringify(newsletterContactData)
        });

        let newsletterResult;
        try {
          const responseText = await newsletterResponse.text();
          newsletterResult = responseText ? JSON.parse(responseText) : {};
          console.log('Newsletter List Addition Response:', newsletterResult);
        } catch (error) {
          console.error('Error parsing newsletter list response:', error);
          newsletterResult = {};
        }

        // Send admin notification for newsletter signup
        const adminNewsletterParams = {
          FIRSTNAME: formData.fullName.split(' ')[0] || 'Subscriber',
          NAME: formData.fullName,
          EMAIL: formData.email,
          SIGNUP_TIME: new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }),
          SIGNED_UP_PAGE: window.location.origin + '/timeshare-scam-checklist'
        };

        console.log('Sending admin newsletter notification with params:', adminNewsletterParams);

        const adminNewsletterResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': import.meta.env.VITE_BREVO_API_KEY
          },
          body: JSON.stringify({
            sender: {
              name: 'ePublic Safety Foundation',
              email: 'admin@epublicsf.org'
            },
            to: [{ email: 'zasprince007@gmail.com' }],
            templateId: 18,
            params: adminNewsletterParams
          })
        });

        let adminNewsletterResult;
        try {
          const responseText = await adminNewsletterResponse.text();
          adminNewsletterResult = responseText ? JSON.parse(responseText) : {};
          console.log('Admin Newsletter Notification Response:', adminNewsletterResult);
        } catch (error) {
          console.error('Error parsing admin newsletter notification response:', error);
          adminNewsletterResult = {};
        }

        // Send consent email to user
        const consentEmailParams = {
          NAME: formData.fullName || 'Subscriber',
          EMAIL: formData.email
        };

        console.log('Sending consent email with params:', consentEmailParams);

        const consentResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
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
            params: consentEmailParams
          })
        });

        let consentResult;
        try {
          const responseText = await consentResponse.text();
          consentResult = responseText ? JSON.parse(responseText) : {};
          console.log('Consent Email API Response:', consentResult);
        } catch (error) {
          console.error('Error parsing consent email response:', error);
          consentResult = {};
        }
      } catch (error) {
        console.error('Error in newsletter signup process:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.fullName) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Format current time in EST
      const downloadTime = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short' // This will add EST/EDT as appropriate
      });

      // Save to Supabase with meta_details as JSONB
      const { data: mainData, error: mainError } = await supabase
        .from('timeshare_scam_checklist')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          newsletter_consent: formData.newsletterConsent,
          meta_details: {
            user_info: {
              name: formData.fullName,
              email: formData.email,
              download_time: downloadTime, // Now includes EST/EDT indicator
              newsletter_consent: formData.newsletterConsent
            },
            device: {
              browser: formData.metaDetails.browser,
              device_type: formData.metaDetails.deviceType,
              screen_resolution: formData.metaDetails.screenResolution,
              timezone: 'America/New_York', // Set to EST explicitly
              language: navigator.language,
              user_agent: navigator.userAgent
            },
            location: {
              city: formData.metaDetails.city,
              region: formData.metaDetails.region,
              country: formData.metaDetails.country,
              ip_address: formData.metaDetails.ipAddress
            }
          }
        })
        .select()
        .single();

      if (mainError) {
        console.error('Error saving to Supabase:', mainError);
        throw new Error('Failed to save submission');
      }

      // Update newsletter signup time format
      const signupTime = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      });

      // Test Brevo API first
      console.log('Testing Brevo API...');
      const testResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': import.meta.env.VITE_BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: 'ePublic Safety Foundation',
            email: 'admin@epublicsf.org'
          },
          to: [{ email: 'info@epublicsf.org' }],
          templateId: 13,
          params: {
            Name: formData.fullName,
            Email: formData.email,
            'Download Time': downloadTime,
            'Newsletter Consent': formData.newsletterConsent ? 'Yes' : 'No',
            'Lead Source': 'Timeshare Checklist Landing Page',
            City: formData.metaDetails.city,
            Region: formData.metaDetails.region,
            Country: formData.metaDetails.country,
            'Ip Address': formData.metaDetails.ipAddress,
            Browser: formData.metaDetails.browser,
            'Device Type': formData.metaDetails.deviceType,
            'Screen Resolution': formData.metaDetails.screenResolution,
            TimeZone: 'America/New_York'
          }
        })
      });

      const testResult = await testResponse.json();
      console.log('Brevo API Test Result:', testResult);

      if (!testResponse.ok) {
        throw new Error(`Brevo API test failed: ${testResult.message || 'Unknown error'}`);
      }

      // First, add contact to list
      console.log('Adding contact to list...', {
        email: formData.email,
        listId: 9,
        attributes: {
          FIRSTNAME: formData.fullName.split(' ')[0],
          LASTNAME: formData.fullName.split(' ').slice(1).join(' '),
          EMAIL: formData.email,
          NEWSLETTER_CONSENT: formData.newsletterConsent
        }
      });

      const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': import.meta.env.VITE_BREVO_API_KEY
        },
        body: JSON.stringify({
          email: formData.email,
          listIds: [9],
          attributes: {
            FIRSTNAME: formData.fullName.split(' ')[0],
            LASTNAME: formData.fullName.split(' ').slice(1).join(' '),
            EMAIL: formData.email,
            NEWSLETTER_CONSENT: formData.newsletterConsent
          }
        })
      });

      const contactResult = await contactResponse.json();
      console.log('Contact add response:', contactResult);

      if (!contactResponse.ok) {
        console.error('Failed to add contact:', contactResult);
      }

      // Send user notification
      console.log('Sending user notification...', {
        to: formData.email,
        templateId: 9,
        params: {
          fullName: formData.fullName,
          email: formData.email,
          newsletterConsent: formData.newsletterConsent,
          ...formData.metaDetails
        }
      });

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
          templateId: 9,
          params: {
            Name: formData.fullName,
            Email: formData.email,
            'Download Time': downloadTime,
            'Newsletter Consent': formData.newsletterConsent ? 'Yes' : 'No',
            'Lead Source': 'Timeshare Checklist Landing Page',
            City: formData.metaDetails.city,
            Region: formData.metaDetails.region,
            Country: formData.metaDetails.country,
            'Ip Address': formData.metaDetails.ipAddress,
            Browser: formData.metaDetails.browser,
            'Device Type': formData.metaDetails.deviceType,
            'Screen Resolution': formData.metaDetails.screenResolution,
            TimeZone: formData.metaDetails.timeZone
          }
        })
      });

      const userResult = await userResponse.json();
      console.log('User notification response:', userResult);

      if (!userResponse.ok) {
        console.error('Timeshare Scam Checklist - User notification error:', userResult);
        throw new Error(`Failed to send user notification: ${userResult.message || 'Unknown error'}`);
      }

      setOpenSnackbar(true);
      setFormData({ 
        fullName: '', 
        email: '', 
        newsletterConsent: false, 
        metaDetails: { 
          city: '', 
          region: '', 
          country: '', 
          ipAddress: '', 
          browser: '', 
          deviceType: '', 
          screenResolution: '', 
          timeZone: '' 
        } 
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit form. Please try again later.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
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
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 1
        }
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 4, md: 6 },
          position: 'relative',
          zIndex: 2
        }}
      >
        <Grid 
          container 
          spacing={4}
          sx={{
            flex: 1,
            alignItems: 'center'
          }}
        >
          <Grid item xs={12} md={6}>
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
                  Your First Step to Freedom from Timeshare Scams
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mb: 3,
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '1.5rem', md: '1.75rem' }
                  }}
                >
                  Protect yourself before you sign. Avoid hidden fees, false promises, and fake exit companies.
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
                    What to ask before attending a sales pitch
                  </Typography>
                  <Typography component="li">
                    Red flags buried in contracts and resale terms
                  </Typography>
                  <Typography component="li">
                    How to know if an exit company is a scam
                  </Typography>
                  <Typography component="li">
                    What to do if you're already trapped
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
                  💡 Most people don't realize they've been scammed — until it's too late.
                  This checklist helps make sure you won't be one of them.
                </Typography>
              </motion.div>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
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
                  Get Your Free Checklist
                </Typography>

                <Typography
                  sx={{
                    mb: 4,
                    color: 'text.secondary'
                  }}
                >
                  Enter your email below to get instant access.
                  We'll send the checklist straight to your inbox.
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
                    Get My Free Checklist
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Thank you! Your checklist has been sent to your email.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TimeshareScamChecklist; 