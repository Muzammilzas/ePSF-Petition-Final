import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Computer as ComputerIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';

// Add interface for metadata
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
  timeshare_name?: string;
  created_date: string;
  metadata?: SignatureMetadata;
  [key: string]: any; // Add index signature for sorting
}

const PetitionSignatures: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [petition, setPetition] = useState<any>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [filteredSignatures, setFilteredSignatures] = useState<Signature[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSignature, setSelectedSignature] = useState<string | null>(null);
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState<SignatureMetadata | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Add isDeleteConfirmed computed value
  const isDeleteConfirmed = deleteConfirmText === 'CONFIRM';

  useEffect(() => {
    fetchData();
  }, [id]);

  // Apply filters to signatures
  useEffect(() => {
    if (signatures.length > 0) {
      let filtered = [...signatures];
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(signature => 
          (signature.first_name && signature.first_name.toLowerCase().includes(searchLower)) ||
          (signature.last_name && signature.last_name.toLowerCase().includes(searchLower)) ||
          (signature.email && signature.email.toLowerCase().includes(searchLower)) ||
          (signature.timeshare_name && signature.timeshare_name.toLowerCase().includes(searchLower)) ||
          (signature.metadata && (
            (signature.metadata.location.city && signature.metadata.location.city.toLowerCase().includes(searchLower)) ||
            (signature.metadata.location.region && signature.metadata.location.region.toLowerCase().includes(searchLower)) ||
            (signature.metadata.location.country && signature.metadata.location.country.toLowerCase().includes(searchLower))
          ))
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let valueA = a[sortBy] || '';
        let valueB = b[sortBy] || '';
        
        if (typeof valueA === 'string') valueA = valueA.toLowerCase();
        if (typeof valueB === 'string') valueB = valueB.toLowerCase();
        
        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      
      setFilteredSignatures(filtered);
    }
  }, [signatures, searchTerm, sortBy, sortOrder]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch petition details if we have an ID
      if (id) {
        const { data: petitionData, error: petitionError } = await supabase
          .from('petitions')
          .select('*')
          .eq('id', id)
          .single();
        
        if (petitionError) throw petitionError;
        setPetition(petitionData);
      }
      
      // Fetch signatures with their metadata
      let query = supabase
        .from('signatures')
        .select(`
          *,
          signature_metadata (
            metadata
          )
        `)
        .order('created_date', { ascending: false });
      
      // Only filter by petition_id if we have one
      if (id) {
        query = query.eq('petition_id', id);
      }
      
      const { data: signaturesData, error: signaturesError } = await query;
      
      if (signaturesError) throw signaturesError;
      
      // Process signatures to include metadata
      const processedSignatures = (signaturesData || []).map(signature => ({
        ...signature,
        metadata: signature.signature_metadata?.[0]?.metadata || null
      }));
      
      setSignatures(processedSignatures);
      setFilteredSignatures(processedSignatures);
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMeta = async (signature: Signature) => {
    try {
      setMetadataLoading(true);
      setMetadataError(null);
      
      // Fetch metadata for the signature
      const { data: metadataData, error: metadataError } = await supabase
        .from('signature_metadata')
        .select('metadata')
        .eq('signature_id', signature.id)
        .single();

      if (metadataError) {
        console.error('Error fetching metadata:', metadataError);
        setMetadataError('Failed to load signature details');
        return;
      }

      if (metadataData?.metadata) {
        setSelectedSignature(signature.id);
        setSelectedMetadata(metadataData.metadata);
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

  const handleDelete = async (signatureId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('signatures')
        .delete()
        .eq('id', signatureId);
      
      if (deleteError) throw deleteError;
      
      // Remove the deleted signature from the state
      setSignatures(prev => prev.filter(sig => sig.id !== signatureId));
      setFilteredSignatures(prev => prev.filter(sig => sig.id !== signatureId));
      setDeleteDialogOpen(false);
      setSelectedSignature(null);
      
    } catch (error: any) {
      console.error('Error deleting signature:', error);
      setError(error.message);
    }
  };

  const handleCloseMetaDialog = () => {
    setMetadataDialogOpen(false);
    setSelectedSignature(null);
    setSelectedMetadata(null);
  };

  const renderMetaDialog = () => {
    if (!selectedMetadata) return null;

    return (
      <Dialog
        open={metadataDialogOpen}
        onClose={() => {
          setMetadataDialogOpen(false);
          setSelectedMetadata(null);
          setMetadataError(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" component="div" gutterBottom>
            Signature Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {metadataLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : metadataError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {metadataError}
            </Alert>
          ) : selectedMetadata ? (
            <Box sx={{ mt: 2 }}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#01BD9B' }}>
                  Location Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">City</Typography>
                    <Typography variant="body1" gutterBottom>{selectedMetadata.location.city}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">Region</Typography>
                    <Typography variant="body1" gutterBottom>{selectedMetadata.location.region}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">Country</Typography>
                    <Typography variant="body1" gutterBottom>{selectedMetadata.location.country}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">IP Address</Typography>
                    <Typography variant="body1" gutterBottom>{selectedMetadata.location.ip_address}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Coordinates</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedMetadata.location.latitude}, {selectedMetadata.location.longitude}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#01BD9B' }}>
                  Device Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">Browser</Typography>
                    <Typography variant="body1" gutterBottom>{selectedMetadata.device.browser}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">Device Type</Typography>
                    <Typography variant="body1" gutterBottom>{selectedMetadata.device.device_type}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">Screen Resolution</Typography>
                    <Typography variant="body1" gutterBottom>{selectedMetadata.device.screen_resolution}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">Language</Typography>
                    <Typography variant="body1" gutterBottom>{selectedMetadata.device.language}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">Timezone</Typography>
                    <Typography variant="body1" gutterBottom>{selectedMetadata.device.timezone}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">User Agent</Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }} gutterBottom>
                      {selectedMetadata.device.user_agent}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#01BD9B' }}>
                  Submission Information
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">Submission Date</Typography>
                <Typography variant="body1">
                  {new Date(selectedMetadata.submission_date).toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </Typography>
              </Paper>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setMetadataDialogOpen(false);
              setSelectedMetadata(null);
              setMetadataError(null);
            }}
            variant="contained"
            sx={{ 
              backgroundColor: '#01BD9B',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#01a989'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleExportCSV = () => {
    // Convert signatures to CSV format
    const headers = ['First Name', 'Last Name', 'Email', 'Petition', 'Signed At'];
    const csvData = filteredSignatures.map(signature => [
      signature.first_name,
      signature.last_name,
      signature.email,
      signature.petition_id,
      new Date(signature.created_date).toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: undefined
      }).replace(',', '')
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `petition-signatures-${new Date().toISOString()}.csv`;
    link.click();
  };

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('signatures')
        .delete()
        .not('petition_id', 'is', null); // Delete all records that have a petition_id (which all valid records should have)

      if (error) throw error;

      setDeleteAllDialogOpen(false);
      await fetchData(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting all signatures:', error);
      setError(error.message || 'Failed to delete all signatures');
    } finally {
      setLoading(false);
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
      console.log('Sync response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server: ' + responseText);
      }

      if (!response.ok) {
        throw new Error(errorData.error || errorData.details || 'Failed to sync signatures');
      }

      setSyncSuccess(true);
      await fetchData(); // Refresh the list after successful sync
    } catch (error: any) {
      console.error('Error syncing signatures:', error);
      setSyncError(error.message || 'Failed to sync signatures');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SyncIcon />}
                onClick={handleSync}
                disabled={syncing}
                sx={{ 
                  backgroundColor: '#01BD9B',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#01a989'
                  }
                }}
              >
                {syncing ? 'Syncing...' : 'Sync to Sheet'}
              </Button>
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportCSV}
                sx={{ 
                  backgroundColor: '#01BD9B',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#01a989'
                  }
                }}
              >
                Export CSV
              </Button>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteAllDialogOpen(true)}
                sx={{ 
                  backgroundColor: '#ff4444',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#cc0000'
                  }
                }}
              >
                Delete All
              </Button>
            </Box>
          </Box>
          
          {petition && (
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {petition.title || 'Untitled Petition'}
            </Typography>
          )}
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

        {syncSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Successfully synced signatures to Google Sheet
          </Alert>
        )}

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
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={fetchData}
                startIcon={<RefreshIcon />}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Signatures Table */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            Total Signatures: {filteredSignatures.length}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Petition</TableCell>
                <TableCell>Signed At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSignatures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No signatures found
                  </TableCell>
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
                    <TableCell>{signature.petition_id}</TableCell>
                    <TableCell>
                      {new Date(signature.created_date).toLocaleString('en-US', {
                        timeZone: 'America/New_York',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZoneName: undefined
                      }).replace(',', '')}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() => handleViewMeta(signature)}
                            sx={{ 
                              color: '#01BD9B',
                              '&:hover': {
                                backgroundColor: 'rgba(1, 189, 155, 0.1)'
                              }
                            }}
                            size="small"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Signature">
                          <IconButton
                            onClick={() => {
                              setSelectedSignature(signature.id);
                              setDeleteDialogOpen(true);
                            }}
                            sx={{ 
                              color: '#ff4444',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 68, 68, 0.1)'
                              }
                            }}
                            size="small"
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

        {/* Delete All Confirmation Dialog */}
        <Dialog
          open={deleteAllDialogOpen}
          onClose={() => {
            setDeleteAllDialogOpen(false);
            setDeleteConfirmText(''); // Reset the confirmation text when closing
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h4" component="div">
              Delete All Submissions
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 3 }}>
              This will permanently delete all submissions. This action cannot be undone.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Type "CONFIRM" to delete all submissions
            </Typography>
            <TextField
              fullWidth
              placeholder="Type CONFIRM"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setDeleteAllDialogOpen(false);
                setDeleteConfirmText(''); // Reset the confirmation text
              }}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteAll}
              color="error"
              variant="contained"
              disabled={!isDeleteConfirmed}
            >
              DELETE
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
      {renderMetaDialog()}
    </Container>
  );
};

export default PetitionSignatures; 