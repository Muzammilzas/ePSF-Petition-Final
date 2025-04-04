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
  TablePagination,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Link,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../../services/supabase';

interface ScamReport {
  id: number;
  created_at: string;
  reporter_name: string;
  reporter_email: string;
  reporter_phone: string;
  reporter_city: string;
  reporter_state: string;
  reporter_age_range?: string;
  speak_with_team: boolean;
  share_anonymously: boolean;
  preferred_contact: 'Email' | 'Phone' | 'Either' | 'None';
  money_lost: boolean;
  amount_lost: number | null;
  date_occurred: string;
  scammer_name: string;
  company_name: string;
  scammer_phone: string;
  scammer_email: string;
  scammer_website: string;
  reported_elsewhere: boolean;
  reported_to: string | null;
  want_updates: boolean;
  evidence_file_url: string | null;
}

interface ScamTypeDetail {
  id: number;
  report_id: number;
  scam_type: string;
  claimed_sale_amount?: number;
  amount?: number;
  promised_services?: string;
  tactics?: string;
  limited_time_or_threat?: boolean;
  promised_refund?: string;
  contacted_after_other_company?: boolean;
  description?: string;
}

interface ContactMethod {
  id: number;
  report_id: number;
  method: string;
  phone_number?: string;
  email_address?: string;
  evidence_file_url?: string;
  social_media_platform?: string;
  social_media_profile?: string;
  location?: string;
  event_type?: string;
}

