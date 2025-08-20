import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  LinearProgress,
  Grid,
} from '@mui/material';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { usePetition } from '../context/PetitionContext';
import { addContactToBrevoList } from '../utils/brevo';
import { sendSignatureNotification, sendSharePetitionEmail } from '../utils/email';
import { trackPetitionSignature } from '../services/googleAnalytics';
import { collectMetaDetails } from '../utils/metaDetails';

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
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'Mobile';
  }
  if (/iPad|Android|Tablet/.test(userAgent)) {
    return 'Tablet';
  }
  return 'Desktop';
};

const SignPetitionFormContent: React.FC = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { id } = useParams<{ id: string }>();
  const { currentPetition, setCurrentPetition } = usePetition();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    timeshare_name: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);
  const navigate = useNavigate();

  // Function to fetch current petition data
  const fetchPetitionData = async () => {
    try {
      const { data, error } = await supabase
        .from('petitions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        console.log('Fetched petition data:', data);
        setCurrentPetition(data);
      }
    } catch (error) {
      console.error('Error fetching petition:', error);
      setError('Failed to load petition');
    }
  };

  // Fetch petition data if not available
  useEffect(() => {
    if (!currentPetition && id) {
      fetchPetitionData();
    }
  }, [id, currentPetition]);

  // Fetch geolocation data when component mounts
  useEffect(() => {
    const getGeolocationData = async () => {
      try {
        console.log('Starting location data collection...');
        
        // Use ipapi.co directly instead of going through ipify first
        const geoResponse = await fetch('https://ipapi.co/json/');
        if (!geoResponse.ok) {
          throw new Error(`Failed to fetch location data: ${geoResponse.status}`);
        }
        
        const geoData = await geoResponse.json();
        console.log('Location data fetched:', geoData);
        
        if (geoData.error) {
          throw new Error(`Location API error: ${geoData.error}`);
        }

        const locationInfo = {
          ip_address: geoData.ip,
          city: geoData.city || 'Unknown',
          region: geoData.region || 'Unknown',
          country: geoData.country_name || 'Unknown',
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          user_agent: navigator.userAgent,
          browser: getBrowserInfo(),
          device_type: getDeviceType(),
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
        };
        
        console.log('Setting location data:', locationInfo);
        setLocationData(locationInfo);
      } catch (error) {
        console.error('Error fetching location data:', error);
        // Set default location data with device info even if location fetch fails
        const defaultLocationInfo = {
          ip_address: 'Unknown',
          city: 'Unknown',
          region: 'Unknown',
          country: 'Unknown',
          latitude: null,
          longitude: null,
          user_agent: navigator.userAgent,
          browser: getBrowserInfo(),
          device_type: getDeviceType(),
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
        };
        console.log('Setting default location data:', defaultLocationInfo);
        setLocationData(defaultLocationInfo);
      }
    };
    
    getGeolocationData();
  }, []);

  // Add a debug log for locationData changes
  useEffect(() => {
    console.log('Location data updated:', locationData);
  }, [locationData]);

  useEffect(() => {
    // Debug environment variables
    console.log('Environment check:', {
      hasRecaptcha: !!import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      hasBrevo: !!import.meta.env.VITE_BREVO_API_KEY,
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!executeRecaptcha) {
      console.error('reCAPTCHA not initialized');
      setError('reCAPTCHA not yet available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Execute reCAPTCHA with action
      const token = await executeRecaptcha('sign_petition');
      console.log('reCAPTCHA token received:', !!token);
      
      if (!token) {
        throw new Error('Failed to execute reCAPTCHA');
      }

      // Collect metadata using the shared utility
      let metaDetails;
      try {
        console.log('Starting meta details collection in form submission...');
        metaDetails = await collectMetaDetails();
        console.log('Successfully collected meta details:', metaDetails);

        // Validate the collected meta details
        if (!metaDetails || !metaDetails.browser || !metaDetails.device_type) {
          console.warn('Meta details are incomplete:', metaDetails);
          // Try collecting again
          metaDetails = await collectMetaDetails();
          console.log('Second attempt meta details:', metaDetails);
        }
      } catch (error) {
        console.error('Error collecting meta details:', error);
        // Continue with form submission even if meta details collection fails
        // but try one more time with a delay
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          metaDetails = await collectMetaDetails();
          console.log('Retry meta details:', metaDetails);
        } catch (retryError) {
          console.error('Retry error collecting meta details:', retryError);
          metaDetails = null;
        }
      }

      // Format metadata for storage - directly use the collected meta details
      const signaturePayload = {
        petition_id: id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        timeshare_name: formData.timeshare_name,
        meta_details: metaDetails, // flat structure
        created_date: new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        created_time: new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      };

      console.log('Full signature payload:', JSON.stringify(signaturePayload, null, 2));

      // Insert the signature with metadata
      const { data: signatureData, error: signatureError } = await supabase
        .from('signatures')
        .insert([signaturePayload])
        .select();

      if (signatureError) {
        console.error('Error creating signature:', signatureError);
        console.error('Error details:', JSON.stringify(signatureError, null, 2));
        if (signatureError.message.includes('timeshare_name')) {
          throw new Error('Failed to save timeshare name. Please try again.');
        }
        throw signatureError;
      }
      
      console.log('Signature created successfully. Response data:', JSON.stringify(signatureData, null, 2));

      // Track the successful signature in Google Analytics
      trackPetitionSignature();
      
      // After the signature is submitted successfully and we have signatureData:
      try {
        console.log('Adding contact to Brevo list...');
        // Add contact to Brevo list
        const brevoResult = await addContactToBrevoList(
          formData.email,
          formData.first_name,
          formData.last_name
        );
        console.log('Brevo result:', brevoResult);

        // Trigger Google Sheets sync
        try {
          const syncResponse = await fetch('/.netlify/functions/sync-petition-signatures', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!syncResponse.ok) {
            console.warn('Google Sheets sync failed:', await syncResponse.text());
            // Don't throw error, continue with form submission
          } else {
            console.log('Google Sheets sync successful');
          }
        } catch (syncError) {
          console.warn('Google Sheets sync error:', syncError);
          // Don't throw error, continue with form submission
        }

        // Send email notification
        try {
          await sendSignatureNotification({
            ...signatureData[0],
            metadata: metaDetails, // flat structure
            created_at: new Date().toISOString()
          });
          // Send user confirmation/share email
          await sendSharePetitionEmail({
            ...signatureData[0],
            metadata: metaDetails, // flat structure
            created_at: new Date().toISOString()
          });
          console.log('Email notification sent successfully');
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
        }
      } catch (error) {
        console.error('Detailed Brevo error:', error);
      }

      // Count all signatures for this petition to get the accurate count
      const { count, error: countError } = await supabase
        .from('signatures')
        .select('*', { count: 'exact', head: true })
        .eq('petition_id', id);
        
      if (countError) {
        console.error('Error counting signatures:', countError);
      }
      
      // Use the count from the database or calculate it
      const actualCount = count !== null ? count : (currentPetition ? currentPetition.signature_count + 1 : 1);
      console.log(`Total signatures for this petition: ${actualCount}`);
      
      // Update the petition with the new signature count
      const { error: updateError } = await supabase
        .from('petitions')
        .update({ signature_count: actualCount })
        .eq('id', id);
        
      if (updateError) {
        console.error('Error updating signature count:', updateError);
      }
      
      // Reset form and show success message
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        timeshare_name: '',
      });
      setSuccess(true);
      
      // Navigate to thank you page
      setTimeout(() => {
        navigate(`/thank-you/${id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to submit signature');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src="/your-logo.png" alt="ePSF Logo" style={{ height: 60, width: 'auto' }} />
        </Box>
        {currentPetition ? (
          <>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#01BD9B', fontWeight: 'bold', mb: 3 }}>
              Take a Stand Against Timeshare Abuse
            </Typography>

            <Typography variant="h5" gutterBottom align="center" color="primary">
              {currentPetition.title}
            </Typography>

            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#555', mb: 4 }}>
              Demand stronger protections from misleading contracts, shady sales tactics, and unexpected fees that trap families in unfair deals.
            </Typography>

            <Typography variant="h4" component="h1" gutterBottom align="center">
              Sign the Petition
            </Typography>

            <Typography variant="body1" paragraph>
              {currentPetition.story}
            </Typography>
          </>
        ) : (
          <LinearProgress />
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 2 }} id="petition-form-success-alert">
              Thank you for signing the petition!
            </Alert>
            <Button
              component={Link}
              to={`/share/${id}`}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              View Petition Progress
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={loading}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fff',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              disabled={loading}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fff',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fff',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
                  label="Timeshare Name"
              name="timeshare_name"
              value={formData.timeshare_name}
              onChange={handleChange}
              disabled={loading}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fff',
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                bgcolor: '#01BD9B',
                '&:hover': {
                  bgcolor: '#01a989'
                }
              }}
            >
              {loading ? 'Signing...' : 'Sign Petition'}
            </Button>
            
            {loading && <LinearProgress sx={{ mt: 2 }} />}
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              By signing, you're joining our movement to make a difference.
              This site is protected by reCAPTCHA.
            </Typography>
            
            <Typography 
              variant="h6" 
              align="center" 
              sx={{ 
                mt: 4, 
                mb: 3, 
                color: '#01BD9B',
                fontStyle: 'italic',
                fontWeight: 500,
                maxWidth: '90%',
                mx: 'auto'
              }}
            >
              "Everyone deserves transparency, honesty, and respect when making vacation investments. Let's hold the timeshare industry to higher standards."
            </Typography>
            
            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                Petition Disclaimer:
              </Typography>
              <Typography variant="body2" color="text.secondary" align="left">
                This petition is for informational and advocacy purposes only. It does not constitute legal advice or representation. 
                The organizers are not attorneys and are not affiliated with any law firm. Statements in this petition reflect personal 
                experiences, publicly available information, and concerns shared by affected timeshare owners. All individuals are 
                encouraged to consult a licensed attorney for legal advice regarding their own circumstances. The petition's purpose 
                is to raise awareness and advocate for consumer protections, transparency, and reform in the timeshare industry.
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

// Update the wrapper component to use environment variable
const SignPetitionForm: React.FC = () => {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  
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
      <SignPetitionFormContent />
    </GoogleReCaptchaProvider>
  );
};

export default SignPetitionForm;