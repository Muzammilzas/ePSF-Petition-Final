import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import PetitionPage from './components/PetitionPage';
import ConsumerRights from './components/ConsumerRights';
import DonationComplete from './components/DonationComplete';
import DonationCancel from './components/DonationCancel';
import DonationPage from './components/DonationPage';
import ReportScamPage from './components/ReportScam/ReportScamPage';
import ScamReportsAdmin from './components/Admin/ScamReportsAdmin';
import SuccessMessage from './components/ReportScam/SuccessMessage';
import AbandonedFormsAdmin from './components/Admin/AbandonedFormsAdmin';
import FormsAdmin from './components/Admin/FormsAdmin';
import Analytics from './components/Admin/Analytics';
import WhereScamsThriveSubmissions from './pages/admin/WhereScamsThriveSubmissions';
import BeforeYouSignSubmissions from './pages/admin/BeforeYouSignSubmissions';
import SpottingExitScamsSubmissions from './pages/admin/SpottingExitScamsSubmissions';
import TimeshareScamChecklistSubmissions from './pages/admin/TimeshareScamChecklistSubmissions';
import HomePage from './pages/home-2';
import TimeshareScamReport from './pages/TimeshareScamReport';
import TimeshareScamChecklist from './pages/TimeshareScamChecklist';
import WhereScamsThrive from './pages/WhereScamsThrive';
import BeforeYouSign from './pages/BeforeYouSign';
import SpottingExitScams from './pages/SpottingExitScams';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DataDeletionRequest from './pages/DataDeletionRequest';
import TimeshareScams from './pages/TimeshareScams';
import TimeshareScamAwareness from './pages/TimeshareScamAwareness';
import { trackPageView as trackCustomPageView, getDeviceType, getLocationFromIP } from './services/analytics';
import { trackPageView } from './services/googleAnalytics';

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

// Analytics tracking component
const AnalyticsTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Track page view in Google Analytics
    trackPageView(location.pathname + location.search);

    // Track page view in custom analytics
    const trackAnalytics = async () => {
      try {
        // Get IP address using a public API
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipResponse.json();

        // Get location from IP
        const location = await getLocationFromIP(ip);

        // Get device type from user agent
        const device = getDeviceType(navigator.userAgent);

        // Track the page view
        await trackCustomPageView({
          ip_address: ip,
          location,
          device,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          page_url: window.location.href,
        });
      } catch (error) {
        console.error('Error tracking analytics:', error);
      }
    };

    trackAnalytics();
  }, [location]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PetitionProvider>
          <Router>
            <AnalyticsTracker>
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
                  <Route path="/" element={<HomePage />} />
                  <Route path="/petition" element={<PetitionPage />} />
                  <Route path="/consumer-rights" element={<ConsumerRights />} />
                  <Route path="/sign/:id" element={<SignPetitionForm />} />
                  <Route path="/thank-you/:id" element={<ThankYou />} />
                  <Route path="/complete" element={<DonationComplete />} />
                  <Route path="/cancel" element={<DonationCancel />} />
                  <Route path="/donate" element={<DonationPage />} />
                  <Route path="/report-scam" element={<ReportScamPage />} />
                  <Route path="/report-scam/thank-you" element={<SuccessMessage />} />
                  <Route path="/timeshare-scam" element={<TimeshareScamReport />} />
                  <Route path="/timeshare-scam-checklist" element={<TimeshareScamChecklist />} />
                  <Route path="/where-scams-thrive" element={<WhereScamsThrive />} />
                  <Route path="/before-you-sign" element={<BeforeYouSign />} />
                  <Route path="/spotting-exit-scams" element={<SpottingExitScams />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/data-deletion-request" element={<DataDeletionRequest />} />
                  <Route path="/how-timeshare-scams-work" element={<TimeshareScams />} />
                  <Route path="/timeshare-scam-awareness" element={<TimeshareScamAwareness />} />
                  
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
                    path="/admin/forms" 
                    element={
                      <ProtectedRoute>
                        <FormsAdmin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/forms/where-scams-thrive" 
                    element={
                      <ProtectedRoute>
                        <WhereScamsThriveSubmissions />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/forms/before-you-sign" 
                    element={
                      <ProtectedRoute>
                        <BeforeYouSignSubmissions />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/forms/spotting-exit-scams" 
                    element={
                      <ProtectedRoute>
                        <SpottingExitScamsSubmissions />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/forms/checklist" 
                    element={
                      <ProtectedRoute>
                        <TimeshareScamChecklistSubmissions />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/abandoned-forms" 
                    element={
                      <ProtectedRoute>
                        <AbandonedFormsAdmin />
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

                        {/* Analytics Route */}
                        <Route 
                          path="/admin/analytics" 
                          element={
                            <ProtectedRoute>
                              <Analytics />
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
            </AnalyticsTracker>
          </Router>
        </PetitionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 