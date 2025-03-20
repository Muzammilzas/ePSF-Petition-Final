import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';

const CallToAction: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 8 }}>
      <Container>
        <Box sx={{ maxWidth: 'md', mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stand Up for Your Rights Today
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Sign the Timeshare Fraud Petition Now
          </Typography>
          <Typography sx={{ mb: 4 }}>
            Ready to reclaim your consumer rights? Sign the ePublic Safety Foundation petition to stop unfair timeshare practices. It's fast, secure, and makes a difference. Together, we'll tell lawmakers: consumers come first!
          </Typography>
          <Button
            component={Link}
            to="/sign-petition"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ py: 1.5, px: 4 }}
          >
            Submit Signature
          </Button>
          <Typography variant="body2" sx={{ mt: 2, color: 'grey.400' }}>
            Your data is safe with ePSF, a nonprofit for consumer rights.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CallToAction; 