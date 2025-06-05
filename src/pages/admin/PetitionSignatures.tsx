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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SyncIcon from '@mui/icons-material/Sync';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '../../services/supabase';

interface SignatureMetadata {
  // Nested structure
  device?: {
    browser: string;
    device_type: string;
    screen_resolution: string;
    user_agent: string;
    timezone: string;
    language: string;
  };
  location?: {
    city: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
    ip_address: string;
  };
  submission_date?: string;

  // Flat structure (for backward compatibility)
  browser?: string;
  device_type?: string;
  screen_resolution?: string;
  user_agent?: string;
  timezone?: string;
  language?: string;
  ip_address?: string;
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface Signature {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  timeshare_name?: string;
  petition_id: string;
  meta_details?: SignatureMetadata;
  created_date: string;
  created_time: string;
  metadata?: SignatureMetadata;
}

interface SignatureDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  signature: Signature | null;
}

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  requireConfirmText?: boolean;
  selectedId?: string | null;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  requireConfirmText = false,
  selectedId,
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
          disabled={!isConfirmEnabled || !selectedId}
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
    timeZoneName: 'short'
  });
};

const getDateOnly = (dateString: string) => {
  if (!dateString) return 'N/A';
  return dateString.split('T')[0].split(' ')[0];
};

const SignatureDetailsDialog: React.FC<SignatureDetailsDialogProps> = ({
  open,
  onClose,
  signature
}) => {
  if (!signature) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Signature Details - {signature.created_date && signature.created_time ? `${signature.created_date} ${signature.created_time}` : 'N/A'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: theme => theme.palette.primary.main }}>
            Signer Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Name
              </Typography>
              <Typography variant="body1">{`${signature.first_name} ${signature.last_name}`}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1">{signature.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Timeshare Name
              </Typography>
              <Typography variant="body1">{signature.timeshare_name || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Signed At
              </Typography>
              <Typography variant="body1">
                {signature.created_date ? String(signature.created_date).split(' ')[0] : 'N/A'}
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
                {signature.meta_details?.location?.city || signature.meta_details?.city || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Region
              </Typography>
              <Typography variant="body1">
                {signature.meta_details?.location?.region || signature.meta_details?.region || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Country
              </Typography>
              <Typography variant="body1">
                {signature.meta_details?.location?.country || signature.meta_details?.country || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                IP Address
              </Typography>
              <Typography variant="body1">
                {signature.meta_details?.location?.ip_address || signature.meta_details?.ip_address || 'N/A'}
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
                {signature.meta_details?.device?.browser || signature.meta_details?.browser || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Device Type
              </Typography>
              <Typography variant="body1">
                {signature.meta_details?.device?.device_type || signature.meta_details?.device_type || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Screen Resolution
              </Typography>
              <Typography variant="body1">
                {signature.meta_details?.device?.screen_resolution || signature.meta_details?.screen_resolution || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Language
              </Typography>
              <Typography variant="body1">
                {signature.meta_details?.device?.language || signature.meta_details?.language || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Timezone
              </Typography>
              <Typography variant="body1">
                {signature.meta_details?.device?.timezone || signature.meta_details?.timezone || 'N/A'}
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

const PetitionSignatures: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSignature, setSelectedSignature] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [filteredSignatures, setFilteredSignatures] = useState<Signature[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState<SignatureMetadata | null>(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  const fetchSignatures = async () => {
    console.log('Starting to fetch signatures...');
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('signatures')
        .select('*')
        .order('created_date', { ascending: sortOrder === 'asc' })
        .order('created_time', { ascending: sortOrder === 'asc' });
      
      // Only filter by petition_id if we have one
      if (id) {
        query = query.eq('petition_id', id);
      }
      
      const { data: signaturesData, error: signaturesError } = await query;
      
      if (signaturesError) throw signaturesError;
      
      setSignatures(signaturesData || []);
      setFilteredSignatures(signaturesData || []);
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignatures();
  }, [sortBy, sortOrder]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredSignatures(signatures);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = signatures.filter(signature => {
        return (
          (signature.first_name && signature.first_name.toLowerCase().includes(searchLower)) ||
          (signature.last_name && signature.last_name.toLowerCase().includes(searchLower)) ||
          (signature.email && signature.email.toLowerCase().includes(searchLower)) ||
          (signature.timeshare_name && signature.timeshare_name.toLowerCase().includes(searchLower)) ||
          (signature.petition_id && signature.petition_id.toLowerCase().includes(searchLower))
        );
      });
      setFilteredSignatures(filtered);
    }
  }, [searchTerm, signatures]);

  const handleViewDetails = (signature: Signature) => {
    setSelectedSignature(signature.id);
    setDetailsOpen(true);
  };

  const handleDeleteAll = async () => {
    try {
      const { error: deleteAllError } = await supabase
        .from('signatures')
        .delete();  // Simple delete without any conditions will delete all records

      if (deleteAllError) throw deleteAllError;

      setSignatures([]);
      setFilteredSignatures([]); // Also clear filtered signatures
      setDeleteAllDialogOpen(false);
    } catch (err: any) {
      console.error('Error deleting all signatures:', err);
      setError(err.message || 'Failed to delete all signatures');
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncError(null);
      setSyncSuccess(false);

      console.log('Starting sync process...');
      const response = await fetch('/.netlify/functions/sync-petition-signatures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Sync response status:', response.status);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error(`Invalid response from server: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(errorData.error || errorData.details || 'Failed to sync signatures');
      }

      setSyncSuccess(true);
      fetchSignatures();
    } catch (error: any) {
      console.error('Error syncing signatures:', error);
      setSyncError(error.message || 'Failed to sync signatures');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (syncSuccess) {
      const timer = setTimeout(() => setSyncSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
    if (syncError) {
      const timer = setTimeout(() => setSyncError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [syncSuccess, syncError]);

  const exportToCSV = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Timeshare Name',
      'Petition ID',
      'Submission Date',
      'Browser',
      'Device Type',
      'Screen Resolution',
      'Timezone',
      'City',
      'Region',
      'Country',
      'IP Address',
    ];

    const csvData = signatures.map((signature) => [
      signature.first_name,
      signature.last_name,
      signature.email,
      signature.timeshare_name || '',
      signature.petition_id,
      signature.created_date
        ? new Date(signature.created_date).toLocaleDateString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        : '',
      signature.meta_details?.device?.browser || '',
      signature.meta_details?.device?.device_type || '',
      signature.meta_details?.device?.screen_resolution || '',
      signature.meta_details?.device?.timezone || '',
      signature.meta_details?.location?.city || '',
      signature.meta_details?.location?.region || '',
      signature.meta_details?.location?.country || '',
      signature.meta_details?.location?.ip_address || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `petition-signatures-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Restore the direct delete handler
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this signature? This action cannot be undone.')) {
      return;
    }
    try {
      const { error: deleteError } = await supabase
        .from('signatures')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSignatures(prev => prev.filter(sig => sig.id !== id));
      setFilteredSignatures(prev => prev.filter(sig => sig.id !== id));
    } catch (err: any) {
      console.error('Error deleting signature:', err);
      setError(err.message || 'Failed to delete signature');
    }
  };

  const handleViewMeta = async (signature: Signature) => {
    try {
      setMetadataLoading(true);
      setMetadataError(null);
      
      if (signature.meta_details) {
        setSelectedSignature(signature.id);
        setSelectedMetadata(signature.meta_details);
        setMetadataDialogOpen(true);
      } else {
        setMetadataError('No metadata found for this signature');
      }
    } catch (error: any) {
      console.error('Error in handleViewMeta:', error);
      setMetadataError(error.message || 'Failed to load signature details');
    } finally {
      setMetadataLoading(false);
    }
  };

  const handleDeleteSignature = async (signature: SignatureDetailsDialogProps['signature']) => {
    // ... rest of the function code ...
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading signatures...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
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
              Petition Signatures
            </Typography>
            <Box>
              <Button
                variant="contained"
                onClick={handleSync}
                disabled={syncing}
                startIcon={syncing ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
                sx={{
                  mr: 1,
                  backgroundColor: syncing ? undefined : '#01BD9B',
                  color: syncing ? undefined : '#FFFFFF',
                  '&:hover': {
                    backgroundColor: syncing ? undefined : '#01a989'
                  }
                }}
              >
                {syncing ? 'Syncing...' : 'Sync to Sheet'}
              </Button>
              <Button
                variant="contained"
                onClick={exportToCSV}
                disabled={signatures.length === 0}
                startIcon={<FileDownloadIcon />}
                sx={{ 
                  mr: 1,
                  backgroundColor: '#3f51b5',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#303f9f'
                  }
                }}
              >
                Export CSV
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteAllDialogOpen(true)}
                disabled={signatures.length === 0}
                startIcon={<DeleteIcon />}
              >
                Delete All
              </Button>
            </Box>
          </Box>
          
          <Typography variant="subtitle1" color="text.secondary">
            Total Signatures: {signatures.length}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Snackbar
          open={syncSuccess}
          autoHideDuration={3000}
          onClose={() => setSyncSuccess(false)}
        >
          <Alert 
            onClose={() => setSyncSuccess(false)} 
            severity="success"
            sx={{ width: '100%' }}
          >
            Signatures synced successfully!
          </Alert>
        </Snackbar>

        <Snackbar open={!!syncError} autoHideDuration={5000} onClose={() => setSyncError(null)}>
          <Alert onClose={() => setSyncError(null)} severity="error" sx={{ width: '100%' }}>
            Sync failed: {syncError}
          </Alert>
        </Snackbar>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Signatures"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="created_date">Date Signed</MenuItem>
                  <MenuItem value="first_name">First Name</MenuItem>
                  <MenuItem value="last_name">Last Name</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="timeshare_name">Timeshare Name</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                >
                  <MenuItem value="desc">Descending</MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchSignatures}
                startIcon={<RefreshIcon />}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Timeshare Name</TableCell>
                <TableCell>Petition ID</TableCell>
                <TableCell>Signed At (EST)</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSignatures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">No signatures found</TableCell>
                </TableRow>
              ) : (
                filteredSignatures.map((signature, index) => (
                  <TableRow
                    key={signature.id}
                    sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{signature.first_name}</TableCell>
                    <TableCell>{signature.last_name}</TableCell>
                    <TableCell>{signature.email}</TableCell>
                    <TableCell>{signature.timeshare_name || 'N/A'}</TableCell>
                    <TableCell>{signature.petition_id}</TableCell>
                    <TableCell>
                      {signature.created_date && signature.created_time 
                        ? `${signature.created_date} ${signature.created_time}`
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(signature)}
                            sx={{ color: '#01BD9B' }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Signature">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(signature.id)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SignatureDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        signature={signatures.find(s => s.id === selectedSignature) || null}
      />

      <DeleteConfirmationDialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        onConfirm={handleDeleteAll}
        title="Confirm Deletion of All Signatures"
        message="Are you absolutely sure you want to delete ALL signatures? This action cannot be undone."
        requireConfirmText={true}
      />
    </Container>
  );
};

export default PetitionSignatures; 