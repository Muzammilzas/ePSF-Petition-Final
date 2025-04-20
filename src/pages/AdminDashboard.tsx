import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import FormSubmissionsAdmin from '../components/Admin/FormSubmissionsAdmin';

const AdminDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and manage form submissions from all pages
        </Typography>
      </Box>
      <FormSubmissionsAdmin />
    </Container>
  );
};

export default AdminDashboard; 