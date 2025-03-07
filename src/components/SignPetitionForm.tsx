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
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { usePetition } from '../context/PetitionContext';

const SignPetitionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentPetition, setCurrentPetition } = usePetition();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Submitting signature for petition:', id);
      
      // Insert the signature
      const { error: signatureError } = await supabase
        .from('signatures')
        .insert([
          {
            petition_id: id,
            ...formData,
          },
        ])
        .select()
        .single();

      if (signatureError) throw signatureError;

      // Fetch updated petition data
      const { data: updatedPetition, error: petitionError } = await supabase
        .from('petitions')
        .select('*')
        .eq('id', id)
        .single();

      if (petitionError) throw petitionError;

      if (updatedPetition) {
        setCurrentPetition(updatedPetition);
        setSuccess(true);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
        });
        
        // Navigate to thank you page with the signature number
        navigate(`/thank-you/${id}`, {
          state: { signatureNumber: updatedPetition.signature_count }
        });
      }
    } catch (error: any) {
      console.error('Error signing petition:', error);
      setError(error.message || 'Failed to sign petition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentPetition) {
    return (
      <Container>
        <LinearProgress />
        <Typography variant="h5" align="center" sx={{ mt: 2 }}>
          Loading petition...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign the Petition
        </Typography>
        
        <Typography variant="h5" gutterBottom align="center" color="primary">
          {currentPetition.title}
        </Typography>

        <Typography variant="body1" paragraph>
          {currentPetition.story}
        </Typography>

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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Signing...' : 'Sign Petition'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default SignPetitionForm; 