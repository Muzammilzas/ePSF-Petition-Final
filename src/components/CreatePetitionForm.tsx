import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { usePetition } from '../context/PetitionContext';

const CreatePetitionForm: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentPetition } = usePetition();
  const [formData, setFormData] = useState({
    goal: '1000',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'goal') {
      // Only allow positive integers for goal
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Submitting petition:', {
        goal: parseInt(formData.goal),
      });

      const { data, error } = await supabase
        .from('petitions')
        .insert([
          {
            goal: parseInt(formData.goal),
            signature_count: 0,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Created petition:', data);

      if (data) {
        setCurrentPetition(data);
        navigate(`/share/${data.id}`);
      } else {
        throw new Error('No data returned from petition creation');
      }
    } catch (error: any) {
      console.error('Error creating petition:', error);
      setError(error.message || 'Failed to create petition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Timeshare Petition!
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Timeshare scams trap millions-ePSF is fighting back.
        </Typography>
        <Typography variant="h6" gutterBottom align="center" color="primary">
          Set your signature goal below
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Signature Goal"
            name="goal"
            type="text"
            value={formData.goal}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Enter the number of signatures you want to collect"
            inputProps={{ 
              min: 1,
              pattern: '[0-9]*'
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={loading || !formData.goal}
          >
            {loading ? 'Creating...' : 'Create Petition'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePetitionForm; 