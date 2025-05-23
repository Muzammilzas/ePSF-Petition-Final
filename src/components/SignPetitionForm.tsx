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
} from '@mui/material';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { usePetition } from '../context/PetitionContext';
import { addContactToBrevoList } from '../utils/brevo';
import { sendSignatureNotification, sendSharePetitionEmail } from '../utils/email';
import { trackPetitionSignature } from '../services/googleAnalytics';

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
          language: navigator.language,
        });
        
        console.log('Collected location data:', geoData);
      } catch (error) {
        console.error('Error fetching location data:', error);
        // Still proceed even if geolocation fails
      }
    };
    
    getGeolocationData();
  }, []);

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
      console.log('Executing reCAPTCHA...');
      // Execute reCAPTCHA with action
      const token = await executeRecaptcha('sign_petition');
      console.log('reCAPTCHA token received:', !!token);
      
      if (!token) {
        throw new Error('Failed to execute reCAPTCHA');
      }

      console.log('Submitting signature for petition:', id);
      
      // Prepare the basic signature data (required fields only)
      const signaturePayload = {
        petition_id: id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        timeshare_name: formData.timeshare_name,
      };
      
      // Insert the signature with only the required fields
      const { data: signatureData, error: signatureError } = await supabase
        .from('signatures')
        .insert([signaturePayload])
        .select();

      if (signatureError) throw signatureError;
      
      console.log('Signature submitted successfully:', signatureData);

      // Track the successful signature in Google Analytics
      trackPetitionSignature();
      
      // After the signature is submitted successfully and we have signatureData:
      if (signatureData && signatureData.length > 0) {
        try {
          console.log('Adding contact to Brevo list...');
          // Add contact to Brevo list
          const brevoResult = await addContactToBrevoList(
            formData.email,
            formData.first_name,
            formData.last_name
          );
          console.log('Brevo result:', brevoResult);

          // Collect metadata
          const metadata = {
            device: {
              browser: getBrowserInfo(),
              device_type: getDeviceType(),
              screen_resolution: `${window.screen.width}x${window.screen.height}`,
              user_agent: navigator.userAgent,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              language: navigator.language
            },
            location: {
              city: locationData?.city || 'Unknown',
              region: locationData?.region || 'Unknown',
              country: locationData?.country || 'Unknown',
              latitude: locationData?.latitude || null,
              longitude: locationData?.longitude || null,
              ip_address: locationData?.ip_address || 'Unknown'
            },
            submission_date: new Date().toISOString()
          };

          // Store metadata
          const { error: metadataError } = await supabase
            .from('signature_metadata')
            .insert([{
              signature_id: signatureData[0].id,
              metadata: metadata
            }]);

          if (metadataError) {
            console.error('Error storing metadata:', metadataError);
          }

          // Send email notification
          try {
            await sendSignatureNotification({
              ...signatureData[0],
              metadata,
              created_at: new Date().toISOString()
            });
            // Send user confirmation/share email
            await sendSharePetitionEmail({
              ...signatureData[0],
              metadata,
              created_at: new Date().toISOString()
            });
            console.log('Email notification sent successfully');
          } catch (emailError) {
            console.error('Error sending email notification:', emailError);
          }
        } catch (error) {
          console.error('Detailed Brevo error:', error);
        }
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
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign the Petition
        </Typography>
        
        {currentPetition ? (
          <>
            <Typography variant="h5" gutterBottom align="center" color="primary">
              {currentPetition.title}
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
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="What is the name of your Timeshare?"
              name="timeshare_name"
              value={formData.timeshare_name}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Signing...' : 'Sign Petition'}
            </Button>
            
            {loading && <LinearProgress sx={{ mt: 2 }} />}
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              By signing, you're joining our movement to make a difference.
              This site is protected by reCAPTCHA.
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