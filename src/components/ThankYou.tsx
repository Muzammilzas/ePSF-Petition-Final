import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  LinearProgress,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { usePetition } from '../context/PetitionContext';
import { supabase } from '../services/supabase';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface LocationState {
  signatureNumber?: number;
}

// Add interface for signature data
interface SignatureData {
  id: string;
  created_at: string;
  created_date: string;
  created_time: string;
}

const ThankYou: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { currentPetition, setCurrentPetition } = usePetition();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signatureCount, setSignatureCount] = useState<number | undefined>(undefined);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const state = location.state as LocationState;
  
  // Get the signature number from state, defaulting to 1 if not provided
  const signatureNumber = state?.signatureNumber || 1;

  // Function to get the sign petition URL
  const getSignPetitionUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/`;
  };

  // Function to handle copying the link
  const handleCopyLink = async () => {
    try {
      const url = getSignPetitionUrl();
      await navigator.clipboard.writeText(url);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  useEffect(() => {
    // Count signatures for this petition to get an accurate count
    const countSignatures = async () => {
      try {
        const { count, error } = await supabase
          .from('signatures')
          .select('*', { count: 'exact', head: true })
          .eq('petition_id', id);

        if (error) throw error;
        
        if (count !== null) {
          console.log(`Found ${count} signatures for petition ${id}`);
          setSignatureCount(count);
        }
      } catch (error) {
        console.error('Error counting signatures:', error);
      }
    };

    const fetchPetitionData = async () => {
      try {
        console.log('Fetching petition data for ThankYou page, ID:', id);
        
        // First get the latest signature number with proper typing
        const { data: latestSignature, error: signatureError } = await supabase
          .from('signatures')
          .select('id, created_date, created_time')
          .eq('petition_id', id)
          .order('created_date', { ascending: false })
          .order('created_time', { ascending: false })
          .limit(1)
          .returns<SignatureData[]>();

        if (signatureError) throw signatureError;

        // Then get petition data
        const { data, error } = await supabase
          .from('petitions')
          .select('*')
          .eq('id', id);

        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log('Received petition data:', data[0]);
          setCurrentPetition(data[0]);
          
          // If we have a latest signature, use its position as the signature number
          if (latestSignature && latestSignature.length > 0) {
            const { count: position } = await supabase
              .from('signatures')
              .select('*', { count: 'exact' })
              .eq('petition_id', id)
              .lte('created_date', latestSignature[0].created_date)
              .filter('created_time', 'lte', latestSignature[0].created_time);
            
            if (position !== null) {
              setSignatureCount(position);
            }
          }
        } else {
          console.error('No petition data found for ID:', id);
          setError('Petition not found');
        }
      } catch (error) {
        console.error('Error fetching petition:', error);
        setError('Failed to load petition data');
      } finally {
        setLoading(false);
      }
    };

    fetchPetitionData();
  }, [id, setCurrentPetition]);

  if (loading) {
    return (
      <Container>
        <LinearProgress />
        <Typography variant="h5" align="center" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (error || !currentPetition) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Petition not found'}
        </Alert>
      </Container>
    );
  }

  // Update the display logic
  const displaySignatureNumber = typeof signatureCount === 'number'
    ? signatureCount
    : (currentPetition?.signature_count || 0);
  const formatNumber = (num: number) => num.toLocaleString();
  const progress = currentPetition ? (displaySignatureNumber / (currentPetition.goal || 2000)) * 100 : 0;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <img 
            src="/your-logo.png" 
            alt="ePSF Logo" 
            style={{ 
              height: '60px',
              width: 'auto',
            }} 
          />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" id="petition-thank-you-message">
          Thank You for Signing!
        </Typography>

        <Typography variant="h5" gutterBottom align="center" sx={{ mt: 2, mb: 3, color: '#E0AC3F' }}>
          Your voice matters!
        </Typography>

        <Typography variant="body1" paragraph align="center" sx={{ mt: 3, mb: 4 }}>
          By signing this petition, you're helping ePublic Safety Foundation fight back against timeshare scams and protect consumers.
        </Typography>

        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          Now, let's amplify our impact—share this petition with your friends and family!
        </Typography>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom align="center">
            {formatNumber(displaySignatureNumber)} of {formatNumber(currentPetition?.goal || 2000)} signatures collected
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 10, borderRadius: 5 }} 
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCopyLink}
            startIcon={<PersonAddIcon />}
          >
            Invite a Friend
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Invitation link copied! Share with your friends to join the cause!"
      />
    </Container>
  );
};

export default ThankYou; 