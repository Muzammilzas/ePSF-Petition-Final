import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { supabase } from '../services/supabase';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = true, children }) => {
  const { user, loading, isAdmin, forceRefreshAuth } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationTimeout, setVerificationTimeout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (verifying) {
        console.log('ProtectedRoute - Verification timed out after 5 seconds');
        setVerificationTimeout(true);
        setVerifying(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [verifying]);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!user) {
        console.log('ProtectedRoute - No user found, will redirect to login');
        setVerifying(false);
        return;
      }

      if (!requireAdmin) {
        console.log('ProtectedRoute - Admin not required, allowing access');
        setVerifying(false);
        return;
      }

      try {
        console.log(`ProtectedRoute - Verifying admin status for user: ${user.email} (${user.id})`);
        console.log(`ProtectedRoute - Current isAdmin state: ${isAdmin}`);
        
        // If isAdmin is already true from context, trust it and skip verification
        if (isAdmin) {
          console.log('ProtectedRoute - User is already verified as admin in context');
          setVerifying(false);
          return;
        }
        
        // Check localStorage as a fallback
        const savedAdminStatus = localStorage.getItem('isAdmin');
        if (savedAdminStatus === 'true') {
          console.log('ProtectedRoute - User is admin according to localStorage');
          setVerifying(false);
          return;
        }
        
        // Double-check admin status directly from the database with timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database query timed out')), 3000);
        });
        
        const queryPromise = supabase
          .from('admins')
          .select('*')
          .eq('user_id', user.id);
        
        const { data, error } = await Promise.race([
          queryPromise,
          timeoutPromise.then(() => {
            throw new Error('Database query timed out');
          })
        ]) as any;
        
        if (error) {
          console.error('ProtectedRoute - Error verifying admin status:', error);
          setVerificationError(`Error verifying admin status: ${error.message}`);
          setVerifying(false);
          return;
        }
        
        const isUserAdmin = data && data.length > 0;
        console.log(`ProtectedRoute - Database admin check result: ${isUserAdmin ? 'is admin' : 'not admin'}`);
        
        // Update localStorage with the result
        localStorage.setItem('isAdmin', isUserAdmin.toString());
        
        setVerifying(false);
      } catch (error) {
        console.error('ProtectedRoute - Unexpected error during verification:', error);
        
        // If verification fails, check localStorage as a fallback
        const savedAdminStatus = localStorage.getItem('isAdmin');
        if (savedAdminStatus === 'true') {
          console.log('ProtectedRoute - Using localStorage fallback: user is admin');
          setVerifying(false);
          return;
        }
        
        setVerificationError(`Verification error: ${error}`);
        setVerifying(false);
      }
    };

    if (!loading) {
      verifyAdminStatus();
    }
  }, [user, loading, isAdmin, requireAdmin]);

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { 
      user: user ? `${user.email} (${user.id})` : 'null', 
      loading, 
      isAdmin,
      verifying,
      verificationError,
      verificationTimeout
    });
  }, [user, loading, isAdmin, verifying, verificationError, verificationTimeout]);

  // Handle verification timeout
  if (verificationTimeout) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', p: 3 }}>
        <Typography variant="h5" color="warning.main" gutterBottom>
          Verification Timed Out
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          The admin verification process is taking longer than expected. You can:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              localStorage.setItem('isAdmin', 'true');
              forceRefreshAuth();
              navigate('/admin/dashboard');
            }}
          >
            Continue as Admin
          </Button>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Retry Verification
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/admin/login')}>
            Return to Login
          </Button>
        </Box>
      </Box>
    );
  }

  // Show loading state while checking authentication
  if (loading || verifying) {
    console.log('ProtectedRoute - Loading or verifying authentication state...');
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          {loading ? 'Checking authentication...' : 'Verifying admin access...'}
        </Typography>
        {verifying && (
          <Button 
            variant="text" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => setVerificationTimeout(true)}
          >
            Taking too long? Click here
          </Button>
        )}
      </Box>
    );
  }

  // If there was an error during verification
  if (verificationError) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', p: 3 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Authentication Error
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          {verificationError}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              localStorage.setItem('isAdmin', 'true');
              forceRefreshAuth();
              navigate('/admin/dashboard');
            }}
          >
            Continue as Admin
          </Button>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/admin/login')}>
            Return to Login
          </Button>
        </Box>
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('ProtectedRoute - User not authenticated, redirecting to login');
    return <Navigate to="/admin/login" />;
  }

  // If admin access is required but user is not admin, redirect to unauthorized page
  if (requireAdmin && !isAdmin) {
    console.log('ProtectedRoute - User is not admin, redirecting to unauthorized page');
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated and authorized, render the child routes
  console.log('ProtectedRoute - User is authenticated and authorized, rendering child routes');
  return <>{children}</>;
};

export default ProtectedRoute; 