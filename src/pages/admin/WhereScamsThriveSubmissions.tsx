import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SyncIcon from '@mui/icons-material/Sync';
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
  created_date: string;
  created_time: string;
}

interface DetailsDialogProps {
  open: boolean;
  onClose: () => void;
  submission: FormSubmission | null;
}

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  requireConfirmText?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  requireConfirmText = false
}) => {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmEnabled = !requireConfirmText || confirmText === 'CONFIRM';

  const handleConfirm = () => {
    onConfirm();
    setConfirmText(''); // Reset the text after confirmation
  };

  const handleClose = () => {
    setConfirmText(''); // Reset the text when dialog is closed
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: requireConfirmText ? 2 : 0 }}>{message}</Typography>
        {requireConfirmText && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Type "CONFIRM" to delete all submissions
            </Typography>
            <TextField
              fullWidth
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type CONFIRM"
              size="small"
              error={confirmText !== '' && confirmText !== 'CONFIRM'}
              helperText={confirmText !== '' && confirmText !== 'CONFIRM' ? 'Please type CONFIRM exactly' : ''}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="error" 
          variant="contained"
          disabled={!isConfirmEnabled}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DetailsDialog: React.FC<DetailsDialogProps> = ({ open, onClose, submission }) => {
  if (!submission) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Submission Details - {submission.created_date || 'N/A'}
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
              <Typography variant="subtitle2">Submission Date</Typography>
              <Typography>{submission.created_time || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Newsletter Consent</Typography>
              <Typography>{submission.newsletter_consent ? 'Yes' : 'No'}</Typography>
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

const formatDateToEST = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

const WhereScamsThriveSubmissions: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const fetchSubmissions = async () => {
    console.log('Fetching submissions...');
    setLoading(true);
    setError(null);
    try {
      // First, check if we can connect to Supabase
      const { data: testData, error: testError } = await supabase
        .from('where_scams_thrive_submissions')
        .select('count');
      
      if (testError) {
        console.error('Error connecting to Supabase:', testError);
        throw new Error(`Database connection error: ${testError.message}`);
      }
      
      console.log('Connection test successful, count:', testData);

      // Now fetch the actual data
      const { data, error: fetchError } = await supabase
        .from('where_scams_thrive_submissions')
        .select('*')
        .order('created_date', { ascending: false }).order('created_time', { ascending: false });

      if (fetchError) {
        console.error('Error fetching data:', fetchError);
        throw fetchError;
      }

      console.log('Fetched submissions:', data);
      setSubmissions(data || []);
    } catch (err: any) {
      console.error('Error in fetchSubmissions:', err);
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Component mounted, calling fetchSubmissions');
    fetchSubmissions();
  }, []);

  const handleViewDetails = (submission: FormSubmission) => {
    console.log('Viewing details for submission:', submission);
    setSelectedSubmission(submission);
    setDetailsOpen(true);
  };

  const handleExportCSV = () => {
    // Convert submissions to CSV format
    const headers = ['Full Name', 'Email', 'Submission Date', 'Newsletter Consent', 'Location', 'Device Type', 'Browser'];
    const csvData = submissions.map(sub => [
      sub.full_name,
      sub.email,
      sub.created_date && sub.created_time
        ? `${sub.created_date} ${sub.created_time}`
        : '',
      sub.newsletter_consent ? 'Yes' : 'No',
      [sub.meta_details?.city, sub.meta_details?.region, sub.meta_details?.country].filter(Boolean).join(', '),
      sub.meta_details?.device_type || 'N/A',
      sub.meta_details?.browser || 'N/A'
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `where-scams-thrive-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteSubmission = async (id: string) => {
    setSubmissionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!submissionToDelete) return;
    
    try {
      const { error: deleteError } = await supabase
        .from('where_scams_thrive_submissions')
        .delete()
        .eq('id', submissionToDelete);

      if (deleteError) throw deleteError;
      
      await fetchSubmissions();
      setDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete submission');
    }
  };

  const handleDeleteAll = async () => {
    setDeleteAllDialogOpen(true);
  };

  const handleConfirmDeleteAll = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('where_scams_thrive_submissions')
        .delete()
        .not('id', 'is', null); // Matches all rows

      if (deleteError) throw deleteError;
      
      await fetchSubmissions();
      setDeleteAllDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to delete all submissions');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);
    try {
      console.log('Starting sync process...');
      const response = await fetch('/.netlify/functions/sync-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Sync response status:', response.status);
      const responseData = await response.json();
      console.log('Sync response data:', responseData);

      if (!response.ok) {
        // Extract detailed error message from the response
        const errorMessage = responseData.details || responseData.error || 'Failed to sync with Google Sheets';
        throw new Error(errorMessage);
      }

      // Even if there are no submissions to sync, this is still a success
      await fetchSubmissions();
      setSyncSuccess(true);
      console.log('Sync completed successfully:', responseData);
    } catch (err: any) {
      console.error('Sync error:', err);
      // Show the full error details to help with debugging
      const errorMessage = err.message || 'Failed to sync with Google Sheets';
      setSyncError(`Sync failed: ${errorMessage}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/forms')}
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
            Back to Forms
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Where Timeshare Scams Thrive - Submissions
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              onClick={fetchSubmissions}
              variant="contained"
              sx={{ 
                backgroundColor: '#01BD9B',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#01a989'
                }
              }}
            >
              Refresh Data
            </Button>

            <Button
              onClick={handleExportCSV}
              variant="contained"
              startIcon={<FileDownloadIcon />}
              sx={{ 
                backgroundColor: '#4CAF50',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            >
              Export as CSV
            </Button>

            <Button
              onClick={handleSync}
              variant="contained"
              startIcon={<SyncIcon />}
              disabled={syncing}
              sx={{ 
                backgroundColor: '#2196F3',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#1976D2'
                }
              }}
            >
              {syncing ? 'Syncing...' : 'Sync with Google Sheets'}
            </Button>

            {submissions.length > 0 && (
              <Button
                onClick={handleDeleteAll}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete All
              </Button>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {syncError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {syncError}
          </Alert>
        )}

        <Snackbar
          open={syncSuccess}
          autoHideDuration={6000}
          onClose={() => setSyncSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSyncSuccess(false)} 
            severity="success"
            sx={{ width: '100%' }}
          >
            Successfully synced with Google Sheets
          </Alert>
        </Snackbar>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Total Submissions: {submissions.length}
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date (EST)</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Newsletter Consent</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No submissions found</TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          {submission.created_date && submission.created_time
                            ? `${submission.created_date} ${submission.created_time}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{submission.full_name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.newsletter_consent ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(submission)}
                              sx={{ color: '#01BD9B' }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteSubmission(submission.id)}
                              sx={{ color: '#f44336' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
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

      {/* Add Delete Confirmation Dialogs */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
      />

      <DeleteConfirmationDialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        onConfirm={handleConfirmDeleteAll}
        title="Delete All Submissions"
        message="This will permanently delete all submissions. This action cannot be undone."
        requireConfirmText={true}
      />
    </Container>
  );
};

export default WhereScamsThriveSubmissions; 