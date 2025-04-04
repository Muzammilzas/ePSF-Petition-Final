import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import CreatePetitionForm from './components/CreatePetitionForm';
import SharePetition from './components/SharePetition';
import SignPetitionForm from './components/SignPetitionForm';
import ThankYou from './components/ThankYou';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import { PetitionProvider } from './context/PetitionContext';
import { AuthProvider } from './context/AuthContext';
import PetitionSignatures from './components/PetitionSignatures';
import NotFound from './components/NotFound';
import TestEmail from './components/TestEmail';
import LandingPage from './components/LandingPage';
import NewLandingPage from './components/NewLandingPage';
import ConsumerRights from './components/ConsumerRights';
import DonationComplete from './components/DonationComplete';
import DonationCancel from './components/DonationCancel';
import DonationPage from './components/DonationPage';
import ReportScamPage from './components/ReportScam/ReportScamPage';
import ScamReportsAdmin from './components/Admin/ScamReportsAdmin';
import SuccessMessage from './components/ReportScam/SuccessMessage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#01BD9B', // Green
      contrastText: '#FFFFFF', // White text for primary buttons
    },
    secondary: {
      main: '#E0AC3F', // Orange
      contrastText: '#FFFFFF', // White text for secondary buttons
    },
    background: {
      default: '#f8fafc', // Light blueish-gray background
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#FFFFFF', // Ensure white text for all buttons
          '&:hover': {
            backgroundColor: '#E0AC3F', // Secondary color on hover
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: '#E0AC3F', // Secondary color on hover for contained buttons
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // Subtle shadow
          border: '1px solid rgba(0, 0, 0, 0.05)', // Very subtle border
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PetitionProvider>
          <Router>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)', // Subtle gradient
                '&::before': {
                  content: '""',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 50% 0%, rgba(1, 189, 155, 0.03) 0%, rgba(224, 172, 63, 0.02) 100%)', // Very subtle radial gradient with brand colors
                  pointerEvents: 'none',
                  zIndex: 0,
                },
              }}
            >
              <Navigation />
              <Box 
                component="main" 
                sx={{ 
                  flexGrow: 1, 
                  py: 3,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<NewLandingPage />} />
                  <Route path="/consumer-rights" element={<ConsumerRights />} />
                  <Route path="/sign/:id" element={<SignPetitionForm />} />
                  <Route path="/thank-you/:id" element={<ThankYou />} />
                  <Route path="/complete" element={<DonationComplete />} />
                  <Route path="/cancel" element={<DonationCancel />} />
                  <Route path="/donate" element={<DonationPage />} />
                  <Route path="/report-scam" element={<ReportScamPage />} />
                  <Route path="/report-scam/thank-you" element={<SuccessMessage />} />
                  
                  {/* Authentication Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Protected Admin Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/create" 
                    element={
                      <ProtectedRoute>
                        <CreatePetitionForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/petitions/:id/signatures" 
                    element={
                      <ProtectedRoute>
                        <PetitionSignatures />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/scam-reports" 
                    element={
                      <ProtectedRoute>
                        <ScamReportsAdmin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/share/:id" 
                    element={
                      <ProtectedRoute>
                        <SharePetition />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Test Email Route */}
                  <Route 
                    path="/admin/test-email" 
                    element={
                      <ProtectedRoute>
                        <TestEmail />
                      </ProtectedRoute>
                    } 
                  />

                  {/* 404 and Catch-all */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </PetitionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 