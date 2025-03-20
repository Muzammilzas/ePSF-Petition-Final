import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';

const Failure: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'error.light', py: 8 }}>
      <Container>
        <Box sx={{ maxWidth: 'md', mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
            Without Action, Your Rights Fade
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            If we don't fight, timeshare companies will keep denying your rights. Scams will grow, cancellation will stay impossible, and owners will suffer. Don't let your consumer rights slip away—sign now to stop this injustice!
          </Typography>
          <Button
            component={Link}
            to="/sign-petition"
            variant="contained"
            color="error"
            size="large"
            sx={{ py: 1.5, px: 4 }}
          >
            Sign Before It's Too Late
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Failure; 