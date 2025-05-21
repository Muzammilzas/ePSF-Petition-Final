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
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SyncIcon from '@mui/icons-material/Sync';
import { supabase } from '../../services/supabase';
import { formatCurrency } from '../../utils/formatters';

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
  scam_report_id: number;
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
  scam_report_id: number;
  contact_type: string;
  contact_value: string;
}

interface MetaDetails {
  id: number;
  scam_report_id: number;
  ip_address: string;
  user_agent: string;
  browser: string;
  os: string;
  device_type: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scam-reports-tabpanel-${index}`}
      aria-labelledby={`scam-reports-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
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
    metaDetails?: MetaDetails;
  } | null>(null);
  const [filters, setFilters] = useState({
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    scamType: '',
    moneyLost: '',
    willingToSpeak: '',
    searchTerm: '',
  });
  const [tabValue, setTabValue] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

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
      if (filters.willingToSpeak !== '') {
        query = query.eq('speak_with_team', filters.willingToSpeak === 'true');
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
      const [scamTypesResponse, contactMethodsResponse, metaDetailsResponse] = await Promise.all([
        supabase
          .from('scam_types')
          .select('*')
          .eq('report_id', reportId),
        supabase
          .from('contact_methods')
          .select('*')
          .eq('report_id', reportId),
        supabase
          .from('scam_report_metadata')
          .select('*')
          .eq('report_id', reportId)
          .single()
      ]);

      if (scamTypesResponse.error) throw scamTypesResponse.error;
      if (contactMethodsResponse.error) throw contactMethodsResponse.error;

      setReportDetails({
        scamTypes: scamTypesResponse.data || [],
        contactMethods: contactMethodsResponse.data || [],
        metaDetails: metaDetailsResponse.error ? undefined : metaDetailsResponse.data
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const exportToCsv = () => {
    const csvData = reports.map(report => ({
      'Date': new Date(report.created_at).toLocaleString(),
      'Reporter Name': report.reporter_name,
      'Reporter Email': report.reporter_email,
      'City': report.reporter_city,
      'State': report.reporter_state,
      'Age Range': report.reporter_age_range || 'Not specified',
      'Willing to Speak': report.speak_with_team ? 'Yes' : 'No',
      'Share Anonymously': report.share_anonymously ? 'Yes' : 'No',
      'Money Lost': report.money_lost ? 'Yes' : 'No',
      'Amount Lost': report.amount_lost ? formatCurrency(report.amount_lost) : 'N/A',
      'Date Occurred': report.date_occurred,
      'Scammer Name': report.scammer_name,
      'Company Name': report.company_name,
      'Scammer Phone': report.scammer_phone,
      'Scammer Email': report.scammer_email,
      'Scammer Website': report.scammer_website,
      'Reported Elsewhere': report.reported_elsewhere ? 'Yes' : 'No',
      'Reported To': report.reported_to || 'N/A',
      'Want Updates': report.want_updates ? 'Yes' : 'No'
    }));

    // Create CSV header
    const headers = [
      'Date',
      'Reporter Name',
      'Reporter Email',
      'City',
      'State',
      'Age Range',
      'Willing to Speak',
      'Share Anonymously',
      'Money Lost',
      'Amount Lost',
      'Date Occurred',
      'Scammer Name',
      'Company Name',
      'Scammer Phone',
      'Scammer Email',
      'Scammer Website',
      'Reported Elsewhere',
      'Reported To',
      'Want Updates'
    ];

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => Object.values(row).map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `scam_reports_${new Date().toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDetailedReports = async () => {
    try {
      // Fetch all reports with their details
      const { data: allReports, error: reportsError } = await supabase
        .from('scam_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      const detailedReports = await Promise.all(allReports.map(async (report) => {
        const [scamTypesResponse, contactMethodsResponse] = await Promise.all([
          supabase
            .from('scam_types')
            .select('*')
            .eq('report_id', report.id),
          supabase
            .from('contact_methods')
            .select('*')
            .eq('report_id', report.id),
        ]);

        return {
          ...report,
          scamTypes: scamTypesResponse.data || [],
          contactMethods: contactMethodsResponse.data || []
        };
      }));

      // Create a formatted JSON string
      const jsonContent = JSON.stringify(detailedReports, null, 2);

      // Download the file
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `detailed_scam_reports_${new Date().toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-')}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting detailed reports:', error);
      alert('Failed to export detailed reports. Please try again.');
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncError(null);
      setSyncSuccess(false);

      console.log('Starting sync process...');
      const response = await fetch('/.netlify/functions/sync-scam-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Sync response status:', response.status);
      console.log('Sync response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server: ' + responseText);
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to sync scam reports');
      }

      setSyncSuccess(true);
      await fetchReports(); // Refresh the list after successful sync
    } catch (error: any) {
      console.error('Error syncing scam reports:', error);
      setSyncError(error.message || 'Failed to sync scam reports');
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteAll = async () => {
    if (deleteConfirmText !== 'CONFIRM') {
      return;
    }

    try {
      // Delete all related records first due to foreign key constraints
      await supabase
        .from('contact_methods')
        .delete()
        .neq('id', '');

      await supabase
        .from('scam_types')
        .delete()
        .neq('id', '');

      await supabase
        .from('scam_report_metadata')
        .delete()
        .neq('id', '');

      const { error } = await supabase
        .from('scam_reports')
        .delete()
        .neq('id', '');

      if (error) throw error;

      setDeleteAllDialogOpen(false);
      setDeleteConfirmText('');
      await fetchReports(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting all reports:', error);
      alert('Failed to delete all reports. Please try again.');
    }
  };

  const getContactInfo = (report: ScamReport) => {
    return report.reporter_email || 'Not provided';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Scam Reports Administration
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SyncIcon />}
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? 'Syncing...' : 'Sync to Sheet'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={exportToCsv}
            >
              Export CSV
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={exportDetailedReports}
            >
              Export Detailed Reports
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

        {syncError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {syncError}
          </Alert>
        )}

        {syncSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Successfully synced scam reports to Google Sheet
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="scam reports tabs">
            <Tab label="Completed Reports" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
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
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Willing to Speak</InputLabel>
                  <Select
                    value={filters.willingToSpeak}
                    label="Willing to Speak"
                    onChange={(e) => setFilters({ ...filters, willingToSpeak: e.target.value })}
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
                  <TableCell>Willing to speak</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{new Date(report.created_at).toLocaleDateString('en-US', {
                      timeZone: 'America/New_York',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}</TableCell>
                    <TableCell>{report.reporter_name || 'N/A'}</TableCell>
                    <TableCell>{`${report.reporter_city}, ${report.reporter_state}` || 'N/A'}</TableCell>
                    <TableCell>
                      {getContactInfo(report)}
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
                      <Chip
                        label={report.speak_with_team ? 'Yes' : 'No'}
                        color={report.speak_with_team ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
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
        </TabPanel>

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
                Report Details - {new Date(selectedReport.created_at).toLocaleDateString('en-US', {
                  timeZone: 'America/New_York',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Reporter Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Name</Typography>
                      <Typography>{selectedReport.reporter_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Email</Typography>
                      <Typography>{selectedReport.reporter_email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Location</Typography>
                      <Typography>{selectedReport.reporter_city}, {selectedReport.reporter_state}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Age Range</Typography>
                      <Typography>{selectedReport.reporter_age_range || 'N/A'}</Typography>
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
                      <Typography>{new Date(selectedReport.date_occurred).toLocaleDateString('en-US', {
                        timeZone: 'America/New_York',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}</Typography>
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
                        Type of Scams
                      </Typography>
                      <Grid container spacing={2}>
                        {/* Fake Resale Offers */}
                        <Grid item xs={12}>
                          <Paper sx={{ p: 2, mb: 1, bgcolor: 'background.default' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                              Fake Resale Offers
                            </Typography>
                            {reportDetails?.scamTypes.some(type => type.scam_type === 'fake_resale') ? (
                              reportDetails.scamTypes
                                .filter(type => type.scam_type === 'fake_resale')
                                .map((type, index) => (
                                  <Box key={index} sx={{ ml: 2 }}>
                                    <Typography>
                                      <strong>Claimed Sale Amount:</strong> {type.claimed_sale_amount ? formatCurrency(type.claimed_sale_amount) : 'Not provided'}
                                    </Typography>
                                  </Box>
                                ))
                            ) : (
                              <Typography color="text.secondary" sx={{ ml: 2 }}>Not selected</Typography>
                            )}
                          </Paper>
                        </Grid>

                        {/* Upfront Fees for Help */}
                        <Grid item xs={12}>
                          <Paper sx={{ p: 2, mb: 1, bgcolor: 'background.default' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                              Upfront Fees for Help
                            </Typography>
                            {reportDetails?.scamTypes.some(type => type.scam_type === 'upfront_fees') ? (
                              reportDetails.scamTypes
                                .filter(type => type.scam_type === 'upfront_fees')
                                .map((type, index) => (
                                  <Box key={index} sx={{ ml: 2 }}>
                                    <Typography>
                                      <strong>Amount:</strong> {type.amount ? formatCurrency(type.amount) : 'Not provided'}
                                    </Typography>
                                    <Typography>
                                      <strong>Promised Services:</strong> {type.promised_services || 'Not provided'}
                                    </Typography>
                                  </Box>
                                ))
                            ) : (
                              <Typography color="text.secondary" sx={{ ml: 2 }}>Not selected</Typography>
                            )}
                          </Paper>
                        </Grid>

                        {/* High-Pressure Sales */}
                        <Grid item xs={12}>
                          <Paper sx={{ p: 2, mb: 1, bgcolor: 'background.default' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                              High-Pressure Sales
                            </Typography>
                            {reportDetails?.scamTypes.some(type => type.scam_type === 'high_pressure_sales') ? (
                              reportDetails.scamTypes
                                .filter(type => type.scam_type === 'high_pressure_sales')
                                .map((type, index) => (
                                  <Box key={index} sx={{ ml: 2 }}>
                                    <Typography>
                                      <strong>Tactics Used:</strong> {type.tactics || 'Not provided'}
                                    </Typography>
                                    <Typography>
                                      <strong>Limited Time or Threat Used:</strong> {type.limited_time_or_threat ? 'Yes' : 'No'}
                                    </Typography>
                                  </Box>
                                ))
                            ) : (
                              <Typography color="text.secondary" sx={{ ml: 2 }}>Not selected</Typography>
                            )}
                          </Paper>
                        </Grid>

                        {/* Refund or Exit Scam */}
                        <Grid item xs={12}>
                          <Paper sx={{ p: 2, mb: 1, bgcolor: 'background.default' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                              Refund or Exit Scam
                            </Typography>
                            {reportDetails?.scamTypes.some(type => type.scam_type === 'refund_exit') ? (
                              reportDetails.scamTypes
                                .filter(type => type.scam_type === 'refund_exit')
                                .map((type, index) => (
                                  <Box key={index} sx={{ ml: 2 }}>
                                    <Typography>
                                      <strong>Promised Refund:</strong> {type.promised_refund || 'Not provided'}
                                    </Typography>
                                    <Typography>
                                      <strong>Contacted After Other Company:</strong> {type.contacted_after_other_company ? 'Yes' : 'No'}
                                    </Typography>
                                  </Box>
                                ))
                            ) : (
                              <Typography color="text.secondary" sx={{ ml: 2 }}>Not selected</Typography>
                            )}
                          </Paper>
                        </Grid>

                        {/* Other */}
                        <Grid item xs={12}>
                          <Paper sx={{ p: 2, mb: 1, bgcolor: 'background.default' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                              Other
                            </Typography>
                            {reportDetails?.scamTypes.some(type => type.scam_type === 'other') ? (
                              reportDetails.scamTypes
                                .filter(type => type.scam_type === 'other')
                                .map((type, index) => (
                                  <Box key={index} sx={{ ml: 2 }}>
                                    <Typography>
                                      <strong>Description:</strong> {type.description || 'Not provided'}
                                    </Typography>
                                  </Box>
                                ))
                            ) : (
                              <Typography color="text.secondary" sx={{ ml: 2 }}>Not selected</Typography>
                            )}
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Contact Methods
                      </Typography>
                      {reportDetails.contactMethods.map((contact, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 1 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {contact.contact_type.replace(/_/g, ' ').toUpperCase()}
                          </Typography>
                          {contact.contact_value && (
                            <Typography>
                              {contact.contact_type === 'email' ? `Email Address: ${contact.contact_value}` : `Phone Number: ${contact.contact_value}`}
                            </Typography>
                          )}
                        </Paper>
                      ))}
                    </Box>

                    {reportDetails?.metaDetails && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Meta Details
                        </Typography>
                        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">Browser</Typography>
                              <Typography>{reportDetails.metaDetails.browser || 'Not available'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">Device Type</Typography>
                              <Typography>{reportDetails.metaDetails.device_type || 'Not available'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">Screen Resolution</Typography>
                              <Typography>{reportDetails.metaDetails.screen_resolution || 'Not available'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="subtitle2">User Agent</Typography>
                              <Typography sx={{ wordBreak: 'break-word' }}>{reportDetails.metaDetails.user_agent || 'Not available'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">Timezone</Typography>
                              <Typography>{reportDetails.metaDetails.timezone || 'Not available'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">Language</Typography>
                              <Typography>{reportDetails.metaDetails.language || 'Not available'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">IP Address</Typography>
                              <Typography>{reportDetails.metaDetails.ip_address || 'Not available'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">Location</Typography>
                              <Typography>
                                {reportDetails.metaDetails.city && reportDetails.metaDetails.region && reportDetails.metaDetails.country
                                  ? `${reportDetails.metaDetails.city}, ${reportDetails.metaDetails.region}, ${reportDetails.metaDetails.country}`
                                  : 'Not available'}
                              </Typography>
                            </Grid>
                            {reportDetails.metaDetails.latitude && reportDetails.metaDetails.longitude && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2">Coordinates</Typography>
                                <Typography>{`${reportDetails.metaDetails.latitude}, ${reportDetails.metaDetails.longitude}`}</Typography>
                              </Grid>
                            )}
                          </Grid>
                        </Paper>
                      </Box>
                    )}
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Delete All Confirmation Dialog */}
        <Dialog
          open={deleteAllDialogOpen}
          onClose={() => {
            setDeleteAllDialogOpen(false);
            setDeleteConfirmText('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontSize: '2rem', fontWeight: 'bold', pt: 3, px: 3 }}>
            Delete All Submissions
          </DialogTitle>
          <DialogContent sx={{ pb: 4 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              This will permanently delete all submissions. This action cannot be undone.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              Type "CONFIRM" to delete all submissions
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type CONFIRM"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff'
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              variant="contained"
              onClick={handleDeleteAll}
              disabled={deleteConfirmText !== 'CONFIRM'}
              sx={{
                bgcolor: '#ff4444',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#cc0000',
                },
                '&.Mui-disabled': {
                  bgcolor: '#ccc',
                  color: '#666'
                }
              }}
            >
              DELETE
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default ScamReportsAdmin; 