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
  useMediaQuery,
  Link
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

const SpottingExitScamsPage = () => {
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
        // Get IP address using ipify
        const ipResponse = await fetch('https://api.ipify.org?format=json', {
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });
        const ipData = await ipResponse.json();
        
        // Get location data using ip-api (free, no key required)
        try {
          const geoResponse = await fetch(`https://ip-api.com/json/${ipData.ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone`, {
            mode: 'cors',
            headers: {
              'Accept': 'application/json'
            }
          });
          const geoData = await geoResponse.json();
          
          if (geoData.status === 'success') {
            setLocationData({
              ip_address: ipData.ip,
              city: geoData.city || 'Not Available',
              region: geoData.regionName || 'Not Available',
              country: geoData.country || 'Not Available',
              latitude: geoData.lat || null,
              longitude: geoData.lon || null,
              user_agent: navigator.userAgent,
              browser: getBrowserInfo(),
              device_type: getDeviceType(),
              screen_resolution: `${window.screen.width}x${window.screen.height}`,
              timezone: geoData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
              language: navigator.language
            });
            
            console.log('Successfully collected location data:', geoData);
          } else {
            throw new Error('Geolocation failed');
          }
        } catch (geoError) {
          console.error('Error getting location data:', geoError);
          // Fallback to basic data if geolocation fails
          setLocationData({
            ip_address: ipData.ip,
            city: 'Not Available',
            region: 'Not Available',
            country: 'Not Available',
            latitude: null,
            longitude: null,
            user_agent: navigator.userAgent,
            browser: getBrowserInfo(),
            device_type: getDeviceType(),
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language
          });
        }
      } catch (error) {
        console.error('Error getting IP address:', error);
        // If everything fails, use basic device info
        setLocationData({
          ip_address: 'Not Available',
          city: 'Not Available',
          region: 'Not Available',
          country: 'Not Available',
          latitude: null,
          longitude: null,
          user_agent: navigator.userAgent,
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
            SIGNED_UP_PAGE: window.location.origin + '/spotting-exit-scams'
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
          SIGNED_UP_PAGE: window.location.origin + '/spotting-exit-scams'
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
            to: [{ email: 'timeshare@epublicsf.org' }],
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

      // First, add contact to Brevo contact list
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
          LEAD_SOURCE: 'Spotting Exit Scams Guide',
          CITY: locationData?.city || 'Not Available',
          REGION: locationData?.region || 'Not Available',
          COUNTRY: locationData?.country || 'Not Available',
          IP_ADDRESS: locationData?.ip_address || 'Not Available',
          BROWSER: locationData?.browser || 'Not Available',
          DEVICE_TYPE: locationData?.device_type || 'Not Available',
          SCREEN_RESOLUTION: locationData?.screen_resolution || 'Not Available',
          TIMEZONE: locationData?.timezone || 'Not Available'
        },
        listIds: [12],
        updateEnabled: true,
        emailBlacklisted: false
      };

      console.log('Contact List Data being sent to Brevo:', contactListData);

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
        console.error('Error parsing Brevo response:', error);
        throw new Error('Failed to process contact');
      }

      // Save to Supabase
      const supabaseData = {
        full_name: formData.fullName,
        email: formData.email,
        newsletter_consent: formData.newsletterConsent,
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

      // Try to insert into Supabase, but continue even if it fails
      try {
        const { error: supabaseError } = await supabase
          .from('spotting_exit_scams_submissions')
          .insert([supabaseData]);

        if (supabaseError) {
          console.error('Supabase Error:', supabaseError);
          // Continue with email sending even if Supabase fails
        }
      } catch (error) {
        console.error('Supabase Insert Error:', error);
        // Continue with email sending even if Supabase fails
      }

      // Send admin notification
      const emailTemplateParams = {
        name: formData.fullName,
        email: formData.email,
        downloadTime: new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        newsletterConsent: formData.newsletterConsent ? "Yes" : "No",
        leadSource: 'Spotting Exit Scams',
        city: locationData?.city || 'Not Available',
        region: locationData?.region || 'Not Available',
        country: locationData?.country || 'Not Available',
        ipAddress: locationData?.ip_address || 'Not Available',
        browser: locationData?.browser || 'Not Available',
        deviceType: locationData?.device_type || 'Not Available',
        screenResolution: locationData?.screen_resolution || 'Not Available',
        timeZone: locationData?.timezone || 'Not Available'
      };

      console.log('Email Template Params:', emailTemplateParams);

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
          to: [{ email: 'timeshare@epublicsf.org' }],
          templateId: 16,
          params: emailTemplateParams
        })
      });

      let adminResult;
      try {
        const responseText = await adminResponse.text();
        adminResult = responseText ? JSON.parse(responseText) : {};
        console.log('Admin Email API Response:', adminResult);
      } catch (error) {
        console.error('Error parsing admin email response:', error);
        adminResult = {};
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
          templateId: 12,
          params: emailTemplateParams
        })
      });

      let userResult;
      try {
        const responseText = await userResponse.text();
        userResult = responseText ? JSON.parse(responseText) : {};
        console.log('User Email API Response:', userResult);
      } catch (error) {
        console.error('Error parsing user email response:', error);
        userResult = {};
      }

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
                    Spotting Exit Scams Guide
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      mb: 3,
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: { xs: '1.5rem', md: '1.75rem' }
                    }}
                  >
                    Learn how to identify and avoid exit scams before they happen.
                  </Typography>

                  <Typography
                    sx={{
                      mb: 4,
                      fontSize: '1.1rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.8
                    }}
                  >
                    This comprehensive guide will help you recognize the warning signs and protect yourself from exit scams.
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
                      Common exit scam patterns
                    </Typography>
                    <Typography component="li">
                      Warning signs to watch for
                    </Typography>
                    <Typography component="li">
                      How to protect yourself
                    </Typography>
                    <Typography component="li">
                      What to do if you're a victim
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
                    Get this free guide to protect yourself from exit scams.
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
                          checked={formData.newsletterConsent}
                          onChange={handleChange}
                          name="newsletterConsent"
                          color="primary"
                        />
                      }
                      label="Get scam alerts and tips straight to your inbox—no spam, just protection."
                      sx={{ mb: 3 }}
                    />

                    {error && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                      sx={{ mt: 2 }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Get My Free Fact Sheet'}
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
            Thank you! Your guide has been sent to your email.
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

const SpottingExitScams: React.FC = () => {
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
      <SpottingExitScamsPage />
    </GoogleReCaptchaProvider>
  );
};

export default SpottingExitScams; 