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
  Tooltip,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SyncIcon from '@mui/icons-material/Sync';
import { supabase } from '../../services/supabase';

interface FormSubmission {
  id: string;
  full_name: string;
  email: string;
  created_date: string;
  created_time: string;
  newsletter_consent: boolean;
  meta_details: {
    user_info?: {
      name?: string;
      email?: string;
      download_time?: string;
      newsletter_consent?: boolean;
    };
    device?: {
      browser?: string;
      device_type?: string;
      screen_resolution?: string;
      user_agent?: string;
      timezone?: string;
      language?: string;
    };
    location?: {
      city?: string;
      region?: string;
      country?: string;
      latitude?: number | null;
      longitude?: number | null;
      ip_address?: string;
    };
  };
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
  requireConfirmText = false,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmEnabled = !requireConfirmText || confirmText === 'CONFIRM';

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      onConfirm();
      setConfirmText('');
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
        {requireConfirmText && (
          <TextField
            fullWidth
            label="Type CONFIRM to proceed"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            margin="normal"
            error={confirmText !== '' && confirmText !== 'CONFIRM'}
            helperText={
              confirmText !== '' && confirmText !== 'CONFIRM'
                ? 'Please type CONFIRM exactly to proceed'
                : ''
            }
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          disabled={!isConfirmEnabled}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DetailsDialog: React.FC<DetailsDialogProps> = ({ open, onClose, submission }) => {
  if (!submission) return null;

  const formatDate = (dateStr: string) => {
    try {
      // Parse MM/DD/YYYY format
      const [month, day, year] = dateStr.split('/');
      return `${month}/${day}/${year}`;
    } catch (error) {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      // If it's a number, convert it to proper time format
      if (!isNaN(Number(timeStr))) {
        const date = new Date();
        date.setHours(Math.floor(Number(timeStr)));
        date.setMinutes((Number(timeStr) % 1) * 60);
        return date.toLocaleString('en-US', {
          hour: 'numeric',
      minute: '2-digit',
          hour12: true
    });
      }
      return timeStr;
    } catch (error) {
      return timeStr;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Submission Details
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>User Information</Typography>
            <Typography><strong>Full Name:</strong> {submission.full_name}</Typography>
            <Typography><strong>Email:</strong> {submission.email}</Typography>
            <Typography><strong>Submission Date:</strong> {formatDate(submission.created_date)}</Typography>
            <Typography><strong>Submission Time:</strong> {formatTime(submission.created_time)}</Typography>
            <Typography><strong>Newsletter Consent:</strong> {submission.newsletter_consent ? 'Yes' : 'No'}</Typography>
          </Grid>

          {submission.meta_details?.device && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Device Information</Typography>
              <Typography><strong>Browser:</strong> {submission.meta_details.device.browser}</Typography>
              <Typography><strong>Device Type:</strong> {submission.meta_details.device.device_type}</Typography>
              <Typography><strong>Screen Resolution:</strong> {submission.meta_details.device.screen_resolution}</Typography>
              <Typography><strong>Language:</strong> {submission.meta_details.device.language}</Typography>
              <Typography><strong>Timezone:</strong> {submission.meta_details.device.timezone}</Typography>
            </Grid>
          )}

          {submission.meta_details?.location && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Location Information</Typography>
              <Typography><strong>City:</strong> {submission.meta_details.location.city}</Typography>
              <Typography><strong>Region:</strong> {submission.meta_details.location.region}</Typography>
              <Typography><strong>Country:</strong> {submission.meta_details.location.country}</Typography>
              <Typography><strong>IP Address:</strong> {submission.meta_details.location.ip_address}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const SpottingExitScamsSubmissions: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  const formatDate = (dateStr: string) => {
    try {
      // Parse MM/DD/YYYY format
      const [month, day, year] = dateStr.split('/');
      return `${month}/${day}/${year}`;
    } catch (error) {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      // If it's a number, convert it to proper time format
      if (!isNaN(Number(timeStr))) {
        const date = new Date();
        date.setHours(Math.floor(Number(timeStr)));
        date.setMinutes((Number(timeStr) % 1) * 60);
        return date.toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
      return timeStr;
    } catch (error) {
      return timeStr;
    }
  };

  const fetchSubmissions = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      // Clear existing submissions first
      setSubmissions([]);
      
      // Add timestamp to force cache refresh
      const timestamp = new Date().getTime();
      const { data, error: fetchError } = await supabase
        .from('spotting_exit_scams_submissions')
        .select('id, full_name, email, created_date, created_time, newsletter_consent, meta_details')
        .order('created_date', { ascending: false })
        .limit(1000) // Add limit to prevent infinite results
        .range(0, 999); // Add range to force fresh data

      if (fetchError) {
        console.error('Error fetching submissions:', fetchError);
        throw fetchError;
      }

      // Filter out any null or undefined entries
      const validData = (data || []).filter((entry: FormSubmission) => entry && entry.id);
      console.log(`Fetched ${validData.length} submissions at ${timestamp}`);
      setSubmissions(validData);
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setDetailsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('spotting_exit_scams_submissions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchSubmissions();
      setDeleteDialogOpen(false);
      setSelectedId(null);
    } catch (err: any) {
      console.error('Error deleting submission:', err);
      setError(err.message || 'Failed to delete submission');
    }
  };

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      setError(null);
      setDeleteSuccess(false);
      setDeleteMessage('');
      
      console.log('Starting deletion process...');

      // Call the RPC function to delete all records
      const { data: deletedCount, error: deleteError } = await supabase
        .rpc('delete_all_spotting_exit_scams_submissions');

        if (deleteError) {
        console.error('Error in delete operation:', deleteError);
          throw deleteError;
      }

      console.log(`Successfully deleted ${deletedCount} records`);
      
      // Clear local state
      setSubmissions([]);
      setDeleteAllDialogOpen(false);
      setDeleteSuccess(true);
      setDeleteMessage(`Successfully deleted ${deletedCount} submissions`);

      // Refresh the data
      await fetchSubmissions(true);

    } catch (err: any) {
      console.error('Error in delete operation:', err);
      setError(err.message || 'Failed to delete all submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);
    try {
      console.log('Starting sync process...');
      const response = await fetch('/.netlify/functions/sync-spotting-exit-scams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Sync response status:', response.status);
      const responseData = await response.json();
      console.log('Sync response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to sync with Google Sheets');
      }

      // Refresh the submissions data
      await fetchSubmissions();
      setSyncSuccess(true);
      console.log('Sync completed successfully:', responseData);
    } catch (err: any) {
      console.error('Sync error:', err);
      setSyncError(err.message || 'Failed to sync with Google Sheets');
    } finally {
      setSyncing(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Full Name',
      'Email',
      'Newsletter Consent',
      'Submission Date',
      'Submission Time',
      'Browser',
      'Device Type',
      'Screen Resolution',
      'Language',
      'Timezone',
      'City',
      'Region',
      'Country',
      'IP Address',
    ];

    const csvData = submissions.map((submission) => [
      submission.full_name,
      submission.email,
      submission.newsletter_consent ? 'Yes' : 'No',
      submission.created_date || '',
      submission.created_time || '',
      submission.meta_details?.device?.browser || '',
      submission.meta_details?.device?.device_type || '',
      submission.meta_details?.device?.screen_resolution || '',
      submission.meta_details?.device?.language || '',
      submission.meta_details?.device?.timezone || '',
      submission.meta_details?.location?.city || '',
      submission.meta_details?.location?.region || '',
      submission.meta_details?.location?.country || '',
      submission.meta_details?.location?.ip_address || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `spotting-exit-scams-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add effect to refresh data periodically after deletion
  useEffect(() => {
    if (submissions.length === 0) {
      const refreshTimer = setTimeout(() => {
        fetchSubmissions(true);
      }, 3000);

      return () => clearTimeout(refreshTimer);
    }
  }, [submissions.length]);

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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Spotting Exit Scams - Submissions
            </Typography>
            <Box>
              <Button
                onClick={() => fetchSubmissions(true)}
                variant="contained"
                sx={{ 
                  mr: 1,
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
                  mr: 1,
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
                  mr: 1,
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
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteAllDialogOpen(true)}
                >
                  Delete All
                </Button>
              )}
            </Box>
          </Box>
          
          <Typography variant="subtitle1" color="text.secondary">
            Total Submissions: {submissions.length}
          </Typography>
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

        <Snackbar
          open={deleteSuccess}
          autoHideDuration={6000}
          onClose={() => setDeleteSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setDeleteSuccess(false)} 
            severity="success"
            sx={{ width: '100%' }}
          >
            {deleteMessage}
          </Alert>
        </Snackbar>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Newsletter</TableCell>
                  <TableCell>Location</TableCell>
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
                      <TableCell>{formatDate(submission.created_date)}</TableCell>
                      <TableCell>{formatTime(submission.created_time)}</TableCell>
                      <TableCell>{submission.full_name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.newsletter_consent ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        {[
                          submission.meta_details?.location?.city,
                          submission.meta_details?.location?.region,
                          submission.meta_details?.location?.country
                        ].filter(Boolean).join(', ') || 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <IconButton
                            onClick={() => handleViewDetails(submission)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setSelectedId(submission.id);
                              setDeleteDialogOpen(true);
                            }}
                            color="error"
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
        )}

        {/* Details Dialog */}
        <DetailsDialog
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedSubmission(null);
          }}
          submission={selectedSubmission}
        />

        {/* Delete Single Submission Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedId(null);
          }}
          onConfirm={() => selectedId && handleDelete(selectedId)}
          title="Delete Submission"
          message="Are you sure you want to delete this submission? This action cannot be undone."
        />

        {/* Delete All Submissions Dialog */}
        <DeleteConfirmationDialog
          open={deleteAllDialogOpen}
          onClose={() => setDeleteAllDialogOpen(false)}
          onConfirm={handleDeleteAll}
          title="Delete All Submissions"
          message="Are you sure you want to delete all submissions? This action cannot be undone."
          requireConfirmText={true}
        />
      </Paper>
    </Container>
  );
};

export default SpottingExitScamsSubmissions; 