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
    // Debug environment variables and reCAPTCHA initialization
    console.log('Form Environment Check:', {
      hasRecaptcha: !!import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      hasBrevo: !!import.meta.env.VITE_BREVO_API_KEY,
      recaptchaInitialized: !!executeRecaptcha,
    });
  }, [executeRecaptcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started...');
    
    if (!executeRecaptcha) {
      console.error('reCAPTCHA not initialized - check if site key is correct and domain is allowed');
      setError('Form validation not available. Please try again in a few moments.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Executing reCAPTCHA verification...');
      const token = await executeRecaptcha('sign_petition');
      console.log('reCAPTCHA verification completed:', !!token);
      
      if (!token) {
        throw new Error('Failed to execute reCAPTCHA verification');
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
      // This avoids errors with missing columns
      const { data: signatureData, error: signatureError } = await supabase
        .from('signatures')
        .insert([signaturePayload])
        .select();

      if (signatureError) throw signatureError;
      
      console.log('Signature submitted successfully:', signatureData);
      
      // After successful signature submission:
      if (signatureData && signatureData.length > 0) {
        try {
          console.log('Attempting to add contact to Brevo...', {
            email: formData.email,
            firstName: formData.first_name,
            lastName: formData.last_name,
            timeshareName: formData.timeshare_name
          });

          const brevoResult = await addContactToBrevoList(
            formData.email,
            formData.first_name,
            formData.last_name,
            formData.timeshare_name
          );
          
          if (!brevoResult.success) {
            console.warn('Brevo contact addition failed:', brevoResult.error);
            // Don't show error to user, just log it
          } else {
            console.log('Brevo contact addition successful:', brevoResult.data);
          }

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
            location: locationData || {
              city: 'Unknown',
              region: 'Unknown',
              country: 'Unknown'
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
        } catch (error: any) {
          console.error('Brevo integration error:', error);
          // Don't throw the error - we still want to show success to the user
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
      console.error('Form submission error:', {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });
      setError(err.message || 'Failed to submit signature. Please try again.');
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
            <Alert severity="success" sx={{ mb: 2 }}>
              Thank you for signing the petition!
            </Alert>
            <Button
              component={Link}
              to={`/thank-you/${id}`}
            >
              Go to Thank You Page
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Timeshare Name"
              name="timeshare_name"
              value={formData.timeshare_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? 'Submitting...' : 'Sign Petition'}
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default SignPetitionFormContent;