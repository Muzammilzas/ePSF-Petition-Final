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
import { useNavigate } from 'react-router-dom';
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
    latitude: number;
    longitude: number;
    ip_address: string;
  };
  submission_date: string;
}

interface Signature {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip_code: string;
  petition_id: string;
  created_at: string;
  metadata: SignatureMetadata;
  created_date: string;
  created_time: string;
}

interface DetailsDialogProps {
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
    timeZoneName: 'short'
  });
};

const DetailsDialog: React.FC<DetailsDialogProps> = ({ open, onClose, signature }) => {
  if (!signature) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Signature Details - {/* Display created_date */}
            {signature.created_date || 'N/A'}
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
                Phone
              </Typography>
              <Typography variant="body1">{signature.phone || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                ZIP Code
              </Typography>
              <Typography variant="body1">{signature.zip_code || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Signed At
              </Typography>
              <Typography variant="body1">{/* Display created_time */}
                {signature.created_time || 'N/A'}
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
                {signature.metadata?.location?.city || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Region
              </Typography>
              <Typography variant="body1">
                {signature.metadata?.location?.region || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Country
              </Typography>
              <Typography variant="body1">
                {signature.metadata?.location?.country || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                IP Address
              </Typography>
              <Typography variant="body1">
                {signature.metadata?.location?.ip_address || 'N/A'}
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
                {signature.metadata?.device?.browser || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Device Type
              </Typography>
              <Typography variant="body1">
                {signature.metadata?.device?.device_type || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Screen Resolution
              </Typography>
              <Typography variant="body1">
                {signature.metadata?.device?.screen_resolution || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Timezone
              </Typography>
              <Typography variant="body1">
                {signature.metadata?.device?.timezone || 'N/A'}
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
  const navigate = useNavigate();
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchSignatures = async () => {
    console.log('Starting to fetch signatures...');
    setLoading(true);
    setError(null);
    try {
      const { data: signaturesData, error: signaturesError } = await supabase
        .from('signatures')
        .select(`
          *,
          signature_metadata (
            metadata
          )
        `)
        .order('created_date', { ascending: false }).order('created_time', { ascending: false });

      if (signaturesError) throw signaturesError;

      const processedSignatures = (signaturesData || []).map(signature => ({
        ...signature,
        metadata: signature.metadata?.[0]?.metadata || null
      }));

      console.log('Fetched signatures:', processedSignatures);
      setSignatures(processedSignatures);
    } catch (err: any) {
      console.error('Error in fetchSignatures:', err);
      setError(err.message || 'Failed to load signatures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignatures();
  }, []);

  const handleViewDetails = (signature: Signature) => {
    setSelectedSignature(signature);
    setDetailsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('signatures')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchSignatures();
    } catch (err: any) {
      console.error('Error deleting signature:', err);
      setError(err.message || 'Failed to delete signature');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('signatures')
        .delete()
        .neq('id', ''); // Delete all records

      if (deleteError) throw deleteError;
      await fetchSignatures();
    } catch (err: any) {
      console.error('Error deleting all signatures:', err);
      setError(err.message || 'Failed to delete all signatures');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);
    try {
      console.log('Starting sync process...');
      const response = await fetch('/.netlify/functions/sync-petition-signatures', {
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

      // Refresh the signatures data
      await fetchSignatures();
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
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'ZIP Code',
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
      signature.phone || '',
      signature.zip_code || '',
      signature.petition_id,
      // Use created_date and created_time for CSV export
      signature.created_date && signature.created_time
        ? `${signature.created_date} ${signature.created_time}`
        : '',
      signature.metadata?.device?.browser || '',
      signature.metadata?.device?.device_type || '',
      signature.metadata?.device?.screen_resolution || '',
      signature.metadata?.device?.timezone || '',
      signature.metadata?.location?.city || '',
      signature.metadata?.location?.region || '',
      signature.metadata?.location?.country || '',
      signature.metadata?.location?.ip_address || '',
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

  // Filter and sort signatures
  const filteredSignatures = signatures
    .filter(signature => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        signature.first_name.toLowerCase().includes(searchLower) ||
        signature.last_name.toLowerCase().includes(searchLower) ||
        signature.email.toLowerCase().includes(searchLower) ||
        signature.petition_id.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Signature];
      const bValue = b[sortBy as keyof Signature];
      const order = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * order;
      }
      return 0;
    });

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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Petition Signatures
            </Typography>
            <Box>
              <Button
                onClick={fetchSignatures}
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

              {signatures.length > 0 && (
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
            Total Signatures: {signatures.length}
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

        {/* Filters */}
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
                  <MenuItem value="created_at">Date Signed</MenuItem>
                  <MenuItem value="first_name">First Name</MenuItem>
                  <MenuItem value="last_name">Last Name</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="petition_id">Petition ID</MenuItem>
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
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>ZIP Code</TableCell>
                  <TableCell>Petition ID</TableCell>
                  <TableCell>Signed At (EST)</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSignatures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No signatures found</TableCell>
                  </TableRow>
                ) : (
                  filteredSignatures.map((signature) => (
                    <TableRow key={signature.id}>
                      <TableCell>{`${signature.first_name} ${signature.last_name}`}</TableCell>
                      <TableCell>{signature.email}</TableCell>
                      <TableCell>{signature.phone || 'N/A'}</TableCell>
                      <TableCell>{signature.zip_code || 'N/A'}</TableCell>
                      <TableCell>{signature.petition_id}</TableCell>
                      <TableCell>
                        {/* Display created_date and created_time */}
                        {signature.created_date && signature.created_time
                          ? `${signature.created_date} ${signature.created_time}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(signature)}
                            sx={{ color: '#01BD9B' }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedId(signature.id);
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
        signature={selectedSignature}
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
        title="Delete Signature"
        message="Are you sure you want to delete this signature? This action cannot be undone."
      />

      <DeleteConfirmationDialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        onConfirm={() => {
          handleDeleteAll();
          setDeleteAllDialogOpen(false);
        }}
        title="Delete All Signatures"
        message="This will permanently delete all signatures. This action cannot be undone."
        requireConfirmText={true}
      />
    </Container>
  );
};

export default PetitionSignatures; 