import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Stack, 
  Divider,
  Skeleton,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  People as PeopleIcon, 
  School as TeacherIcon, 
  Person as StudentIcon,
  Block as BannedIcon,
  Verified as VerifiedIcon,
  TrendingUp as GrowthIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create green theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
});

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  activeTeachers: number;
  totalBookings: number;
  bannedUsers: number;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary' 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  color?: 'primary' | 'error' | 'success' | 'warning';
}) => {
  const colorMap = {
    primary: '#2e7d32',
    error: '#d32f2f',
    success: '#388e3c',
    warning: '#f57c00'
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{
          backgroundColor: `${colorMap[color]}20`,
          color: colorMap[color],
          p: 2,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ color: colorMap[color] }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('JAA_access_token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${VITE_API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to fetch statistics');
      setSnackbar({
        open: true,
        message: 'Failed to fetch statistics',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowthRate = () => {
    if (!stats) return 0;
    const totalUsers = stats.totalStudents + stats.totalTeachers;
    // This is a placeholder calculation. In a real app, you'd want to compare with previous period
    return ((totalUsers / 1000) * 100).toFixed(1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        p: 4, 
        background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8f5e9 100%)',
        minHeight: '100vh'
      }}>
        <Typography variant="h4" sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          color: 'primary.dark',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          Admin Dashboard
        </Typography>

        {/* Main Stats Grid */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
            ) : (
              <StatCard 
                title="Total Users" 
                value={stats ? stats.totalStudents + stats.totalTeachers : 0} 
                icon={<PeopleIcon fontSize="large" />}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
            ) : (
              <StatCard 
                title="Total Teachers" 
                value={stats?.totalTeachers || 0} 
                icon={<TeacherIcon fontSize="large" />}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
            ) : (
              <StatCard 
                title="Active Teachers" 
                value={stats?.activeTeachers || 0} 
                icon={<VerifiedIcon fontSize="large" />}
                color="success"
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
            ) : (
              <StatCard 
                title="Banned Users" 
                value={stats?.bannedUsers || 0} 
                icon={<BannedIcon fontSize="large" />}
                color="error"
              />
            )}
          </Grid>
        </Grid>

        {/* Secondary Stats */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Student Statistics
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {loading ? (
                <Stack direction="row" spacing={4}>
                  <Skeleton variant="rectangular" width={120} height={80} />
                  <Skeleton variant="rectangular" width={120} height={80} />
                </Stack>
              ) : (
                <Stack direction="row" spacing={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      {stats?.totalStudents || 0}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total Students
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <GrowthIcon color="success" fontSize="large" />
                    <Box>
                      <Typography variant="h5" fontWeight="bold" color="success.main">
                        +{calculateGrowthRate()}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Growth Rate
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {loading ? (
                <Stack spacing={2}>
                  {[1, 2, 3, 4].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={24} />
                  ))}
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main'
                    }} />
                    <Typography>{stats?.totalBookings || 0} total bookings</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main'
                    }} />
                    <Typography>{stats?.activeTeachers || 0} active teachers</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main'
                    }} />
                    <Typography>{stats?.bannedUsers || 0} banned users</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main'
                    }} />
                    <Typography>{stats?.totalStudents || 0} total students</Typography>
                  </Box>
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;