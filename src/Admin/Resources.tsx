import * as React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  IconButton,
  Stack,
  Skeleton,
  InputAdornment,
  MenuItem,
  Chip,
  Button,
  CardActions,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MySwal = withReactContent(Swal);

// Create green theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#81c784',
      contrastText: '#000000'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderLeft: '4px solid #2e7d32'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px'
        }
      }
    }
  }
});

interface Resource {
  _id: string;
  title: string;
  link: string;
  description: string;
  subject: string;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Fetch resources on component mount
  React.useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('JAA_access_token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${VITE_API_BASE_URL}/admin/resources`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }

      const data = await response.json();
      setResources(data.Resources || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch resources',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2e7d32',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('JAA_access_token='))
          ?.split('=')[1];

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${VITE_API_BASE_URL}/admin/resources/${resourceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete resource');
        }

        setResources(resources.filter(resource => resource._id !== resourceId));
        setSnackbar({
          open: true,
          message: 'Resource deleted successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete resource',
        severity: 'error'
      });
    }
  };

  // Derive unique subjects for filter dropdown
  const uniqueSubjects = [...new Set(resources.map(r => r.subject))];

  // Filter resources based on search term and selected filters
  const filteredResources = resources.filter(resource => {
    const searchMatch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());

    const subjectMatch = selectedSubject ? resource.subject === selectedSubject : true;

    return searchMatch && subjectMatch;
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        p: 3, 
        maxWidth: 1200, 
        mx: 'auto',
        background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8f5e9 100%)',
        width: '100%',
        minHeight: '100vh'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mb: 3, 
          color: 'primary.dark',
          display: 'flex',
          alignItems: 'center',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          <BookmarkIcon fontSize="large" sx={{ 
            mr: 1,
            color: 'primary.main',
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            borderRadius: '50%',
            p: 1
          }} />
          Learning Resources
        </Typography>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ 
          mb: 4, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'white',
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 2, 
                backgroundColor: 'background.paper',
                '&:focus-within': {
                  borderColor: 'primary.main'
                }
              }
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 180 } }}
            size="medium"
          >
            <MenuItem value="">All Subjects</MenuItem>
            {uniqueSubjects.map(subject => (
              <MenuItem key={subject} value={subject}>{subject}</MenuItem>
            ))}
          </TextField>
        </Stack>

        {/* Resource Cards */}
        <Stack spacing={3}>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton 
                key={index} 
                variant="rectangular" 
                height={120} 
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: 'rgba(46, 125, 50, 0.1)'
                }} 
              />
            ))
          ) : filteredResources.length > 0 ? (
            filteredResources.map(resource => (
              <Card
                key={resource._id}
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 16px rgba(46, 125, 50, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <CardActionArea
                      component="a"
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ flex: 1 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: 'text.primary'
                        }}
                      >
                        {resource.title}
                        <OpenInNewIcon fontSize="small" color="action" />
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {resource.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip 
                          label={resource.subject} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                          sx={{
                            borderColor: 'primary.light',
                            color: 'primary.dark'
                          }}
                        />
                      </Stack>
                    </CardActionArea>
                    <IconButton 
                      aria-label="delete"
                      onClick={() => handleDeleteResource(resource._id)}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.08)'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6, 
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="body1" sx={{ 
                color: 'text.secondary', 
                fontStyle: 'italic',
                mb: 2
              }}>
                No resources found matching your criteria.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('');
                }}
              >
                Reset Filters
              </Button>
            </Box>
          )}
        </Stack>

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

export default Resources;