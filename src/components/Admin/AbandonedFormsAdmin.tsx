import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { getAbandonedForms, deleteAbandonedForm, deleteAllAbandonedForms, AbandonedForm } from '../../services/abandonedFormService';

const AbandonedFormsAdmin: React.FC = () => {
  const [abandonedForms, setAbandonedForms] = useState<AbandonedForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<AbandonedForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchAbandonedForms = async () => {
    setLoading(true);
    const forms = await getAbandonedForms();
    setAbandonedForms(forms);
    setLoading(false);
  };

  useEffect(() => {
    fetchAbandonedForms();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this abandoned form?')) {
      return;
    }

    const { success, error } = await deleteAbandonedForm(id);
    if (success) {
      fetchAbandonedForms();
    } else {
      console.error('Error deleting abandoned form:', error);
      alert('Failed to delete abandoned form. Please try again.');
    }
  };

  const handleDeleteAll = async () => {
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    const { success, error } = await deleteAllAbandonedForms();
    if (success) {
      setDeleteAllDialogOpen(false);
      setDeleteConfirmation('');
      await fetchAbandonedForms();
    } else {
      console.error('Error deleting all abandoned forms:', error);
      setDeleteError('Failed to delete all abandoned forms. Please try again.');
    }
    setIsDeleting(false);
  };

  const handleViewDetails = (form: AbandonedForm) => {
    setSelectedForm(form);
  };

  const handleCloseDialog = () => {
    setSelectedForm(null);
  };

  const handleCloseDeleteAllDialog = () => {
    setDeleteAllDialogOpen(false);
    setDeleteConfirmation('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Abandoned Form Submissions
        </Typography>
        <Button
          variant="contained"
          color="error"
          size="large"
          startIcon={<DeleteSweepIcon />}
          onClick={() => setDeleteAllDialogOpen(true)}
          sx={{ 
            fontWeight: 'bold',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: 'error.dark',
            }
          }}
        >
          Delete All Entries
        </Button>
      </Box>

      {/* Delete All Confirmation Dialog */}
      <Dialog 
        open={deleteAllDialogOpen} 
        onClose={handleCloseDeleteAllDialog}
        PaperProps={{
          sx: { minWidth: '400px' }
        }}
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          Delete All Abandoned Forms
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography gutterBottom>
            This action will permanently delete all abandoned form entries. This cannot be undone.
          </Typography>
          <Typography gutterBottom color="error" sx={{ fontWeight: 'bold', mt: 2 }}>
            To confirm, please type "DELETE" in the field below:
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type 'DELETE' to confirm"
            sx={{ mt: 2 }}
            error={!!deleteError}
            helperText={deleteError}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseDeleteAllDialog}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAll}
            disabled={deleteConfirmation !== 'DELETE' || isDeleting}
            sx={{ fontWeight: 'bold' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete All'}
          </Button>
        </DialogActions>
      </Dialog>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : abandonedForms.length === 0 ? (
        <Typography>No abandoned forms found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Last Updated</TableCell>
                <TableCell>Step</TableCell>
                <TableCell>Reporter Info</TableCell>
                <TableCell>Scammer Info</TableCell>
                <TableCell>Money Lost</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {abandonedForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>{formatDate(form.last_updated_at || form.created_at || '')}</TableCell>
                  <TableCell>
                    <Chip
                      label={`Step ${form.current_step}`}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {form.form_data?.fullName && <Typography variant="body2">Name: {form.form_data.fullName}</Typography>}
                      {form.form_data?.email && <Typography variant="body2">Email: {form.form_data.email}</Typography>}
                      {form.form_data?.phone && <Typography variant="body2">Phone: {form.form_data.phone}</Typography>}
                      {(form.form_data?.city || form.form_data?.state) && (
                        <Typography variant="body2">
                          Location: {[form.form_data.city, form.form_data.state].filter(Boolean).join(', ')}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {form.form_data?.scammerName && <Typography variant="body2">Name: {form.form_data.scammerName}</Typography>}
                      {form.form_data?.companyName && <Typography variant="body2">Company: {form.form_data.companyName}</Typography>}
                      {form.form_data?.scammerPhone && <Typography variant="body2">Phone: {form.form_data.scammerPhone}</Typography>}
                      {form.form_data?.scammerEmail && <Typography variant="body2">Email: {form.form_data.scammerEmail}</Typography>}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {form.form_data?.moneyLost !== undefined ? (
                      <Box>
                        <Chip
                          label={form.form_data.moneyLost ? 'Yes' : 'No'}
                          color={form.form_data.moneyLost ? 'error' : 'success'}
                          size="small"
                        />
                        {form.form_data.moneyLost && form.form_data.amountLost && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Amount: ${form.form_data.amountLost}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Not specified</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(form)}
                        title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => form.id && handleDelete(form.id)}
                        title="Delete Form"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Details Dialog */}
      <Dialog
        open={!!selectedForm}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        {selectedForm && (
          <>
            <DialogTitle sx={{ 
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)', 
              bgcolor: 'primary.main', 
              color: 'white' 
            }}>
              Abandoned Form Details
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>Form Progress</Typography>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Current Step</Typography>
                      <Typography>{selectedForm.current_step}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                      <Typography>{formatDate(selectedForm.last_updated_at || selectedForm.created_at || '')}</Typography>
                    </Box>
                  </Box>
                </Paper>

                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>Reporter Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                      <Typography>{selectedForm.form_data?.fullName || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                      <Typography>{selectedForm.form_data?.email || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                      <Typography>{selectedForm.form_data?.phone || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                      <Typography>
                        {[selectedForm.form_data?.city, selectedForm.form_data?.state].filter(Boolean).join(', ') || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Age Range</Typography>
                      <Typography>{selectedForm.form_data?.ageRange || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Preferred Contact</Typography>
                      <Typography>{selectedForm.form_data?.preferredContact || 'Not specified'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>Scam Types</Typography>
                  {selectedForm.form_data?.scamTypes && (
                    <Grid container spacing={3}>
                      {selectedForm.form_data.scamTypes.fakeResale.selected && (
                        <Grid item xs={12}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" color="primary">Fake Resale</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Claimed Sale Amount</Typography>
                            <Typography>${selectedForm.form_data.scamTypes.fakeResale.claimedSaleAmount || 'Not specified'}</Typography>
                          </Paper>
                        </Grid>
                      )}
                      {selectedForm.form_data.scamTypes.upfrontFees.selected && (
                        <Grid item xs={12}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" color="primary">Upfront Fees</Typography>
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                              <Typography>${selectedForm.form_data.scamTypes.upfrontFees.amount || 'Not specified'}</Typography>
                            </Box>
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="subtitle2" color="text.secondary">Promised Services</Typography>
                              <Typography>{selectedForm.form_data.scamTypes.upfrontFees.promisedServices || 'Not specified'}</Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      )}
                      {selectedForm.form_data.scamTypes.highPressure.selected && (
                        <Grid item xs={12}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" color="primary">High Pressure</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Tactics</Typography>
                            <Typography>{selectedForm.form_data.scamTypes.highPressure.tactics || 'Not specified'}</Typography>
                          </Paper>
                        </Grid>
                      )}
                      {selectedForm.form_data.scamTypes.refundExit.selected && (
                        <Grid item xs={12}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" color="primary">Refund Exit</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Promised Refund</Typography>
                            <Typography>${selectedForm.form_data.scamTypes.refundExit.promisedRefund || 'Not specified'}</Typography>
                          </Paper>
                        </Grid>
                      )}
                      {selectedForm.form_data.scamTypes.other.selected && (
                        <Grid item xs={12}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" color="primary">Other</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                            <Typography>{selectedForm.form_data.scamTypes.other.description || 'Not specified'}</Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  )}
                </Paper>

                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>Contact Methods</Typography>
                  {selectedForm.form_data?.contactMethods && (
                    <Grid container spacing={3}>
                      {Object.entries(selectedForm.form_data.contactMethods)
                        .filter(([_, method]) => method.selected)
                        .map(([key, method]) => (
                          <Grid item xs={12} sm={6} key={key}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                              <Typography variant="subtitle1" color="primary" sx={{ textTransform: 'capitalize' }}>
                                {key}
                              </Typography>
                              {Object.entries(method)
                                .filter(([k]) => k !== 'selected')
                                .map(([k, v]) => (
                                  <Box key={k} sx={{ mt: 1 }}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                      {k}
                                    </Typography>
                                    <Typography>
                                      {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : (v || 'Not specified')}
                                    </Typography>
                                  </Box>
                                ))}
                            </Paper>
                          </Grid>
                        ))}
                    </Grid>
                  )}
                </Paper>

                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>Additional Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Money Lost</Typography>
                      <Typography>{selectedForm.form_data?.moneyLost ? 'Yes' : 'No'}</Typography>
                      {selectedForm.form_data?.moneyLost && (
                        <>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Amount Lost</Typography>
                          <Typography>${selectedForm.form_data?.amountLost || 'Not specified'}</Typography>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Date Occurred</Typography>
                      <Typography>{selectedForm.form_data?.dateOccurred || 'Not specified'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Scammer Name</Typography>
                      <Typography>{selectedForm.form_data?.scammerName || 'Not specified'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Company Name</Typography>
                      <Typography>{selectedForm.form_data?.companyName || 'Not specified'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Scammer Phone</Typography>
                      <Typography>{selectedForm.form_data?.scammerPhone || 'Not specified'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Scammer Email</Typography>
                      <Typography>{selectedForm.form_data?.scammerEmail || 'Not specified'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', p: 2 }}>
              <Button onClick={handleCloseDialog} variant="contained">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AbandonedFormsAdmin; 