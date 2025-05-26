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
import { supabase } from '../services/supabase';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
};

const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  if (/iPhone|iPad|iPod|Android/i.test(userAgent)) {
    if (/iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) {
      return 'Tablet';
    }
    return 'Mobile';
  }
  return 'Desktop';
};

const BeforeYouSignPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    newsletterConsent: false
  });
  const [locationData, setLocationData] = useState<any>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    const getGeolocationData = async () => {
      try {
        // Get IP address and basic location data
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Get more detailed location data
        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const geoData = await geoResponse.json();
        
        setLocationData({
          ip_address: ipData.ip,
          city: geoData.city,
          region: geoData.region,
          country: geoData.country_name,
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          user_agent: navigator.userAgent,
          browser: getBrowserInfo(),
          device_type: getDeviceType(),
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language
        });
        
        console.log('Collected location data:', geoData);
      } catch (error) {
        console.error('Error fetching location data:', error);
        // Still proceed even if geolocation fails
        setLocationData({
          browser: getBrowserInfo(),
          device_type: getDeviceType(),
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language
        });
      }
    };
    
    getGeolocationData();
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
            SIGNED_UP_PAGE: window.location.origin + '/before-you-sign'
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
      const token = await executeRecaptcha('download_guide');
      console.log('reCAPTCHA token received:', !!token);
      
      if (!token) {
        throw new Error('Failed to execute reCAPTCHA');
      }

      if (!formData.email || !formData.fullName) {
        setError('Please fill in all required fields');
        return;
      }

      console.log('Form Data being submitted:', formData);
      console.log('Location Data:', locationData);

      // First, add contact to Brevo contact list with correct structure
      const contactListData = {
        email: formData.email,
        attributes: {
          NAME: formData.fullName,
          EMAIL: formData.email,
          NEWSLETTER_CONSENT: formData.newsletterConsent ? "Yes" : "No",
          DOWNLOAD_TIME: new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }),
          LEAD_SOURCE: 'Before You Sign a Contract',
          CITY: locationData?.city || 'Not Available',
          REGION: locationData?.region || 'Not Available',
          COUNTRY: locationData?.country || 'Not Available',
          IP_ADDRESS: locationData?.ip_address || 'Not Available',
          BROWSER: locationData?.browser || 'Not Available',
          DEVICE_TYPE: locationData?.device_type || 'Not Available',
          SCREEN_RESOLUTION: locationData?.screen_resolution || 'Not Available',
          TIMEZONE: locationData?.timezone || 'Not Available'
        },
        listIds: [11]
      };

      console.log('Contact List Data being sent to Brevo:', contactListData);

      try {
        const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': import.meta.env.VITE_BREVO_API_KEY
          },
          body: JSON.stringify(contactListData)
        });

        const contactResult = await contactResponse.json();
        console.log('Brevo Contact API Response:', contactResult);

        if (!contactResponse.ok) {
          console.error('Failed to add contact to Brevo:', contactResult);
          // Continue with the rest of the process even if Brevo contact addition fails
        }
      } catch (brevoError) {
        console.error('Error adding contact to Brevo:', brevoError);
        // Continue with the rest of the process even if Brevo contact addition fails
      }

      // Save to Supabase
      const supabaseData = {
        full_name: formData.fullName,
        email: formData.email,
        newsletter_consent: formData.newsletterConsent,
        created_date: new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).split(',')[0].trim(),
        created_time: new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        meta_details: {
          user_info: {
            name: formData.fullName,
            email: formData.email,
            download_time: new Date().toLocaleString('en-US', {
              timeZone: 'America/New_York',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }),
            newsletter_consent: formData.newsletterConsent
          },
          device: {
            browser: locationData?.browser || 'Not Available',
            device_type: locationData?.device_type || 'Not Available',
            screen_resolution: locationData?.screen_resolution || 'Not Available',
            user_agent: locationData?.user_agent || 'Not Available',
            timezone: locationData?.timezone || 'Not Available',
            language: locationData?.language || 'Not Available'
          },
          location: {
            city: locationData?.city || 'Not Available',
            region: locationData?.region || 'Not Available',
            country: locationData?.country || 'Not Available',
            latitude: locationData?.latitude || null,
            longitude: locationData?.longitude || null,
            ip_address: locationData?.ip_address || 'Not Available'
          }
        }
      };

      console.log('Data being sent to Supabase:', supabaseData);

      try {
        const { error: supabaseError } = await supabase
          .from('before_you_sign_submissions')
          .insert([supabaseData]);

        if (supabaseError) {
          console.error('Supabase Error:', supabaseError);
          throw supabaseError;
        }

        // Sync with Google Sheets
        try {
          console.log('Syncing with Google Sheets...');
          const sheetResponse = await fetch('/.netlify/functions/sync-before-you-sign', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!sheetResponse.ok) {
            const errorData = await sheetResponse.json();
            console.error('Google Sheets sync failed:', errorData);
            // Don't throw error here, continue with the rest of the submission
          } else {
            const syncResult = await sheetResponse.json();
            console.log('Google Sheets sync successful:', syncResult);
          }
        } catch (sheetError) {
          console.error('Error syncing with Google Sheets:', sheetError);
          // Don't throw error here, continue with the rest of the submission
        }
      } catch (supabaseError) {
        console.error('Error saving to Supabase:', supabaseError);
        // Continue with email notifications even if Supabase save fails
      }

      // Send email notifications with correct template variables
      const emailTemplateParams = {
        NAME: formData.fullName,
        EMAIL: formData.email,
        DOWNLOAD_TIME: new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        NEWSLETTER_CONSENT: formData.newsletterConsent ? "Yes" : "No",
        LEAD_SOURCE: 'Before You Sign a Contract',
        CITY: locationData?.city || 'Not Available',
        REGION: locationData?.region || 'Not Available',
        COUNTRY: locationData?.country || 'Not Available',
        IP_ADDRESS: locationData?.ip_address || 'Not Available',
        BROWSER: locationData?.browser || 'Not Available',
        DEVICE_TYPE: locationData?.device_type || 'Not Available',
        SCREEN_RESOLUTION: locationData?.screen_resolution || 'Not Available',
        TIMEZONE: locationData?.timezone || 'Not Available'
      };

      console.log('Email Template Params:', emailTemplateParams);

      // Send admin notification
      try {
        const adminResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
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
            templateId: 15,
            params: emailTemplateParams
          })
        });

        const adminResult = await adminResponse.json();
        console.log('Admin Email API Response:', adminResult);

        if (!adminResponse.ok) {
          console.error('Failed to send admin email:', adminResult);
        }
      } catch (adminEmailError) {
        console.error('Error sending admin email:', adminEmailError);
      }

      // Send user notification
      try {
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
            templateId: 11,
            params: emailTemplateParams
          })
        });

        const userResult = await userResponse.json();
        console.log('User Email API Response:', userResult);

        if (!userResponse.ok) {
          console.error('Failed to send user email:', userResult);
        }
      } catch (userEmailError) {
        console.error('Error sending user email:', userEmailError);
      }

      // If we got here, at least some operations succeeded
      setOpenSnackbar(true);
      setFormData({
        fullName: '',
        email: '',
        newsletterConsent: false
      });
    } catch (error: any) {
      console.error('Form submission error:', error);
      setError(error.message || 'Failed to process your request. Please try again.');
    } finally {
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
                  Before You Sign a Timeshare Contract
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mb: 3,
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '1.5rem', md: '1.75rem' }
                  }}
                >
                  What you need to know before making a decision that could cost you thousands.
                </Typography>

                <Typography
                  sx={{
                    mb: 4,
                    fontSize: '1.1rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.8
                  }}
                >
                  This guide reveals the critical questions to ask, red flags to watch for, and your rights as a buyer.
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
                    Key questions to ask before signing
                  </Typography>
                  <Typography component="li">
                    Warning signs to watch for
                  </Typography>
                  <Typography component="li">
                    Your legal rights as a buyer
                  </Typography>
                  <Typography component="li">
                    How to protect yourself
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
                  Get this free guide to make an informed decision about your timeshare purchase.
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
                  Enter your email to get the guide instantly.
                  No spam — just essential information to protect yourself.
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
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
          id="before-you-sign-success-alert"
        >
          Thank you! Your guide has been sent to your email.
        </Alert>
      </Snackbar>
    </Box>
  );
};

const BeforeYouSign: React.FC = () => {
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
      <BeforeYouSignPage />
    </GoogleReCaptchaProvider>
  );
};

export default BeforeYouSign; 