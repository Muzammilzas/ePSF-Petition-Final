import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = true, children }) => {
  const { user, loading, isAdmin } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // If admin access is required but user is not admin, redirect to login
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute; 