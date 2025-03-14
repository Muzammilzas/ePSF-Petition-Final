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

const PetitionSignatures: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [petition, setPetition] = useState<any>(null);
  const [signatures, setSignatures] = useState<any[]>([]);
  const [filteredSignatures, setFilteredSignatures] = useState<any[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedSignature, setSelectedSignature] = useState<any | null>(null);
  const [openMetaDialog, setOpenMetaDialog] = useState(false);

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
          (signature.timeshare_name && signature.timeshare_name.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];
        
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
      
      // Fetch petition details
      const { data: petitionData, error: petitionError } = await supabase
        .from('petitions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (petitionError) throw petitionError;
      setPetition(petitionData);
      
      // Fetch signatures with their metadata
      const { data: signaturesData, error: signaturesError } = await supabase
        .from('signatures')
        .select(`
          *,
          metadata:signature_metadata(metadata)
        `)
        .eq('petition_id', id)
        .order('created_at', { ascending: false });
      
      if (signaturesError) throw signaturesError;
      
      // Process signatures to include metadata
      const processedSignatures = (signaturesData || []).map(signature => ({
        ...signature,
        metadata: signature.metadata?.[0]?.metadata || null
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

  const handleDeleteSignature = async (signatureId: string) => {
    try {
      const { error } = await supabase
        .from('signatures')
        .delete()
        .eq('id', signatureId);
      
      if (error) throw error;
      
      // Remove the deleted signature from the state
      setSignatures(prev => prev.filter(sig => sig.id !== signatureId));
      setFilteredSignatures(prev => prev.filter(sig => sig.id !== signatureId));
      
    } catch (error: any) {
      console.error('Error deleting signature:', error);
      setError(error.message);
    }
  };

  const handleViewMeta = (signature: any) => {
    setSelectedSignature(signature);
    setOpenMetaDialog(true);
  };

  const handleCloseMetaDialog = () => {
    setOpenMetaDialog(false);
    setSelectedSignature(null);
  };

  const renderMetaDialog = () => {
    if (!selectedSignature?.metadata) return null;
    const metadata = selectedSignature.metadata;

    return (
      <Dialog
        open={openMetaDialog}
        onClose={handleCloseMetaDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Signature Details for {selectedSignature.first_name} {selectedSignature.last_name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Device Information */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ComputerIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Device Information</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Browser:</Typography>
                    <Typography variant="body1">{metadata.device.browser}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Device Type:</Typography>
                    <Typography variant="body1">{metadata.device.device_type}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Screen Resolution:</Typography>
                    <Typography variant="body1">{metadata.device.screen_resolution}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Language:</Typography>
                    <Typography variant="body1">{metadata.device.language}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">User Agent:</Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                      {metadata.device.user_agent}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Timezone:</Typography>
                    <Typography variant="body1">{metadata.device.timezone}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Location Information */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Location Information</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">Location:</Typography>
                    <Typography variant="body1">
                      {`${metadata.location.city}, ${metadata.location.region}, ${metadata.location.country}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">IP Address:</Typography>
                    <Typography variant="body1">{metadata.location.ip_address}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">Coordinates:</Typography>
                    <Typography variant="body1">
                      {`${metadata.location.latitude}, ${metadata.location.longitude}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Submission Information */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScheduleIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Submission Information</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">Submission Date:</Typography>
                <Typography variant="body1">
                  {new Date(metadata.submission_date).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMetaDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
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
          
          <Typography variant="h4" component="h1" gutterBottom>
            Petition Signatures
          </Typography>
          
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
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Timeshare Name</TableCell>
                <TableCell>Signed At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSignatures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No signatures found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSignatures.map((signature) => (
                  <TableRow 
                    key={signature.id}
                    sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                  >
                    <TableCell>
                      {`${signature.first_name} ${signature.last_name}`}
                    </TableCell>
                    <TableCell>{signature.email}</TableCell>
                    <TableCell>{signature.timeshare_name || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(signature.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleViewMeta(signature)}
                          disabled={!signature.metadata}
                          sx={{ 
                            backgroundColor: '#01BD9B',
                            color: '#FFFFFF',
                            '&:hover': {
                              backgroundColor: '#E0AC3F',
                              color: '#FFFFFF'
                            }
                          }}
                        >
                          View Meta
                        </Button>
                        <Tooltip title="Delete Signature">
                          <IconButton
                            onClick={() => handleDeleteSignature(signature.id)}
                            color="error"
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
      </Paper>
      {renderMetaDialog()}
    </Container>
  );
};

export default PetitionSignatures; 