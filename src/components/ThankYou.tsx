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

const ThankYou: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPetition, setCurrentPetition } = usePetition();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const state = location.state as LocationState;
  const signatureNumber = state?.signatureNumber;

  useEffect(() => {
    const fetchPetitionData = async () => {
      try {
        const { data, error } = await supabase
          .from('petitions')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setCurrentPetition(data);
        }
      } catch (error) {
        console.error('Error fetching petition:', error);
        setError('Failed to load petition data');
      } finally {
        setLoading(false);
      }
    };

    if (!currentPetition || currentPetition.id !== id) {
      fetchPetitionData();
    } else {
      setLoading(false);
    }
  }, [id, currentPetition, setCurrentPetition]);

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

  const progress = (currentPetition.signature_count / currentPetition.goal) * 100;

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
          You're #{signatureNumber} of {currentPetition.goal} —your voice matters!
        </Typography>

        <Typography variant="body1" paragraph align="center" sx={{ mt: 3, mb: 4 }}>
          Your signature is a powerful step in helping ePublic Safety Foundation combat timeshare scams and secure reform for millions. Together, we're building a movement to protect consumers and pursue justice—share this petition to amplify our impact!
        </Typography>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom align="center">
            {currentPetition.signature_count} of {currentPetition.goal} signatures collected—
            {Math.round(progress)}% toward our goal!
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