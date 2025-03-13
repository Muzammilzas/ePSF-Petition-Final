import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import CreatePetitionForm from './components/CreatePetitionForm';
import SharePetition from './components/SharePetition';
import SignPetitionForm from './components/SignPetitionForm';
import ThankYou from './components/ThankYou';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import { PetitionProvider } from './context/PetitionContext';
import { AuthProvider } from './context/AuthContext';
import PetitionSignatures from './components/PetitionSignatures';

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

function App() {
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
                  <Route path="/" element={<HomePage />} />
                  <Route path="/create-petition" element={<CreatePetitionForm />} />
                  <Route path="/share/:id" element={<SharePetition />} />
                  <Route path="/sign/:id" element={<SignPetitionForm />} />
                  <Route path="/thank-you/:id" element={<ThankYou />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Protected Admin Routes */}
                  <Route element={<ProtectedRoute requireAdmin={true} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/petitions/:id/signatures" element={<PetitionSignatures />} />
                  </Route>
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </PetitionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 