import React from 'react';
import { Box, Container, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Success: React.FC = () => {
  const successPoints = [
    'Timeshare scams are stopped cold.',
    'You have clear cancellation rights to exit bad deals.',
    'A longer rescission period protects your choices.',
    'Companies respect your consumer rights.'
  ];

  return (
    <Box sx={{ bgcolor: 'success.light', py: 8 }}>
      <Container>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          A Future Where Your Rights Win
        </Typography>
        <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
          <List>
            {successPoints.map((point, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={point} />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
            Your signature makes this real. Join us to create a safer, fairer future for all timeshare owners!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Success; 