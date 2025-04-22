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

const WhereScamsThrive = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const getMetaDetails = async () => {
      try {
        // Get browser and device details
        const userAgent = navigator.userAgent;
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(userAgent);
        const isTabletDevice = /iPad|Android/i.test(userAgent) && !isMobileDevice;
        
        // Get IP and location details
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Get location details
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

    try {
      // Basic form validation
      if (!formData.email || !formData.fullName) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const contactListData = {
        email: formData.email,
        attributes: {
          FIRSTNAME: formData.fullName.split(' ')[0],
          LASTNAME: formData.fullName.split(' ').slice(1).join(' '),
          NEWSLETTER_CONSENT: formData.newsletterConsent,
          CITY: formData.metaDetails.city,
          REGION: formData.metaDetails.region,
          COUNTRY: formData.metaDetails.country,
          IP_ADDRESS: formData.metaDetails.ipAddress,
          BROWSER: formData.metaDetails.browser,
          DEVICE_TYPE: formData.metaDetails.deviceType,
          SCREEN_RESOLUTION: formData.metaDetails.screenResolution,
          TIMEZONE: formData.metaDetails.timeZone,
          LEAD_SOURCE: 'Where Scams Thrive Landing Page'
        },
        listIds: [12],
        updateEnabled: true,
        emailBlacklisted: false
      };

      // Try to create contact first
      const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': import.meta.env.VITE_BREVO_API_KEY
        },
        body: JSON.stringify(contactListData)
      });

      let contactResult;
      try {
        const responseText = await contactResponse.text();
        contactResult = responseText ? JSON.parse(responseText) : {};
        console.log('Brevo Contact API Response:', contactResult);
        
        // If we get a duplicate contact error, try to update the contact instead
        if (!contactResponse.ok && contactResult.message?.includes('already exists')) {
          // Try to update the existing contact
          const updateResponse = await fetch(`https://api.brevo.com/v3/contacts/${formData.email}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'api-key': import.meta.env.VITE_BREVO_API_KEY
            },
            body: JSON.stringify({
              attributes: contactListData.attributes,
              listIds: contactListData.listIds,
              emailBlacklisted: false
            })
          });
          
          if (!updateResponse.ok) {
            throw new Error('Failed to update existing contact');
          }
        } else if (!contactResponse.ok) {
          throw new Error(contactResult.message || 'Failed to add contact');
        }
      } catch (error) {
        console.error('Error processing contact:', error);
        throw new Error('Failed to process contact');
      }

      // Save to Supabase
      const { error: supabaseError } = await supabase
        .from('where_scams_thrive_submissions')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          newsletter_consent: formData.newsletterConsent,
          meta_details: {
            city: formData.metaDetails.city,
            region: formData.metaDetails.region,
            country: formData.metaDetails.country,
            ip_address: formData.metaDetails.ipAddress,
            browser: formData.metaDetails.browser,
            device_type: formData.metaDetails.deviceType,
            screen_resolution: formData.metaDetails.screenResolution,
            timezone: formData.metaDetails.timeZone
          }
        }]);

      if (supabaseError) {
        throw new Error(`Failed to save submission: ${supabaseError.message}`);
      }

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

      if (!userResponse.ok) {
        const userResult = await userResponse.json();
        console.error('Failed to send user notification:', userResult);
        throw new Error('Failed to send confirmation email');
      }

      // Send admin notification with better error handling and logging
      try {
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

        const adminEmailData = {
          sender: {
            name: 'ePublic Safety Foundation',
            email: 'info@epublicsf.org'
          },
          to: [{ email: 'zasprince007@gmail.com' }],
          templateId: 14,
          params: {
            NAME: formData.fullName || '',
            EMAIL: formData.email || '',
            DOWNLOAD_TIME: downloadTime,
            NEWSLETTER_CONSENT: formData.newsletterConsent ? "Yes" : "No",
            LEAD_SOURCE: "Where Timeshare Scams Thrive",
            CITY: formData.metaDetails.city || '',
            REGION: formData.metaDetails.region || '',
            COUNTRY: formData.metaDetails.country || '',
            IP_ADDRESS: formData.metaDetails.ipAddress || '',
            BROWSER: formData.metaDetails.browser || '',
            DEVICE_TYPE: formData.metaDetails.deviceType || '',
            SCREEN_RESOLUTION: formData.metaDetails.screenResolution || '',
            TIMEZONE: formData.metaDetails.timeZone || ''
          }
        };

        console.log('Sending admin notification with data:', adminEmailData);

        const adminResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': import.meta.env.VITE_BREVO_API_KEY
          },
          body: JSON.stringify(adminEmailData)
        });

        let adminResult;
        try {
          const responseText = await adminResponse.text();
          adminResult = responseText ? JSON.parse(responseText) : {};
          console.log('Admin notification API response:', adminResult);
          
          if (!adminResponse.ok) {
            console.error('Failed to send admin notification:', adminResult);
            throw new Error(`Failed to send admin notification: ${JSON.stringify(adminResult)}`);
          }
        } catch (error) {
          console.error('Error sending admin notification:', error);
          throw error;
        }

        console.log('Admin notification sent successfully');
      } catch (error) {
        console.error('Error sending admin notification:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack
          });
        }
      }

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
      setIsSubmitting(false);
      setShowSuccessMessage(true);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Failed to submit form. Please try again later.');
      setIsSubmitting(false);
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
    </Box>
  );
};

export default WhereScamsThrive; 