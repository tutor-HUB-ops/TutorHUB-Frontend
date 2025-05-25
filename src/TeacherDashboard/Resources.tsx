// Imports
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Resource {
  id: string;
  title: string;
  description: string;
  subject: string;
  link: string;
  uploadedBy: string;
  createdAt: string;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newResource, setNewResource] = React.useState({
    title: '',
    link: '',
    description: '',
    subject: ''
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [currentTeacherId, setCurrentTeacherId] = React.useState<string>('');

  // Fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/resources`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        setResources(data.resources || []);
        // Set the current teacher's ID from the response
        if (data.resources && data.resources.length > 0) {
          setCurrentTeacherId(data.resources[0].uploadedBy);
        }
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to fetch resources',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching resources',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add resource
  const handleAddResource = async () => {
    try {
      if (!newResource.title || !newResource.link) {
        setSnackbar({
          open: true,
          message: 'Title and link are required',
          severity: 'error'
        });
        return;
      }

      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/resources/add`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(newResource)
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Resource added successfully',
          severity: 'success'
        });
        setNewResource({ title: '', link: '', description: '', subject: '' });
        setOpenDialog(false);
        fetchResources();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to add resource',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding resource',
        severity: 'error'
      });
    }
  };

  // Delete resource
  const handleDeleteResource = async (resourceId: string) => {
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Resource deleted successfully',
          severity: 'success'
        });
        fetchResources();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to delete resource',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting resource',
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

  // Fetch resources on component mount
  React.useEffect(() => {
    fetchResources();
  }, []);

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '100vw', mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
        <BookmarkIcon fontSize="large" sx={{ mr: 1 }} />
        Learning Resources
      </Typography>

      {/* Add Resource Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Resource
        </Button>
      </Box>

      {/* Resource Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Resource</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newResource.title}
            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Link"
            fullWidth
            value={newResource.link}
            onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            fullWidth
            value={newResource.description}
            onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Subject"
            fullWidth
            value={newResource.subject}
            onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddResource}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Search and Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4, justifyContent: 'center', alignItems: 'center' }}>
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
            sx: { borderRadius: 2, backgroundColor: 'background.paper' }
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
            <Skeleton key={index} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          ))
        ) : filteredResources.length > 0 ? (
          filteredResources.map(resource => (
            <Card
              key={resource.id}
              sx={{
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
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
                      <Chip label={resource.subject} size="small" color="primary" variant="outlined" />
                    </Stack>
                  </CardActionArea>
                  {resource.uploadedBy === currentTeacherId && (
                    <IconButton
                      onClick={() => handleDeleteResource(resource.id)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 6, color: 'text.secondary', fontStyle: 'italic' }}>
            No resources found matching your criteria. Try adjusting your search or filters.
          </Typography>
        )}
      </Stack>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Resources;