const ScamReportsAdmin: React.FC = () => {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
  const [reportDetails, setReportDetails] = useState<{
    scamTypes: ScamTypeDetail[];
    contactMethods: ContactMethod[];
  } | null>(null);
  const [filters, setFilters] = useState({
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    scamType: '',
    moneyLost: '',
    searchTerm: '',
  });

  const fetchReports = async () => {
    try {
      let query = supabase
        .from('scam_reports')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.dateFrom) {
        query = query.gte('date_occurred', filters.dateFrom.toISOString().split('T')[0]);
      }
      if (filters.dateTo) {
        query = query.lte('date_occurred', filters.dateTo.toISOString().split('T')[0]);
      }
      if (filters.moneyLost !== '') {
        query = query.eq('money_lost', filters.moneyLost === 'true');
      }
      if (filters.searchTerm) {
        query = query.or(`scammer_name.ilike.%${filters.searchTerm}%,company_name.ilike.%${filters.searchTerm}%`);
      }

      // Add pagination
      query = query
        .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1)
        .order('created_at', { ascending: false });

      const { data, count, error } = await query;

      if (error) throw error;
      setReports(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchReportDetails = async (reportId: number) => {
    try {
      const [scamTypesResponse, contactMethodsResponse] = await Promise.all([
        supabase
          .from('scam_type_details')
          .select('*')
          .eq('report_id', reportId),
        supabase
          .from('contact_methods')
          .select('*')
          .eq('report_id', reportId),
      ]);

      if (scamTypesResponse.error) throw scamTypesResponse.error;
      if (contactMethodsResponse.error) throw contactMethodsResponse.error;

      setReportDetails({
        scamTypes: scamTypesResponse.data || [],
        contactMethods: contactMethodsResponse.data || [],
      });
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  };

  const handleDelete = async (reportId: number | string) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete related records first due to foreign key constraints
      await supabase
        .from('contact_methods')
        .delete()
        .eq('report_id', reportId);

      await supabase
        .from('scam_types')
        .delete()
        .eq('report_id', reportId);

      const { error } = await supabase
        .from('scam_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      // Refresh the reports list
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report. Please try again.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (report: ScamReport) => {
    setSelectedReport(report);
    fetchReportDetails(report.id);
  };

  const handleCloseDialog = () => {
    setSelectedReport(null);
    setReportDetails(null);
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Scam Reports Administration
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Date From"
                value={filters.dateFrom}
                onChange={(date) => setFilters({ ...filters, dateFrom: date })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Date To"
                value={filters.dateTo}
                onChange={(date) => setFilters({ ...filters, dateTo: date })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Money Lost</InputLabel>
                <Select
                  value={filters.moneyLost}
                  label="Money Lost"
                  onChange={(e) => setFilters({ ...filters, moneyLost: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search by name or company"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Reports Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date Reported</TableCell>
                <TableCell>Reporter Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Scammer Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Money Lost</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{report.reporter_name || 'N/A'}</TableCell>
                  <TableCell>{`${report.reporter_city}, ${report.reporter_state}` || 'N/A'}</TableCell>
                  <TableCell>
                    {report.preferred_contact === 'Email' ? report.reporter_email :
                     report.preferred_contact === 'Phone' ? report.reporter_phone :
                     report.preferred_contact === 'Either' ? `${report.reporter_email}, ${report.reporter_phone}` :
                     'No Contact Preferred'}
                  </TableCell>
                  <TableCell>{report.scammer_name || 'N/A'}</TableCell>
                  <TableCell>{report.company_name || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={report.money_lost ? 'Yes' : 'No'}
                      color={report.money_lost ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(report.amount_lost)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(report)}
                        title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(report.id)}
                        title="Delete Report"
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
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Details Dialog */}
        <Dialog
          open={!!selectedReport}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedReport && (
            <>
              <DialogTitle>
                Report Details - {new Date(selectedReport.created_at).toLocaleDateString()}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Reporter Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Name</Typography>
                      <Typography>{selectedReport.reporter_name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Location</Typography>
                      <Typography>{`${selectedReport.reporter_city}, ${selectedReport.reporter_state}` || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Email</Typography>
                      <Typography>{selectedReport.reporter_email || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Phone</Typography>
                      <Typography>{selectedReport.reporter_phone || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Age Range</Typography>
                      <Typography>{selectedReport.reporter_age_range || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Preferred Contact</Typography>
                      <Typography>{selectedReport.preferred_contact}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Willing to Speak with Team</Typography>
                      <Chip
                        label={selectedReport.speak_with_team ? 'Yes' : 'No'}
                        color={selectedReport.speak_with_team ? 'success' : 'default'}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Share Story Anonymously</Typography>
                      <Chip
                        label={selectedReport.share_anonymously ? 'Yes' : 'No'}
                        color={selectedReport.share_anonymously ? 'success' : 'default'}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Scammer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Name</Typography>
                      <Typography>{selectedReport.scammer_name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Company</Typography>
                      <Typography>{selectedReport.company_name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Phone</Typography>
                      <Typography>{selectedReport.scammer_phone || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Email</Typography>
                      <Typography>{selectedReport.scammer_email || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Website</Typography>
                      <Typography>{selectedReport.scammer_website || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Incident Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Date Occurred</Typography>
                      <Typography>{new Date(selectedReport.date_occurred).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Money Lost</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={selectedReport.money_lost ? 'Yes' : 'No'}
                          color={selectedReport.money_lost ? 'error' : 'success'}
                          size="small"
                        />
                        {selectedReport.money_lost && selectedReport.amount_lost && (
                          <Typography>({formatCurrency(selectedReport.amount_lost)})</Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Reported Elsewhere</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={selectedReport.reported_elsewhere ? 'Yes' : 'No'}
                          color={selectedReport.reported_elsewhere ? 'info' : 'default'}
                          size="small"
                        />
                        {selectedReport.reported_elsewhere && selectedReport.reported_to && (
                          <Typography>({selectedReport.reported_to})</Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Wants Updates</Typography>
                      <Chip
                        label={selectedReport.want_updates ? 'Yes' : 'No'}
                        color={selectedReport.want_updates ? 'info' : 'default'}
                        size="small"
                      />
                    </Grid>
                    {selectedReport.evidence_file_url && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">Evidence</Typography>
                        <Link href={selectedReport.evidence_file_url} target="_blank" rel="noopener noreferrer">
                          View Evidence
                        </Link>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {reportDetails && (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Scam Types
                      </Typography>
                      {reportDetails.scamTypes.map((type, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 1 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {type.scam_type.replace(/_/g, ' ').toUpperCase()}
                          </Typography>
                          {type.claimed_sale_amount && (
                            <Typography>
                              Claimed Sale Amount: {formatCurrency(type.claimed_sale_amount)}
                            </Typography>
                          )}
                          {type.amount && (
                            <Typography>
                              Amount: {formatCurrency(type.amount)}
                            </Typography>
                          )}
                          {type.promised_services && (
                            <Typography>
                              Promised Services: {type.promised_services}
                            </Typography>
                          )}
                          {type.tactics && (
                            <Typography>
                              Tactics Used: {type.tactics}
                            </Typography>
                          )}
                          {type.promised_refund && (
                            <Typography>
                              Promised Refund: {type.promised_refund}
                            </Typography>
                          )}
                          {type.description && (
                            <Typography>
                              Description: {type.description}
                            </Typography>
                          )}
                        </Paper>
                      ))}
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Contact Methods
                      </Typography>
                      {reportDetails.contactMethods.map((contact, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 1 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {contact.method.replace(/_/g, ' ').toUpperCase()}
                          </Typography>
                          {contact.phone_number && (
                            <Typography>
                              Phone Number: {contact.phone_number}
                            </Typography>
                          )}
                          {contact.email_address && (
                            <Typography>
                              Email Address: {contact.email_address}
                            </Typography>
                          )}
                          {contact.social_media_platform && (
                            <Typography>
                              Platform: {contact.social_media_platform}
                            </Typography>
                          )}
                          {contact.social_media_profile && (
                            <Typography>
                              Profile: {contact.social_media_profile}
                            </Typography>
                          )}
                          {contact.location && (
                            <Typography>
                              Location: {contact.location}
                            </Typography>
                          )}
                          {contact.event_type && (
                            <Typography>
                              Event Type: {contact.event_type}
                            </Typography>
                          )}
                          {contact.evidence_file_url && (
                            <Link href={contact.evidence_file_url} target="_blank" rel="noopener noreferrer">
                              View Evidence
                            </Link>
                          )}
                        </Paper>
                      ))}
                    </Box>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default ScamReportsAdmin; 