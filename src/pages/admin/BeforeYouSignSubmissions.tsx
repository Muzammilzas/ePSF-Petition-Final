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
    user_info: {
      name: string;
      email: string;
      download_time: string;
      newsletter_consent: boolean;
    };
    device: {
      browser: string;
      device_type: string;
      screen_resolution: string;
      user_agent: string;
      timezone: string;
      language: string;
    };
    location: {
      city: string;
      region: string;
      country: string;
      latitude: number | null;
      longitude: number | null;
      ip_address: string;
    };
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
            User Information
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
              <Typography variant="subtitle2">Download Time</Typography>
              <Typography>{submission.meta_details.user_info.download_time}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Newsletter Consent</Typography>
              <Typography>{submission.newsletter_consent ? 'Yes' : 'No'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Submission Time
              </Typography>
              <Typography variant="body1">{submission.created_time || 'N/A'}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Location Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">City</Typography>
              <Typography>{submission.meta_details.location.city}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Region</Typography>
              <Typography>{submission.meta_details.location.region}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Country</Typography>
              <Typography>{submission.meta_details.location.country}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">IP Address</Typography>
              <Typography>{submission.meta_details.location.ip_address}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Device Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Browser</Typography>
              <Typography>{submission.meta_details.device.browser}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Device Type</Typography>
              <Typography>{submission.meta_details.device.device_type}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Screen Resolution</Typography>
              <Typography>{submission.meta_details.device.screen_resolution}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Language</Typography>
              <Typography>{submission.meta_details.device.language}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Timezone</Typography>
              <Typography>{submission.meta_details.device.timezone}</Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const BeforeYouSignSubmissions: React.FC = () => {
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
  const [confirmText, setConfirmText] = useState('');

  const fetchSubmissions = async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('before_you_sign_submissions')
        .select('*')
        .order('created_date', { ascending: false }).order('created_time', { ascending: false });

      if (fetchError) throw fetchError;
      setSubmissions(data || []);
    } catch (err: any) {
      console.error('Error in fetchSubmissions:', err);
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleExportCSV = () => {
    // Convert submissions to CSV format
    const headers = ['Full Name', 'Email', 'Submission Date', 'Newsletter Consent', 'Location', 'Device Type', 'Browser', 'Language'];
    const csvData = submissions.map(sub => [
      sub.full_name,
      sub.email,
      sub.created_date && sub.created_time
        ? `${sub.created_date} ${sub.created_time}`
        : '',
      sub.newsletter_consent ? 'Yes' : 'No',
      [sub.meta_details.location.city, sub.meta_details.location.region, sub.meta_details.location.country].filter(Boolean).join(', '),
      sub.meta_details.device.device_type,
      sub.meta_details.device.browser,
      sub.meta_details.device.language
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
    link.setAttribute('download', `before-you-sign-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setDetailsOpen(true);
  };

  const handleDeleteSubmission = async (id: string) => {
    setSubmissionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!submissionToDelete) return;
    
    try {
      const { error: deleteError } = await supabase
        .from('before_you_sign_submissions')
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
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting deletion process...');

      // Get all IDs first
      const { data: ids, error: idError } = await supabase
        .from('before_you_sign_submissions')
        .select('id');

      if (idError) {
        console.error('Error fetching IDs:', idError);
        throw idError;
      }

      if (!ids || ids.length === 0) {
        console.log('No records to delete');
        setDeleteAllDialogOpen(false);
        return;
      }

      // Delete records in batches of 10
      const batchSize = 10;
      const idBatches = [];
      for (let i = 0; i < ids.length; i += batchSize) {
        idBatches.push(ids.slice(i, i + batchSize));
      }

      console.log(`Deleting ${ids.length} records in ${idBatches.length} batches`);

      for (const batch of idBatches) {
        const batchIds = batch.map(record => record.id);
        const { error: deleteError } = await supabase
        .from('before_you_sign_submissions')
        .delete()
          .in('id', batchIds);

        if (deleteError) {
          console.error('Error deleting batch:', deleteError);
          throw deleteError;
        }
      }

      console.log('All batches deleted successfully');
      
      // Clear local state
      setSubmissions([]);
      setDeleteAllDialogOpen(false);

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
      const response = await fetch('/.netlify/functions/sync-before-you-sign', {
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
            sx={{ mb: 2 }}
            variant="contained"
          >
            Back to Forms
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Before You Sign - Submissions
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
                    <TableCell>Date</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Newsletter Consent</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No submissions found</TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          {submission.created_date || 'N/A'}
                        </TableCell>
                        <TableCell>{submission.full_name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>
                          {submission.created_date && submission.created_time
                            ? `${submission.created_date} ${new Date(`2000-01-01 ${submission.created_time}`).toLocaleString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                              })}`
                            : 'N/A'}
                        </TableCell>
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

        {/* Details Dialog */}
        <DetailsDialog
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedSubmission(null);
          }}
          submission={selectedSubmission}
        />

        {/* Delete Confirmation Dialogs */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Submission"
          message="Are you sure you want to delete this submission? This action cannot be undone."
        />

        {/* Delete All Dialog */}
        <Dialog
          open={deleteAllDialogOpen}
          onClose={() => setDeleteAllDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontSize: '2rem', fontWeight: 'bold', pt: 3, px: 3 }}>
            Delete All Submissions
          </DialogTitle>
          <DialogContent sx={{ pb: 4 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              This will permanently delete all submissions. This action cannot be undone.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              Type "CONFIRM" to delete all submissions
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type CONFIRM"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff'
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              variant="contained"
              onClick={handleDeleteAll}
              disabled={confirmText !== 'CONFIRM'}
              sx={{
                bgcolor: '#ff4444',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#cc0000',
                },
                '&.Mui-disabled': {
                  bgcolor: '#ccc',
                  color: '#666'
                }
              }}
            >
              DELETE
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default BeforeYouSignSubmissions; 