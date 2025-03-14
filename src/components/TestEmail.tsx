import React, { useState } from 'react';
import { Button, Container, Alert, Paper, Typography } from '@mui/material';
import { testEmailNotification } from '../utils/email';

const TestEmail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTestEmail = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await testEmailNotification();
      setSuccess(true);
    } catch (err: any) {
      console.error('Test email error:', err);
      setError(err.message || 'Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Test Email Notification
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Test email sent successfully! Check info@epublicsf.org
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleTestEmail}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </Button>
      </Paper>
    </Container>
  );
};

export default TestEmail; 