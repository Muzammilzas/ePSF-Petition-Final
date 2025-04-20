import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../../services/supabase';

interface FormSubmission {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  newsletter_consent: boolean;
  meta_details: {
    city?: string;
    region?: string;
    country?: string;
    ip_address?: string;
    browser?: string;
    device_type?: string;
    screen_resolution?: string;
    time_zone?: string;
  };
}

interface DetailsDialogProps {
  open: boolean;
  onClose: () => void;
  submission: FormSubmission | null;
}

const DetailsDialog: React.FC<DetailsDialogProps> = ({ open, onClose, submission }) => {
  if (!submission) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Submission Details - {new Date(submission.created_at).toLocaleDateString()}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Submitter Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Name</Typography>
              <Typography>{submission.full_name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography>{submission.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Location</Typography>
              <Typography>
                {[
                  submission.meta_details?.city,
                  submission.meta_details?.region,
                  submission.meta_details?.country
                ].filter(Boolean).join(', ') || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Device Information</Typography>
              <Typography>{submission.meta_details?.device_type || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Browser</Typography>
              <Typography>{submission.meta_details?.browser || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Screen Resolution</Typography>
              <Typography>{submission.meta_details?.screen_resolution || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Time Zone</Typography>
              <Typography>{submission.meta_details?.time_zone || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">IP Address</Typography>
              <Typography>{submission.meta_details?.ip_address || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const FormsAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('where_scams_thrive_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setSubmissions(data || []);
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'scams_thrive') {
      fetchSubmissions();
    }
  }, [activeSection]);

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setDetailsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('where_scams_thrive_submissions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      // Refresh the submissions list
      fetchSubmissions();
    } catch (err: any) {
      console.error('Error deleting submission:', err);
      setError(err.message || 'Failed to delete submission');
    }
  };

  const handleViewEntries = (formType: string) => {
    setActiveSection(activeSection === formType ? null : formType);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/dashboard')}
            sx={{ 
              mb: 2,
              backgroundColor: '#E0AC3F',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#c99a38'
              }
            }}
            variant="contained"
          >
            Back to Dashboard
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Forms Management
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form Sections */}
        <Grid container spacing={3}>
          {/* Where Timeshare Scams Thrive */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Where Timeshare Scams Thrive
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate('/admin/forms/where-scams-thrive')}
                  sx={{ 
                    backgroundColor: '#01BD9B',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#01a989'
                    }
                  }}
                >
                  View Entries
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Before You Sign a Contract */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Before You Sign a Contract
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate('/admin/forms/before-you-sign')}
                  sx={{ 
                    backgroundColor: '#01BD9B',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#01a989'
                    }
                  }}
                >
                  View Entries
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Spotting Exit Scams */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Spotting Exit Scams
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate('/admin/forms/spotting-exit-scams')}
                  sx={{ 
                    backgroundColor: '#01BD9B',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#01a989'
                    }
                  }}
                >
                  View Entries
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Free Checklist */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Free Checklist
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate('/admin/forms/checklist')}
                  sx={{ 
                    backgroundColor: '#01BD9B',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#01a989'
                    }
                  }}
                >
                  View Entries
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Details Dialog */}
      <DetailsDialog
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedSubmission(null);
        }}
        submission={selectedSubmission}
      />
    </Container>
  );
};

export default FormsAdmin; 