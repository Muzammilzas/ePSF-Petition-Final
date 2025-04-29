import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  People as PeopleIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Devices as DevicesIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Language as LanguageIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { SelectChangeEvent } from '@mui/material/Select';

interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: number;
  topLocations: Array<{ location: string; count: number }>;
  deviceStats: Array<{ device: string; count: number }>;
  hourlyStats: Array<{ hour: number; count: number }>;
  recentVisitors: Array<{
    id: string;
    ip_address: string;
    location: string;
    device: string;
    visited_at: string;
    city?: string;
    country?: string;
    region?: string;
  }>;
  pageViews: Array<{ page: string; views: number }>;
  referrers: Array<{ source: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  timeOnSite: number;
  bounceRate: number;
  formSubmissions: Array<{
    form_id: string;
    form_name: string;
    count: number;
    last_submission: string;
  }>;
  previousPeriodData?: {
    totalVisitors: number;
    uniqueVisitors: number;
    timeOnSite: number;
    bounceRate: number;
    formSubmissions: number;
  };
}

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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
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

const COLORS = ['#01BD9B', '#E0AC3F', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Add utility function for EST time zone formatting
const formatInEST = (date: Date | string) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return new Date(date).toLocaleTimeString('en-US', options);
};

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState('7d'); // '1d', '7d', '30d', '90d', 'custom'
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    topLocations: [],
    deviceStats: [],
    hourlyStats: [],
    recentVisitors: [],
    pageViews: [],
    referrers: [],
    browsers: [],
    timeOnSite: 0,
    bounceRate: 0,
    formSubmissions: [],
    previousPeriodData: {
      totalVisitors: 0,
      uniqueVisitors: 0,
      timeOnSite: 0,
      bounceRate: 0,
      formSubmissions: 0
    }
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDateRangeChange = (event: SelectChangeEvent<string>) => {
    setDateRange(event.target.value);
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range in EST
      const now = new Date();
      const estNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      let startDate = new Date(estNow);
      
      switch (dateRange) {
        case '1d':
          startDate.setDate(estNow.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(estNow.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(estNow.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(estNow.getDate() - 90);
          break;
        default:
          startDate.setDate(estNow.getDate() - 7); // Default to 7 days
      }
      
      // Convert EST dates to UTC for database query
      const startDateUTC = new Date(startDate.toLocaleString('en-US', { timeZone: 'UTC' }));
      const endDateUTC = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      
      // Format dates for Supabase query
      const startDateStr = startDateUTC.toISOString();
      const endDateStr = endDateUTC.toISOString();
      
      // Fetch visitors data
      const { data: visitorsData, error: visitorsError } = await supabase
        .from('website_analytics')
        .select('*')
        .gte('visited_at', startDateStr)
        .lte('visited_at', endDateStr);

      if (visitorsError) throw visitorsError;

      // Process the data
      const totalVisitors = visitorsData.length;
      const uniqueVisitors = new Set(visitorsData.map(v => v.ip_address)).size;

      // Fetch form submissions
      let formData: any[] = [];
      try {
        const { data: formSubmissions, error: formError } = await supabase
          .from('form_submissions')
          .select('*')
          .gte('submitted_at', startDateStr)
          .lte('submitted_at', endDateStr);

        if (formError) {
          console.warn('Error fetching form submissions:', formError);
        } else {
          formData = formSubmissions || [];
        }
      } catch (error) {
        console.warn('Error accessing form submissions:', error);
      }

      // Process form submissions
      const formSubmissions = formData.reduce((acc: any, curr) => {
        if (!acc[curr.form_id]) {
          acc[curr.form_id] = {
            form_id: curr.form_id,
            form_name: curr.form_name || 'Unknown Form',
            count: 0,
            last_submission: curr.submitted_at
          };
        }
        acc[curr.form_id].count++;
        if (new Date(curr.submitted_at) > new Date(acc[curr.form_id].last_submission)) {
          acc[curr.form_id].last_submission = curr.submitted_at;
        }
        return acc;
      }, {});

      // Process location data with better fallback
      const locationCounts = visitorsData.reduce((acc: any, curr) => {
        let location = 'Unknown Location';
        
        if (curr.city && curr.country) {
          location = `${curr.city}, ${curr.country}`;
        } else if (curr.region && curr.country) {
          location = `${curr.region}, ${curr.country}`;
        } else if (curr.location) {
          location = curr.location;
        }
        
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {});

      const topLocations = Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Get device statistics
      const deviceCounts = visitorsData.reduce((acc: any, curr) => {
        acc[curr.device] = (acc[curr.device] || 0) + 1;
        return acc;
      }, {});

      const deviceStats = Object.entries(deviceCounts)
        .map(([device, count]) => ({ device, count: count as number }))
        .sort((a, b) => b.count - a.count);

      // Get hourly statistics
      const hourlyCounts = visitorsData.reduce((acc: any, curr) => {
        const date = new Date(curr.visited_at);
        const estDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const hour = estDate.getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      const hourlyStats = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: hourlyCounts[i] || 0,
      }));

      // Get recent visitors
      const recentVisitors = visitorsData
        .sort((a, b) => {
          const dateA = new Date(a.visited_at);
          const dateB = new Date(b.visited_at);
          const estDateA = new Date(dateA.toLocaleString('en-US', { timeZone: 'America/New_York' }));
          const estDateB = new Date(dateB.toLocaleString('en-US', { timeZone: 'America/New_York' }));
          return estDateB.getTime() - estDateA.getTime();
        })
        .slice(0, 10);
      
      // Get page views
      const pageViewCounts = visitorsData.reduce((acc: any, curr) => {
        acc[curr.page_url] = (acc[curr.page_url] || 0) + 1;
        return acc;
      }, {});
      
      const pageViews = Object.entries(pageViewCounts)
        .map(([page, views]) => ({ 
          page: page || 'Unknown', 
          views: views as number 
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
      
      // Get referrers
      const referrerCounts = visitorsData.reduce((acc: any, curr) => {
        const referrer = curr.referrer || 'Direct';
        acc[referrer] = (acc[referrer] || 0) + 1;
        return acc;
      }, {});
      
      const referrers = Object.entries(referrerCounts)
        .map(([source, count]) => ({ 
          source: source === 'Direct' ? 'Direct' : new URL(source).hostname, 
          count: count as number 
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      // Get browser statistics
      const browserCounts = visitorsData.reduce((acc: any, curr) => {
        const userAgent = curr.user_agent || '';
        let browser = 'Other';
        
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) browser = 'Internet Explorer';
        
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      }, {});
      
      const browsers = Object.entries(browserCounts)
        .map(([browser, count]) => ({ browser, count: count as number }))
        .sort((a, b) => b.count - a.count);
      
      // Calculate time on site (average)
      const timeOnSite = visitorsData.reduce((acc, curr) => {
        return acc + (curr.session_duration || 0);
      }, 0) / (visitorsData.length || 1);
      
      // Calculate bounce rate (visitors who only viewed one page)
      const singlePageVisitors = visitorsData.filter(v => {
        const sameIpVisitors = visitorsData.filter(other => other.ip_address === v.ip_address);
        return sameIpVisitors.length === 1;
      }).length;
      
      const bounceRate = (singlePageVisitors / (visitorsData.length || 1)) * 100;
      
      // Calculate previous period metrics
      const previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - (now.getDate() - startDate.getDate()));
      const previousEndDate = new Date(startDate);
      
      const { data: previousVisitorsData } = await supabase
        .from('website_analytics')
        .select('*')
        .gte('visited_at', previousStartDate.toISOString())
        .lte('visited_at', previousEndDate.toISOString());

      const previousTimeOnSite = previousVisitorsData ? 
        previousVisitorsData.reduce((acc, curr) => acc + (curr.session_duration || 0), 0) / (previousVisitorsData.length || 1) : 0;
      
      const previousSinglePageVisitors = previousVisitorsData ? 
        previousVisitorsData.filter(v => {
          const sameIpVisitors = previousVisitorsData.filter(other => other.ip_address === v.ip_address);
          return sameIpVisitors.length === 1;
        }).length : 0;
      
      const previousBounceRate = previousVisitorsData ? 
        (previousSinglePageVisitors / (previousVisitorsData.length || 1)) * 100 : 0;

      setAnalyticsData({
        totalVisitors,
        uniqueVisitors,
        topLocations,
        deviceStats,
        hourlyStats,
        recentVisitors: recentVisitors.map(visitor => {
          let location = 'Unknown Location';
          
          if (visitor.city && visitor.country) {
            location = `${visitor.city}, ${visitor.country}`;
          } else if (visitor.region && visitor.country) {
            location = `${visitor.region}, ${visitor.country}`;
          } else if (visitor.location) {
            location = visitor.location;
          }
          
          return {
            ...visitor,
            location
          };
        }),
        pageViews,
        referrers,
        browsers,
        timeOnSite,
        bounceRate,
        formSubmissions: Object.values(formSubmissions),
        previousPeriodData: {
          totalVisitors: previousVisitorsData?.length || 0,
          uniqueVisitors: previousVisitorsData ? new Set(previousVisitorsData.map(v => v.ip_address)).size : 0,
          timeOnSite: previousTimeOnSite,
          bounceRate: previousBounceRate,
          formSubmissions: formData.length
        }
      });
    } catch (error: any) {
      setError(error.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
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
              Website Analytics
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="date-range-label">Date Range</InputLabel>
                <Select
                  labelId="date-range-label"
                  value={dateRange}
                  label="Date Range"
                  onChange={handleDateRangeChange}
                  startAdornment={<CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  <MenuItem value="1d">Last 24 hours</MenuItem>
                  <MenuItem value="7d">Last 7 days</MenuItem>
                  <MenuItem value="30d">Last 30 days</MenuItem>
                  <MenuItem value="90d">Last 90 days</MenuItem>
                </Select>
              </FormControl>
              
              <Tooltip title="Refresh data">
                <IconButton onClick={fetchAnalyticsData} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Typography variant="subtitle1" color="text.secondary">
            Monitor your website's performance and visitor insights
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon sx={{ color: '#01BD9B', mr: 1 }} />
                  <Typography variant="h6">Total Visitors</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4">{analyticsData.totalVisitors}</Typography>
                  {analyticsData.previousPeriodData && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      {calculateGrowth(analyticsData.totalVisitors, analyticsData.previousPeriodData.totalVisitors) > 0 ? (
                        <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ color: 'error.main', fontSize: '1rem' }} />
                      )}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: calculateGrowth(analyticsData.totalVisitors, analyticsData.previousPeriodData.totalVisitors) > 0 ? 'success.main' : 'error.main',
                          ml: 0.5
                        }}
                      >
                        {Math.abs(calculateGrowth(analyticsData.totalVisitors, analyticsData.previousPeriodData.totalVisitors)).toFixed(1)}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon sx={{ color: '#E0AC3F', mr: 1 }} />
                  <Typography variant="h6">Unique Visitors</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4">{analyticsData.uniqueVisitors}</Typography>
                  {analyticsData.previousPeriodData && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      {calculateGrowth(analyticsData.uniqueVisitors, analyticsData.previousPeriodData.uniqueVisitors) > 0 ? (
                        <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ color: 'error.main', fontSize: '1rem' }} />
                      )}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: calculateGrowth(analyticsData.uniqueVisitors, analyticsData.previousPeriodData.uniqueVisitors) > 0 ? 'success.main' : 'error.main',
                          ml: 0.5
                        }}
                      >
                        {Math.abs(calculateGrowth(analyticsData.uniqueVisitors, analyticsData.previousPeriodData.uniqueVisitors)).toFixed(1)}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SpeedIcon sx={{ color: '#01BD9B', mr: 1 }} />
                  <Typography variant="h6">Avg. Time on Site</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4">{formatTime(analyticsData.timeOnSite)}</Typography>
                  {analyticsData.previousPeriodData && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      {calculateGrowth(analyticsData.timeOnSite, analyticsData.previousPeriodData.timeOnSite) > 0 ? (
                        <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ color: 'error.main', fontSize: '1rem' }} />
                      )}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: calculateGrowth(analyticsData.timeOnSite, analyticsData.previousPeriodData.timeOnSite) > 0 ? 'success.main' : 'error.main',
                          ml: 0.5
                        }}
                      >
                        {Math.abs(calculateGrowth(analyticsData.timeOnSite, analyticsData.previousPeriodData.timeOnSite)).toFixed(1)}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <VisibilityIcon sx={{ color: '#E0AC3F', mr: 1 }} />
                  <Typography variant="h6">Bounce Rate</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4">{analyticsData.bounceRate.toFixed(1)}%</Typography>
                  {analyticsData.previousPeriodData && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      {calculateGrowth(analyticsData.bounceRate, analyticsData.previousPeriodData.bounceRate) < 0 ? (
                        <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ color: 'error.main', fontSize: '1rem' }} />
                      )}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: calculateGrowth(analyticsData.bounceRate, analyticsData.previousPeriodData.bounceRate) < 0 ? 'success.main' : 'error.main',
                          ml: 0.5
                        }}
                      >
                        {Math.abs(calculateGrowth(analyticsData.bounceRate, analyticsData.previousPeriodData.bounceRate)).toFixed(1)}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs for different analytics views */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab icon={<TimelineIcon />} label="Overview" />
            <Tab icon={<LanguageIcon />} label="Traffic Sources" />
            <Tab icon={<DevicesIcon />} label="Devices" />
            <Tab icon={<LocationIcon />} label="Locations" />
            <Tab icon={<TimeIcon />} label="Time" />
            <Tab icon={<DescriptionIcon />} label="Forms" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Visitors Over Time
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.hourlyStats}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#01BD9B" name="Visitors" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Pages
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Page</TableCell>
                        <TableCell align="right">Views</TableCell>
                        <TableCell align="right">% of Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.pageViews.map((page, index) => (
                        <TableRow key={index}>
                          <TableCell>{page.page}</TableCell>
                          <TableCell align="right">{page.views}</TableCell>
                          <TableCell align="right">
                            {((page.views / analyticsData.totalVisitors) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Traffic Sources
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.referrers}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="source"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.referrers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Visitors
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Location</TableCell>
                        <TableCell>Device</TableCell>
                        <TableCell>Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.recentVisitors.map((visitor) => (
                        <TableRow key={visitor.id}>
                          <TableCell>{visitor.location}</TableCell>
                          <TableCell>{visitor.device}</TableCell>
                          <TableCell>
                            {formatInEST(visitor.visited_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Traffic Sources Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Traffic Sources
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.referrers}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="source"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.referrers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Traffic Sources Details
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Source</TableCell>
                        <TableCell align="right">Visitors</TableCell>
                        <TableCell align="right">% of Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.referrers.map((source, index) => (
                        <TableRow key={index}>
                          <TableCell>{source.source}</TableCell>
                          <TableCell align="right">{source.count}</TableCell>
                          <TableCell align="right">
                            {((source.count / analyticsData.totalVisitors) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Devices Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Device Types
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.deviceStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="device"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.deviceStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Browsers
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.browsers}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="browser" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#01BD9B" name="Visitors" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Locations Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Locations
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.topLocations}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#E0AC3F" name="Visitors" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Location Details
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Location</TableCell>
                        <TableCell align="right">Visitors</TableCell>
                        <TableCell align="right">% of Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.topLocations.map((location, index) => (
                        <TableRow key={index}>
                          <TableCell>{location.location}</TableCell>
                          <TableCell align="right">{location.count}</TableCell>
                          <TableCell align="right">
                            {((location.count / analyticsData.totalVisitors) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Time Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Visitors by Hour
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.hourlyStats}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#01BD9B" name="Visitors" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Form Submissions Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Form Submissions
                </Typography>
                {analyticsData.formSubmissions.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Form Name</TableCell>
                          <TableCell align="right">Submissions</TableCell>
                          <TableCell>Last Submission</TableCell>
                          <TableCell align="right">% of Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analyticsData.formSubmissions.map((form) => (
                          <TableRow key={form.form_id}>
                            <TableCell>{form.form_name}</TableCell>
                            <TableCell align="right">{form.count}</TableCell>
                            <TableCell>{formatInEST(form.last_submission)}</TableCell>
                            <TableCell align="right">
                              {((form.count / analyticsData.formSubmissions.reduce((acc, curr) => acc + curr.count, 0)) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No form submissions found for the selected date range.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Analytics; 