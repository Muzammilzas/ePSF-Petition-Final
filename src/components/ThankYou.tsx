import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  LinearProgress,
  Button,
  Alert,
} from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { usePetition } from '../context/PetitionContext';
import { supabase } from '../services/supabase';

interface LocationState {
  signatureNumber?: number;
}

// Add interface for signature data
interface SignatureData {
  id: string;
  created_at: string;
}

const ThankYou: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPetition, setCurrentPetition } = usePetition();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signatureCount, setSignatureCount] = useState<number | undefined>(undefined);
  const state = location.state as LocationState;
  
  // Get the signature number from state, defaulting to 1 if not provided
  // This ensures we always show at least 1 for the user who just signed
  const signatureNumber = state?.signatureNumber || 1;

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
          .select('id, created_at')
          .eq('petition_id', id)
          .order('created_at', { ascending: false })
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
              .lte('created_at', latestSignature[0].created_at);
            
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

  const handleShareClick = () => {
    navigate(`/share/${id}`);
  };

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
  const displaySignatureNumber = signatureCount || currentPetition?.signature_count || 0;
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

        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          You're #{displaySignatureNumber} of {currentPetition?.goal || 2000} supporters—your voice matters!
        </Typography>

        <Typography variant="body1" paragraph align="center" sx={{ mt: 3, mb: 4 }}>
          Your signature is a powerful step in helping ePublic Safety Foundation combat timeshare scams and secure reform for millions. Together, we're building a movement to protect consumers and pursue justice—share this petition to amplify our impact!
        </Typography>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom align="center">
            {displaySignatureNumber} of {currentPetition?.goal || 2000} signatures collected
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 10, borderRadius: 5 }} 
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleShareClick}
          >
            Share This Petition
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ThankYou; 