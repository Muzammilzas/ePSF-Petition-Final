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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  People as PeopleIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Devices as DevicesIcon,
} from '@mui/icons-material';

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
  }>;
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    topLocations: [],
    deviceStats: [],
    hourlyStats: [],
    recentVisitors: [],
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch total visitors
      const { data: visitorsData, error: visitorsError } = await supabase
        .from('website_analytics')
        .select('*');

      if (visitorsError) throw visitorsError;

      // Process the data
      const totalVisitors = visitorsData.length;
      const uniqueVisitors = new Set(visitorsData.map(v => v.ip_address)).size;

      // Get top locations
      const locationCounts = visitorsData.reduce((acc: any, curr) => {
        acc[curr.location] = (acc[curr.location] || 0) + 1;
        return acc;
      }, {});

      const topLocations = Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

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
        const hour = new Date(curr.visited_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      const hourlyStats = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: hourlyCounts[i] || 0,
      }));

      // Get recent visitors
      const recentVisitors = visitorsData
        .sort((a, b) => new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime())
        .slice(0, 10);

      setAnalyticsData({
        totalVisitors,
        uniqueVisitors,
        topLocations,
        deviceStats,
        hourlyStats,
        recentVisitors,
      });
    } catch (error: any) {
      setError(error.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
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
          
          <Typography variant="h4" component="h1" gutterBottom>
            Website Analytics
          </Typography>
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
                <Typography variant="h4">{analyticsData.totalVisitors}</Typography>
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
                <Typography variant="h4">{analyticsData.uniqueVisitors}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ color: '#01BD9B', mr: 1 }} />
                  <Typography variant="h6">Top Location</Typography>
                </Box>
                <Typography variant="h4">
                  {analyticsData.topLocations[0]?.location || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DevicesIcon sx={{ color: '#E0AC3F', mr: 1 }} />
                  <Typography variant="h6">Top Device</Typography>
                </Box>
                <Typography variant="h4">
                  {analyticsData.deviceStats[0]?.device || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top Locations */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Top Visitor Locations
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell align="right">Visitors</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analyticsData.topLocations.map((location, index) => (
                <TableRow key={index}>
                  <TableCell>{location.location}</TableCell>
                  <TableCell align="right">{location.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Device Statistics */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Device Statistics
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device Type</TableCell>
                <TableCell align="right">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analyticsData.deviceStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell>{stat.device}</TableCell>
                  <TableCell align="right">{stat.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Recent Visitors */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Visitors
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>IP Address</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Visited At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analyticsData.recentVisitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell>{visitor.ip_address}</TableCell>
                  <TableCell>{visitor.location}</TableCell>
                  <TableCell>{visitor.device}</TableCell>
                  <TableCell>
                    {new Date(visitor.visited_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Analytics; 