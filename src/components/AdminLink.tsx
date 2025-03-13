import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminLink: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 4, pt: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        Administrator Access
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => navigate('/admin/login')}
      >
        Admin Login
      </Button>
    </Box>
  );
};

export default AdminLink; 