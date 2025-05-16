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
import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '../../services/supabase';

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

const PetitionsAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [petitions, setPetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editPetition, setEditPetition] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchPetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: petitionsData, error: petitionsError } = await supabase
        .from('petitions')
        .select(`
          *,
          signatures:signatures(count)
        `)
        .order('created_at', { ascending: false });

      if (petitionsError) throw petitionsError;

      const processedPetitions = (petitionsData || []).map(petition => ({
        ...petition,
        signature_count: petition.signatures?.[0]?.count || 0
      }));

      setPetitions(processedPetitions);
    } catch (err: any) {
      console.error('Error fetching petitions:', err);
      setError(err.message || 'Failed to load petitions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, []);

  const handleUpdatePetition = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('petitions')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setPetitions(petitions.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update petition');
    }
  };

  const handleDeletePetition = async () => {
    if (!itemToDelete) return;
    
    try {
      const { error } = await supabase
        .from('petitions')
        .delete()
        .eq('id', itemToDelete);
      
      if (error) throw error;
      
      setPetitions(petitions.filter(petition => petition.id !== itemToDelete));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete petition');
    }
  };

  const handleViewPetition = (id: string) => {
    navigate(`/share/${id}`);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Filter and sort petitions
  const filteredPetitions = petitions
    .filter(petition => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        petition.title?.toLowerCase().includes(searchLower) ||
        petition.story?.toLowerCase().includes(searchLower) ||
        String(petition.goal).includes(searchLower) ||
        String(petition.signature_count).includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const order = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * order;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * order;
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
              Manage Petitions
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/create-petition')}
              sx={{ 
                backgroundColor: '#01BD9B',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#01a989'
                }
              }}
            >
              Create New Petition
            </Button>
          </Box>
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
                label="Search Petitions"
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
                onClick={fetchPetitions}
                startIcon={<RefreshIcon />}
                sx={{ 
                  backgroundColor: '#01BD9B',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#01a989'
                  }
                }}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Petitions Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Goal</TableCell>
                  <TableCell>Signatures</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPetitions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No petitions found</TableCell>
                  </TableRow>
                ) : (
                  filteredPetitions.map((petition) => (
                    <TableRow key={petition.id}>
                      <TableCell>{petition.title}</TableCell>
                      <TableCell>{formatNumber(petition.goal)}</TableCell>
                      <TableCell>{formatNumber(petition.signature_count)}</TableCell>
                      <TableCell>
                        {((petition.signature_count / petition.goal) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        {new Date(petition.created_at).toLocaleDateString('en-US', {
                          timeZone: 'America/New_York',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
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
                              onClick={() => {
                                setItemToDelete(petition.id);
                                setDeleteDialogOpen(true);
                              }}
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
        )}
      </Paper>

      {/* Edit Dialog */}
      {editPetition && (
        <EditPetitionDialog
          open={true}
          onClose={() => setEditPetition(null)}
          petition={editPetition}
          onSave={handleUpdatePetition}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this petition? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDeleteDialogOpen(false);
              setItemToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeletePetition}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PetitionsAdmin; 