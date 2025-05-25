// Signup.jsx
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as LinkR, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Logo from '../Landing/media/logo.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MySwal = withReactContent(Swal);

function Copyright(props) {
  return (
  <Typography variant="body2" color="text.secondary" align="center" {...props}>
    {'Copyright © '}
    <Link color="inherit">TutorHub</Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);
}

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

  const CustomBox = styled(Box)(({ theme }) => ({
    width: '60%',
    margin: '1rem auto',
    display: 'flex',
    padding: '0rem 3rem',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    borderRadius: '2rem',
    [theme.breakpoints.down('md')]: {
      width: '100vw',
      margin: 0,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      margin: 0,
      padding: 0,
    },
  }));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(3),
    '& .MuiToggleButton-root': {
    flex: 1,
        padding: theme.spacing(1.5),
        border: `1px solid ${theme.palette.primary.main}`,
        '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            },
        },
    },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Signup = () => {
    const navigate = useNavigate();
    const [isTeacher, setIsTeacher] = useState(false);
    const [teacherStep, setTeacherStep] = useState(1);
    const [studentData, setStudentData] = useState({ name: '', email: '', password: '' });
    const [teacherData, setTeacherData] = useState({
        name: '',
        email: '',
        password: '',
        subjects: [''],
        availability: [{ date: '', startTime: '', endTime: '' }],
        hourlyRate: '',
    });
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});

    // Get tomorrow's date in YYYY-MM-DD format
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateStudentForm = () => {
        const newErrors = {};
        if (!studentData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!studentData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(studentData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!studentData.password) {
            newErrors.password = 'Password is required';
        } else if (studentData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateTimeRange = (startTime, endTime) => {
        if (!startTime || !endTime) return false;
        return startTime < endTime;
    };

    const validateDate = (date) => {
        if (!date) return false;
        const selectedDate = new Date(date);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return selectedDate >= tomorrow;
    };

    const validateTeacherForm = () => {
        const newErrors = {};
        if (!teacherData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!teacherData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(teacherData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!teacherData.password) {
            newErrors.password = 'Password is required';
        } else if (teacherData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!teacherData.hourlyRate) {
            newErrors.hourlyRate = 'Hourly rate is required';
        }
        if (teacherData.subjects.some(subject => !subject.trim())) {
            newErrors.subjects = 'All subjects must be filled';
        }

        // Validate availability
        const availabilityErrors = [];
        teacherData.availability.forEach((avail, index) => {
            const slotErrors = {};
            if (!avail.date) {
                slotErrors.date = 'Date is required';
            } else if (!validateDate(avail.date)) {
                slotErrors.date = 'Date must be tomorrow or later';
            }
            if (!avail.startTime) {
                slotErrors.startTime = 'Start time is required';
            }
            if (!avail.endTime) {
                slotErrors.endTime = 'End time is required';
            }
            if (avail.startTime && avail.endTime && !validateTimeRange(avail.startTime, avail.endTime)) {
                slotErrors.timeRange = 'End time must be after start time';
            }
            if (Object.keys(slotErrors).length > 0) {
                availabilityErrors[index] = slotErrors;
            }
        });

        if (availabilityErrors.length > 0) {
            newErrors.availability = availabilityErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStudentChange = (e) => {
        setStudentData({ ...studentData, [e.target.name]: e.target.value });
    };

    const handleTeacherChange = (e) => {
        setTeacherData({ ...teacherData, [e.target.name]: e.target.value });
    };

    const addSubject = () => {
        setTeacherData({ ...teacherData, subjects: [...teacherData.subjects, ''] });
    };

    const handleSubjectChange = (index, e) => {
        const newSubjects = [...teacherData.subjects];
        newSubjects[index] = e.target.value;
        setTeacherData({ ...teacherData, subjects: newSubjects });
    };

    const deleteSubject = (index) => {
        const newSubjects = teacherData.subjects.filter((_, i) => i !== index);
        setTeacherData({ ...teacherData, subjects: newSubjects });
    };

    const addAvailability = () => {
        setTeacherData({ ...teacherData, availability: [...teacherData.availability, { date: '', startTime: '', endTime: '' }] });
    };

    const handleAvailabilityChange = (index, e) => {
        const newAvailability = [...teacherData.availability];
        newAvailability[index] = { ...newAvailability[index], [e.target.name]: e.target.value };
        
        // Clear time range error when either time is changed
        if (e.target.name === 'startTime' || e.target.name === 'endTime') {
            if (errors.availability && errors.availability[index]) {
                delete errors.availability[index].timeRange;
            }
        }
        
        setTeacherData({ ...teacherData, availability: newAvailability });
    };

    const deleteAvailability = (index) => {
        const newAvailability = teacherData.availability.filter((_, i) => i !== index);
        setTeacherData({ ...teacherData, availability: newAvailability });
    };

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
    };

    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        if (!validateStudentForm()) {
            return;
        }
        try {
            const response = await fetch(`${VITE_API_BASE_URL}/auth/register/student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                await MySwal.fire({
                    title: 'Success!',
                    text: 'Registration successful!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate('/login');
            } else {
                throw new Error(data.msg || 'Registration failed');
            }
        } catch (error) {
            MySwal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const handleTeacherStep1 = async (e) => {
        e.preventDefault();
        if (!validateTeacherForm()) {
            return;
        }
        try {
            const response = await fetch(`${VITE_API_BASE_URL}/auth/register/teacher/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teacherData),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {

                setTeacherData(prev => ({
                ...prev,
                id: data.teacher._id  
                }));
                setTeacherStep(2);
                await MySwal.fire({
                    title: 'Step 1 Complete!',
                    text: 'Please upload your documents.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                throw new Error(data.msg || 'Registration failed');
            }
        } catch (error) {
            MySwal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const handleTeacherStep2 = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            MySwal.fire({
                title: 'Error!',
                text: 'Please upload at least one document',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('attachments', file);
        });
        formData.append('userId', teacherData.id);

        try {
            const response = await fetch(`${VITE_API_BASE_URL}/teacher/attachments/add`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                await MySwal.fire({
                    title: 'Success!',
                    text: 'Registration completed successfully!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate('/login');
            } else {
                throw new Error(data.msg || 'File upload failed');
            }
        } catch (error) {
            MySwal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

  return (
    <CustomBox>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
                    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <LinkR to='/'>
                            <img src={Logo} alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
              </LinkR>
                        <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                            Sign Up
              </Typography>
                        <Box component="form" onSubmit={isTeacher ? (teacherStep === 1 ? handleTeacherStep1 : handleTeacherStep2) : handleStudentSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                            {teacherStep === 1 && (
                                <StyledToggleButtonGroup
                                    value={isTeacher ? 'teacher' : 'student'}
                exclusive
                                    onChange={(e, value) => setIsTeacher(value === 'teacher')}
                                    aria-label="user type"
                                >
                                    <ToggleButton value="student" aria-label="student">
                                        <PersonIcon sx={{ mr: 1 }} /> Student
                                    </ToggleButton>
                                    <ToggleButton value="teacher" aria-label="teacher">
                                        <SchoolIcon sx={{ mr: 1 }} /> Teacher
                                    </ToggleButton>
                                </StyledToggleButtonGroup>
                            )}

                            {isTeacher ? (
                                teacherStep === 1 ? (
                                    <>
                    <TextField
                                            margin="normal"
                      required
                      fullWidth
                                            name="name"
                                            label="Name"
                                            onChange={handleTeacherChange}
                                            autoComplete="name"
                                            error={!!errors.name}
                                            helperText={errors.name}
                                        />
                    <TextField
                                            margin="normal"
                      required
                      fullWidth
                      name="email"
                                            label="Email"
                                            onChange={handleTeacherChange}
                      autoComplete="email"
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                    <TextField
                                            margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                                            onChange={handleTeacherChange}
                      autoComplete="new-password"
                      error={!!errors.password}
                      helperText={errors.password}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="hourlyRate"
                                            label="Hourly Rate"
                                            type="number"
                                            onChange={handleTeacherChange}
                                            error={!!errors.hourlyRate}
                                            helperText={errors.hourlyRate}
                                        />

                                        <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'primary.main' }}>Subjects</Typography>
                                        {teacherData.subjects.map((subject, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TextField
                            fullWidth
                                                    placeholder={`Subject ${index + 1}`}
                                                    value={subject}
                                                    onChange={(e) => handleSubjectChange(index, e)}
                                                    sx={{ mr: 1 }}
                          />
                          <IconButton
                                                    onClick={() => deleteSubject(index)}
                                                    color="error"
                                                    sx={{ mr: 1 }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                {index === teacherData.subjects.length - 1 && (
                                                    <IconButton 
                                                        onClick={addSubject}
                            color="primary"
                          >
                            <AddIcon />
                          </IconButton>
                                                )}
                        </Box>
                                        ))}

                                        <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'primary.main' }}>Availability</Typography>
                                        {teacherData.availability.map((avail, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                                                <TextField
                                                    type="date"
                                                    name="date"
                                                    onChange={(e) => handleAvailabilityChange(index, e)}
                                                    required
                                                    sx={{ flex: 1 }}
                                                    error={!!(errors.availability && errors.availability[index]?.date)}
                                                    helperText={errors.availability && errors.availability[index]?.date}
                                                    inputProps={{
                                                        min: getTomorrowDate()
                                                    }}
                                                />
                                                <TextField
                                                    type="time"
                                                    name="startTime"
                                                    onChange={(e) => handleAvailabilityChange(index, e)}
                                                    required
                                                    sx={{ flex: 1 }}
                                                    error={!!(errors.availability && (errors.availability[index]?.startTime || errors.availability[index]?.timeRange))}
                                                    helperText={errors.availability && (errors.availability[index]?.startTime || errors.availability[index]?.timeRange)}
                                                />
                                                <TextField
                                                    type="time"
                                                    name="endTime"
                                                    onChange={(e) => handleAvailabilityChange(index, e)}
                                                    required
                                                    sx={{ flex: 1 }}
                                                    error={!!(errors.availability && (errors.availability[index]?.endTime || errors.availability[index]?.timeRange))}
                                                    helperText={errors.availability && (errors.availability[index]?.endTime || errors.availability[index]?.timeRange)}
                                                />
                                                <IconButton
                                                    onClick={() => deleteAvailability(index)}
                                                    color="error"
                                                    sx={{ mr: 1 }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                {index === teacherData.availability.length - 1 && (
                                                    <IconButton 
                                                        onClick={addAvailability}
                                                        color="primary"
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                                            Upload Your Documents
                                        </Typography>
                                        <Button
                                            component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            fullWidth
                                            sx={{ mb: 2 }}
                                        >
                                            Upload Files
                                            <VisuallyHiddenInput type="file" multiple onChange={handleFileChange} />
                                        </Button>
                                        {files.length > 0 && (
                                            <Typography variant="body2" sx={{ mb: 2 }}>
                                                {files.length} file(s) selected
                                            </Typography>
                                        )}
                                    </>
                                )
                            ) : (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="name"
                                        label="Name"
                                        onChange={handleStudentChange}
                                        autoComplete="name"
                                        error={!!errors.name}
                                        helperText={errors.name}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="email"
                                        label="Email"
                                        onChange={handleStudentChange}
                                        autoComplete="email"
                                        error={!!errors.email}
                                        helperText={errors.email}
                                    />
                        <TextField
                                        margin="normal"
                          required
                          fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        onChange={handleStudentChange}
                                        autoComplete="new-password"
                                        error={!!errors.password}
                                        helperText={errors.password}
                                    />
                    </>
                  )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {isTeacher && teacherStep === 2 ? 'Complete Registration' : 'Register'}
                </Button>
                            <Grid container sx={{ marginTop: '1rem', justifyContent: 'center' }}>
                  <Grid item>
                    <LinkR to='/login'>
                                        <Link variant="body2">
                                            {"Already have an account? Log In"}
                      </Link>
                    </LinkR>
                  </Grid>
                </Grid>
              </Box>
            </Box>
                    <Copyright sx={{ mt: 10, mb: 2 }} />
          </Container>
        </ThemeProvider>
    </CustomBox>
  );
};

export default Signup;