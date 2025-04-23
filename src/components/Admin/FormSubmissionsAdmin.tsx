import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import { supabase } from '../../services/supabase';
import { Visibility, GetApp } from '@mui/icons-material';
import { saveAs } from 'file-saver';

interface FormSubmission {
  id: string;
  form_type: string;
  full_name: string;
  email: string;
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
  created_at: string;
}

const FormSubmissionsAdmin: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSubmission(null);
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

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Form Type',
      'Full Name',
      'Email',
      'Newsletter Consent',
      'Created At',
      'Browser',
      'Device Type',
      'Screen Resolution',
      'Timezone',
      'Language',
      'City',
      'Region',
      'Country',
      'IP Address'
    ];

    const rows = submissions.map(submission => [
      submission.id,
      submission.form_type.replace(/_/g, ' ').toUpperCase(),
      submission.full_name,
      submission.email,
      submission.newsletter_consent ? 'Yes' : 'No',
      formatDate(submission.created_at),
      submission.meta_details.device.browser,
      submission.meta_details.device.device_type,
      submission.meta_details.device.screen_resolution,
      submission.meta_details.device.timezone,
      submission.meta_details.device.language,
      submission.meta_details.location.city,
      submission.meta_details.location.region,
      submission.meta_details.location.country,
      submission.meta_details.location.ip_address
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `form_submissions_${new Date().toISOString()}.csv`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Form Submissions
        </Typography>
        <Button
          variant="contained"
          startIcon={<GetApp />}
          onClick={exportToCSV}
        >
          Export to CSV
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Form Type</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Newsletter Consent</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    {submission.form_type.replace(/_/g, ' ').toUpperCase()}
                  </TableCell>
                  <TableCell>{submission.full_name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>
                    {submission.newsletter_consent ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell>{formatDate(submission.created_at)}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => handleViewDetails(submission)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={submissions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Submission Details</DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <Typography>
                <strong>Name:</strong> {selectedSubmission.full_name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedSubmission.email}
              </Typography>
              <Typography>
                <strong>Newsletter Consent:</strong>{' '}
                {selectedSubmission.newsletter_consent ? 'Yes' : 'No'}
              </Typography>
              <Typography>
                <strong>Submitted At:</strong> {formatDate(selectedSubmission.created_at)}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                Device Information
              </Typography>
              <Typography>
                <strong>Browser:</strong> {selectedSubmission.meta_details.device.browser}
              </Typography>
              <Typography>
                <strong>Device Type:</strong> {selectedSubmission.meta_details.device.device_type}
              </Typography>
              <Typography>
                <strong>Screen Resolution:</strong>{' '}
                {selectedSubmission.meta_details.device.screen_resolution}
              </Typography>
              <Typography>
                <strong>Timezone:</strong> {selectedSubmission.meta_details.device.timezone}
              </Typography>
              <Typography>
                <strong>Language:</strong> {selectedSubmission.meta_details.device.language}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                Location Information
              </Typography>
              <Typography>
                <strong>City:</strong> {selectedSubmission.meta_details.location.city}
              </Typography>
              <Typography>
                <strong>Region:</strong> {selectedSubmission.meta_details.location.region}
              </Typography>
              <Typography>
                <strong>Country:</strong> {selectedSubmission.meta_details.location.country}
              </Typography>
              <Typography>
                <strong>IP Address:</strong> {selectedSubmission.meta_details.location.ip_address}
              </Typography>
              {selectedSubmission.meta_details.location.latitude && (
                <Typography>
                  <strong>Coordinates:</strong>{' '}
                  {selectedSubmission.meta_details.location.latitude},{' '}
                  {selectedSubmission.meta_details.location.longitude}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormSubmissionsAdmin; 