import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { supabase } from '../services/supabase';
import { Visibility, GetApp } from '@mui/icons-material';
import { saveAs } from 'file-saver';

const FormSubmissionsAdmin: React.FC = () => {
  const [abandonedForms, setAbandonedForms] = useState<any[]>([]);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [deleteAllError, setDeleteAllError] = useState<string | null>(null);

  const fetchAbandonedForms = async () => {
    try {
      const { data, error } = await supabase
        .from('abandoned_forms')
        .select('*')
        .eq('status', 'abandoned')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAbandonedForms(data || []);
    } catch (error) {
      console.error('Error fetching abandoned forms:', error);
    }
  };

  useEffect(() => {
    fetchAbandonedForms();
  }, []);

  const handleDeleteAllAbandoned = async () => {
    setDeleteAllLoading(true);
    setDeleteAllError(null);
    try {
      const { error } = await supabase
        .from('abandoned_forms')
        .delete()
        .eq('status', 'abandoned');

      if (error) throw error;

      // Refresh the data
      fetchAbandonedForms();
      setDeleteAllDialogOpen(false);
    } catch (error) {
      console.error('Error deleting all abandoned forms:', error);
      setDeleteAllError('Failed to delete abandoned forms. Please try again.');
    } finally {
      setDeleteAllLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Abandoned Forms Section */}
      <Paper sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Abandoned Forms
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={() => setDeleteAllDialogOpen(true)}
            disabled={abandonedForms.length === 0}
          >
            Delete All Abandoned
          </Button>
        </Box>

        {abandonedForms.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            No abandoned forms found.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Form Type</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {abandonedForms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell>{form.form_type}</TableCell>
                    <TableCell>{form.email}</TableCell>
                    <TableCell>{new Date(form.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => {
                          // Handle individual form deletion
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Delete All Confirmation Dialog */}
      <Dialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        aria-labelledby="delete-all-dialog-title"
      >
        <DialogTitle id="delete-all-dialog-title">
          Delete All Abandoned Forms
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all {abandonedForms.length} abandoned form entries? This action cannot be undone.
          </Typography>
          {deleteAllError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteAllError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAllDialogOpen(false)} disabled={deleteAllLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAllAbandoned}
            color="error"
            variant="contained"
            disabled={deleteAllLoading}
            startIcon={deleteAllLoading ? <CircularProgress size={20} /> : <DeleteForeverIcon />}
          >
            {deleteAllLoading ? 'Deleting...' : 'Delete All'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormSubmissionsAdmin; 