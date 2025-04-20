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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('before_you_sign_submissions')
        .select('*')
        .order('created_at', { ascending: false });

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
      new Date(sub.created_at).toLocaleString(),
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
    setDeleteAllDialogOpen(true);
  };

  const handleConfirmDeleteAll = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('before_you_sign_submissions')
        .delete()
        .neq('id', ''); // Delete all records

      if (deleteError) throw deleteError;
      
      await fetchSubmissions();
      setDeleteAllDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to delete all submissions');
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
            Before You Sign - Submissions
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
                          {new Date(submission.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{submission.full_name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>
                          {new Date(submission.created_at).toLocaleString()}
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

        <DeleteConfirmationDialog
          open={deleteAllDialogOpen}
          onClose={() => setDeleteAllDialogOpen(false)}
          onConfirm={handleConfirmDeleteAll}
          title="Delete All Submissions"
          message="This will permanently delete all submissions. This action cannot be undone."
          requireConfirmText={true}
        />
      </Paper>
    </Container>
  );
};

export default BeforeYouSignSubmissions; 