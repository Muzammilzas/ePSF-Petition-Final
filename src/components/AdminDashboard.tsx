import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Tooltip,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Refresh as RefreshIcon, 
  Search as SearchIcon, 
  Visibility as VisibilityIcon, 
  Delete as DeleteIcon,
  List as ListIcon,
  Edit as EditIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Define an interface for the column data
interface TableColumn {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

// Add new interface for PetitionSignatures dialog
interface SignaturesDialogProps {
  open: boolean;
  onClose: () => void;
  petitionId: string;
  petitionTitle: string;
}

const SignaturesDialog: React.FC<SignaturesDialogProps> = ({ open, onClose, petitionId, petitionTitle }) => {
  const [signatures, setSignatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const { data, error } = await supabase
          .from('signatures')
          .select('*')
          .eq('petition_id', petitionId)
          .order('created_date', { ascending: false })
          .order('created_time', { ascending: false });

        if (error) throw error;
        setSignatures(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchSignatures();
    }
  }, [petitionId, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Signatures for Petition
        <Typography variant="subtitle1" color="textSecondary">
          {petitionTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Timeshare Name</TableCell>
                  <TableCell>Signed At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {signatures.map((signature) => (
                  <TableRow key={signature.id}>
                    <TableCell>{`${signature.first_name} ${signature.last_name}`}</TableCell>
                    <TableCell>{signature.email}</TableCell>
                    <TableCell>{signature.timeshare_name || 'N/A'}</TableCell>
                    <TableCell>
                      {signature.created_date && signature.created_time 
                        ? `${signature.created_date} ${signature.created_time}`
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Add new interface for EditPetitionDialog
interface EditPetitionDialogProps {
  open: boolean;
  onClose: () => void;
  petition: any;
  onSave: (id: string, updates: any) => Promise<void>;
}

const EditPetitionDialog: React.FC<EditPetitionDialogProps> = ({ open, onClose, petition, onSave }) => {
  const [goal, setGoal] = useState(petition?.goal || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSave(petition.id, { goal: parseInt(goal.toString()) });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update petition');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Petition</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Signature Goal"
          type="number"
          value={goal}
          onChange={(e) => setGoal(parseInt(e.target.value) || 0)}
          margin="normal"
          InputProps={{
            inputProps: { min: 0 }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading}
          sx={{ 
            backgroundColor: '#01BD9B',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#01a989'
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AdminDashboard: React.FC = () => {
  const { user, signOut, forceRefreshAuth } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [petitions, setPetitions] = useState<any[]>([]);
  const [filteredPetitions, setFilteredPetitions] = useState<any[]>([]);
  const [signatures, setSignatures] = useState<any[]>([]);
  const [filteredSignatures, setFilteredSignatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'petition' | 'signature' } | null>(null);
  const [loadingRetries, setLoadingRetries] = useState(0);
  
  // Filter states
  const [petitionSearchTerm, setPetitionSearchTerm] = useState('');
  const [petitionSortBy, setPetitionSortBy] = useState('created_at');
  const [petitionSortOrder, setPetitionSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [signatureSearchTerm, setSignatureSearchTerm] = useState('');
  const [signatureSortBy, setSignatureSortBy] = useState('created_at');
  const [signatureSortOrder, setSignatureSortOrder] = useState<'asc' | 'desc'>('desc');

  const [selectedPetition, setSelectedPetition] = useState<{id: string, title: string} | null>(null);
  const [editPetition, setEditPetition] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Quick admin check first
        const { data: adminCheck } = await supabase
          .from('admins')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (!adminCheck) {
          setError('Access denied. Please verify you have admin privileges.');
          setLoading(false);
          return;
        }

        // Fetch petitions with signature counts
        const { data: petitionsData, error: petitionsError } = await supabase
          .from('petitions')
          .select(`
            *,
            signatures:signatures(count)
          `)
          .order('created_date', { ascending: false })
          .order('created_time', { ascending: false });

        if (petitionsError) throw petitionsError;

        // Process the data to include signature count
        const processedPetitions = (petitionsData || []).map(petition => ({
          ...petition,
          signature_count: petition.signatures?.[0]?.count || 0
        }));

        setPetitions(processedPetitions);
        setFilteredPetitions(processedPetitions);

        // Fetch signatures
        const { data: signaturesData, error: signaturesError } = await supabase
          .from('signatures')
          .select('*')
          .order('created_date', { ascending: false })
          .order('created_time', { ascending: false });

        if (signaturesError) throw signaturesError;
        setSignatures(signaturesData || []);
        setFilteredSignatures(signaturesData || []);

      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Apply filters to petitions
  useEffect(() => {
    if (petitions.length > 0) {
      let filtered = [...petitions];
      
      // Apply search filter
      if (petitionSearchTerm) {
        const searchLower = petitionSearchTerm.toLowerCase();
        filtered = filtered.filter(petition => 
          (petition.title && petition.title.toLowerCase().includes(searchLower)) ||
          (petition.story && petition.story.toLowerCase().includes(searchLower)) ||
          String(petition.goal).includes(searchLower) ||
          String(petition.signature_count).includes(searchLower)
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let valueA = a[petitionSortBy];
        let valueB = b[petitionSortBy];
        
        // Handle string comparison
        if (typeof valueA === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
        
        // Handle null/undefined values
        if (valueA === undefined || valueA === null) return petitionSortOrder === 'asc' ? -1 : 1;
        if (valueB === undefined || valueB === null) return petitionSortOrder === 'asc' ? 1 : -1;
        
        if (valueA < valueB) return petitionSortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return petitionSortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      
      setFilteredPetitions(filtered);
    }
  }, [petitions, petitionSearchTerm, petitionSortBy, petitionSortOrder]);

  // Apply filters to signatures
  useEffect(() => {
    if (signatures.length > 0) {
      let filtered = [...signatures];
      
      // Apply search filter
      if (signatureSearchTerm) {
        const searchTermLower = signatureSearchTerm.toLowerCase();
        filtered = filtered.filter(signature => 
          (signature.first_name && signature.first_name.toLowerCase().includes(searchTermLower)) ||
          (signature.last_name && signature.last_name.toLowerCase().includes(searchTermLower)) ||
          (signature.email && signature.email.toLowerCase().includes(searchTermLower)) ||
          (signature.location_city && signature.location_city.toLowerCase().includes(searchTermLower)) ||
          (signature.phone && signature.phone.toLowerCase().includes(searchTermLower)) ||
          (signature.zip_code && signature.zip_code.toLowerCase().includes(searchTermLower))
        );
      }
      
      // Apply sorting
      if (signatureSortBy) {
        filtered.sort((a, b) => {
          let valueA = a[signatureSortBy] || '';
          let valueB = b[signatureSortBy] || '';
          
          if (typeof valueA === 'string') valueA = valueA.toLowerCase();
          if (typeof valueB === 'string') valueB = valueB.toLowerCase();
          
          if (valueA < valueB) return signatureSortOrder === 'asc' ? -1 : 1;
          if (valueA > valueB) return signatureSortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      setFilteredSignatures(filtered);
    }
  }, [signatures, signatureSearchTerm, signatureSortBy, signatureSortOrder]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleDeleteClick = (id: string, type: 'petition' | 'signature') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'petition') {
        const { error } = await supabase
          .from('petitions')
          .delete()
          .eq('id', itemToDelete.id);
        
        if (error) throw error;
        
        setPetitions(petitions.filter(petition => petition.id !== itemToDelete.id));
      } else {
        const { error } = await supabase
          .from('signatures')
          .delete()
          .eq('id', itemToDelete.id);
        
        if (error) throw error;
        
        setSignatures(signatures.filter(signature => signature.id !== itemToDelete.id));
      }
    } catch (error: any) {
      console.error('Error deleting item:', error);
      setError(error.message || 'Failed to delete item');
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const formatDate = (dateString: string) => {
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

  // Add a function to handle viewing a petition
  const handleViewPetition = (id: string) => {
    navigate(`/share/${id}`);
  };

  // Add a refresh function
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await forceRefreshAuth();
      window.location.reload();
    } catch (error) {
      setError('Failed to refresh. Please try again.');
      setLoading(false);
    }
  };

  // Add function to handle petition updates
  const handleUpdatePetition = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('petitions')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPetitions(petitions.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update petition');
    }
  };

  // Add number formatting function
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert 
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Logged in as: {user?.email}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/create-petition')}
              sx={{ mr: 2 }}
            >
              Create Petition
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/petitions')}
              sx={{
                backgroundColor: '#01BD9B',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#01a989'
                }
              }}
            >
              Petitions
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/petition-signatures')}
              sx={{
                backgroundColor: '#01BD9B',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#01a989'
                }
              }}
            >
              Petition Signatures
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/forms')}
              sx={{
                backgroundColor: '#E0AC3F',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#c99a38'
                }
              }}
            >
              Forms
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/admin/scam-reports')}
              sx={{ 
                backgroundColor: '#01BD9B',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#01a989'
                }
              }}
            >
              Scam Reports
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              size="small"
              onClick={handleSignOut}
              sx={{ 
                color: '#fff',
                backgroundColor: '#E0AC3F',
                '&:hover': {
                  backgroundColor: '#c99a38'
                }
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Petitions" />
            <Tab label="Signatures" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Petitions"
                  variant="outlined"
                  size="small"
                  value={petitionSearchTerm}
                  onChange={(e) => setPetitionSearchTerm(e.target.value)}
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
                    value={petitionSortBy}
                    label="Sort By"
                    onChange={(e) => setPetitionSortBy(e.target.value)}
                  >
                    <MenuItem value="created_at">Date Created</MenuItem>
                    <MenuItem value="signature_count">Signature Count</MenuItem>
                    <MenuItem value="goal">Goal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Order</InputLabel>
                  <Select
                    value={petitionSortOrder}
                    label="Order"
                    onChange={(e) => setPetitionSortOrder(e.target.value as 'asc' | 'desc')}
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  onClick={handleRefresh}
                  sx={{ 
                    color: '#fff',
                    backgroundColor: '#01BD9B',
                    '&:hover': {
                      backgroundColor: '#01a989'
                    }
                  }}
                  startIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">
              All Petitions ({formatNumber(filteredPetitions.length)})
            </Typography>
          </Box>
          
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Goal</TableCell>
                  <TableCell>Signatures</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPetitions.map((petition) => (
                  <TableRow key={petition.id}>
                    <TableCell>{petition.id}</TableCell>
                    <TableCell>{petition.title}</TableCell>
                    <TableCell>{formatNumber(petition.goal)}</TableCell>
                    <TableCell>{formatNumber(petition.signature_count || 0)}</TableCell>
                    <TableCell>
                      {petition.created_date || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="View Petition">
                          <IconButton
                            onClick={() => handleViewPetition(petition.id)}
                            color="primary"
                            size="small"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Signatures">
                          <IconButton
                            onClick={() => navigate(`/admin/petitions/${petition.id}/signatures`)}
                            color="info"
                            size="small"
                          >
                            <ListIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Petition">
                          <IconButton
                            onClick={() => setEditPetition(petition)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Petition">
                          <IconButton
                            onClick={() => handleDeleteClick(petition.id, 'petition')}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Signatures"
                  variant="outlined"
                  size="small"
                  value={signatureSearchTerm}
                  onChange={(e) => setSignatureSearchTerm(e.target.value)}
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
                    value={signatureSortBy}
                    label="Sort By"
                    onChange={(e) => setSignatureSortBy(e.target.value)}
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
                    value={signatureSortOrder}
                    label="Order"
                    onChange={(e) => setSignatureSortOrder(e.target.value as 'asc' | 'desc')}
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  onClick={handleRefresh}
                  sx={{ 
                    color: '#fff',
                    backgroundColor: '#01BD9B',
                    '&:hover': {
                      backgroundColor: '#01a989'
                    }
                  }}
                  startIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">
              All Signatures ({formatNumber(filteredSignatures.length)})
            </Typography>
          </Box>
          
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell width="5%">#</TableCell>
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
                    <TableCell colSpan={7} align="center">No signatures found</TableCell>
                  </TableRow>
                ) : (
                  filteredSignatures.map((signature, index) => (
                    <TableRow key={signature.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{signature.first_name || 'N/A'}</TableCell>
                      <TableCell>{signature.last_name || 'N/A'}</TableCell>
                      <TableCell>{signature.email}</TableCell>
                      <TableCell>{signature.petition_id}</TableCell>
                      <TableCell>
                        {signature.created_date && signature.created_time 
                          ? `${signature.created_date} ${signature.created_time}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(signature.id, 'signature')}
                          sx={{ 
                            color: '#fff',
                            backgroundColor: '#f44336',
                            '&:hover': {
                              backgroundColor: '#d32f2f'
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel} 
            color="primary"
            sx={{ 
              color: '#01BD9B'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            autoFocus 
            sx={{ 
              color: '#fff',
              backgroundColor: '#f44336',
              '&:hover': {
                backgroundColor: '#d32f2f'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for viewing signatures */}
      {selectedPetition && (
        <SignaturesDialog
          open={true}
          onClose={() => setSelectedPetition(null)}
          petitionId={selectedPetition.id}
          petitionTitle={selectedPetition.title}
        />
      )}

      {/* EditPetitionDialog */}
      {editPetition && (
        <EditPetitionDialog
          open={true}
          onClose={() => setEditPetition(null)}
          petition={editPetition}
          onSave={handleUpdatePetition}
        />
      )}
    </Container>
  );
};

export default AdminDashboard; 