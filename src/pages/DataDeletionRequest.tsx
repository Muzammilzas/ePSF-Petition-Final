import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { supabase } from '../supabase';

const DataDeletionRequest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Delete from Supabase
      const { error: supabaseError } = await supabase
        .from('form_submissions')
        .delete()
        .eq('email', email);

      if (supabaseError) throw supabaseError;

      // 2. Delete from Brevo (newsletter list)
      const brevoResponse = await fetch('https://api.brevo.com/v3/contacts/' + email, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY!
        }
      });

      if (!brevoResponse.ok) {
        throw new Error('Failed to delete from newsletter list');
      }

      setSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Error deleting data:', error);
      setError('Failed to process your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Data Deletion Request
        </Typography>
        <Typography variant="body1" paragraph>
          Under GDPR, you have the right to request the deletion of your personal data. 
          Please enter your email address below to submit a deletion request.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your data deletion request has been processed successfully. All your personal data has been removed from our systems.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3 }}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Processing...' : 'Submit Deletion Request'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Note: This process will delete all your personal data from our systems, including:
        </Typography>
        <ul>
          <li>Form submissions</li>
          <li>Newsletter subscriptions</li>
          <li>Contact information</li>
        </ul>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          If you have any questions about this process, please contact us at{' '}
          <a href="mailto:privacy@epublicsf.org">privacy@epublicsf.org</a>
        </Typography>
      </Paper>
    </Container>
  );
};

export default DataDeletionRequest; 