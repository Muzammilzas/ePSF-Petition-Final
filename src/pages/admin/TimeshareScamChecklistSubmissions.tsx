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
  created_at: string;
  newsletter_consent: boolean;
  meta_details: {
    user_info: Record<string, string>;
    device: Record<string, string>;
    location: Record<string, string>;
  };
  created_date: string;
  created_time: string;
}

interface MetaDetail {
  id: string;
  checklist_id: string;
  meta_type: 'user_info' | 'device' | 'location';
  meta_key: string;
  meta_value: string;
  created_at: string;
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short' // This will show EST/EDT
  });
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
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: theme => theme.palette.primary.main }}>
            User Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Name
              </Typography>
              <Typography variant="body1">{submission.full_name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1">{submission.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Submission Date
              </Typography>
              <Typography variant="body1">{submission.created_date || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Submission Time
              </Typography>
              <Typography variant="body1">{submission.created_time || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Newsletter Consent
              </Typography>
              <Typography variant="body1">{submission.newsletter_consent ? 'Yes' : 'No'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Download Time
              </Typography>
              <Typography variant="body1">
                {submission.meta_details.user_info.download_time || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ color: theme => theme.palette.primary.main }}>
            Location Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                City
              </Typography>
              <Typography variant="body1">
                {submission.meta_details.location.city || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Region
              </Typography>
              <Typography variant="body1">
                {submission.meta_details.location.region || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Country
              </Typography>
              <Typography variant="body1">
                {submission.meta_details.location.country || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                IP Address
              </Typography>
              <Typography variant="body1">
                {submission.meta_details.location.ip_address || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ color: theme => theme.palette.primary.main }}>
            Device Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Browser
              </Typography>
              <Typography variant="body1">
                {submission.meta_details.device.browser || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Device Type
              </Typography>
              <Typography variant="body1">
                {submission.meta_details.device.device_type || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Screen Resolution
              </Typography>
              <Typography variant="body1">
                {submission.meta_details.device.screen_resolution || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Language
              </Typography>
              <Typography variant="body1">
                {submission.meta_details.device.language || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Timezone
              </Typography>
              <Typography variant="body1">
                {submission.meta_details.device.timezone || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                User Agent
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  bgcolor: theme => theme.palette.grey[100],
                  p: 1,
                  borderRadius: 1
                }}
              >
                {submission.meta_details.device.user_agent || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TimeshareScamChecklistSubmissions: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const fetchSubmissions = async () => {
    console.log('Starting to fetch submissions...');
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('timeshare_checklist_submissions')
        .select('*')
        .order('created_date', { ascending: false })
        .order('created_time', { ascending: false });

      if (fetchError) {
        console.error('Error fetching data:', fetchError);
        throw fetchError;
      }

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

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setDetailsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('timeshare_scam_checklist')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchSubmissions();
    } catch (err: any) {
      console.error('Error deleting submission:', err);
      setError(err.message || 'Failed to delete submission');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('timeshare_scam_checklist')
        .delete()
        .neq('id', ''); // Delete all records

      if (deleteError) throw deleteError;
      await fetchSubmissions();
    } catch (err: any) {
      console.error('Error deleting all submissions:', err);
      setError(err.message || 'Failed to delete all submissions');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);
    try {
      console.log('Starting sync process...');
      const response = await fetch('/.netlify/functions/sync-timeshare-checklist', {
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

  const exportToCSV = () => {
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
    link.setAttribute('download', `timeshare-checklist-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Timeshare Scam Checklist - Submissions
            </Typography>
            <Box>
              <Button
                onClick={fetchSubmissions}
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
                onClick={exportToCSV}
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Submission Date (EST)</TableCell>
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
                      <TableCell>{submission.full_name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>
                        {submission.created_date && submission.created_time
                          ? `${submission.created_date} ${submission.created_time}`
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
                            onClick={() => {
                              setSelectedId(submission.id);
                              setDeleteDialogOpen(true);
                            }}
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
        )}
      </Paper>

      <DetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        submission={selectedSubmission}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (selectedId) {
            handleDelete(selectedId);
            setDeleteDialogOpen(false);
          }
        }}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
      />

      <DeleteConfirmationDialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        onConfirm={() => {
          handleDeleteAll();
          setDeleteAllDialogOpen(false);
        }}
        title="Delete All Submissions"
        message="This will permanently delete all submissions. This action cannot be undone."
        requireConfirmText={true}
      />
    </Container>
  );
};

export default TimeshareScamChecklistSubmissions; 