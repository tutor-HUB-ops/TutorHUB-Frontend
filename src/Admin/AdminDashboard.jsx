// import necessary libraries and components
import Logo from '../Landing/media/logo.png'
import * as React from 'react';
import { useState, useContext } from 'react';
import { UserContext } from "../UserContext";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Resources from './Resources';
import Teachers from './Teachers';
import Students from './Students';
import { useNavigate } from "react-router-dom";
import PendingTutors from './PendingTutor';
import Dashboard from './Analytics';

const Copyright = (props) => (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit">TutorHub</Link>{' '}
        {new Date().getFullYear()}{'.'}
    </Typography>
);

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const defaultTheme = createTheme();
const CustomBox1 = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '1rem',
    flexWrap: 'wrap',
    textAlign: 'center',
    justifyContent: "center",
    alignItems: 'center',
    // marginBottom: theme.spacing(1),
    [theme.breakpoints.down("md")]: {

    },

}));
const CustomBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    gap: '1rem',
    flexWrap: 'wrap',
    textAlign: 'center',
    // marginBottom: theme.spacing(1),
    [theme.breakpoints.down("md")]: {

    },

}));
const AdminDashboard = () => {
    const [open, setOpen] = useState(true);
    const [show, setShow] = useState('dashboard');
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const { name } = useContext(UserContext);

    const toggleDrawer = () => setOpen(!open);

    const handleLogout = async () => {
        try {
            const result = await MySwal.fire({
                title: 'Are you sure you want to logout?',
                text: "You will need to login again to access the dashboard.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4CAF50',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, logout!'
            });

            if (result.isConfirmed) {
                // Clear the token from cookies
                document.cookie = 'JAA_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                
                // Clear any other auth-related data from localStorage if needed
                localStorage.removeItem('userData');
                
                // Show success message
                await MySwal.fire({
                    title: 'Logged Out!',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    confirmButtonColor: '#4CAF50'
                });

                // Redirect to home page
                navigate('/');
            }
        } catch (error) {
            console.error('Logout error:', error);
            await MySwal.fire({
                title: 'Error!',
                text: 'An error occurred during logout. Please try again.',
                icon: 'error',
                confirmButtonColor: '#4CAF50'
            });
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{ pr: '24px', backgroundColor: "#4CAF50" }}>
                        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            {`Welcome, ${name}`}
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="primary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: [1], mx: 2 }}>
                        <img src={Logo} alt="" style={{ minWidth: '40%' }} />
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <ListItemButton onClick={() => setShow("dashboard")}>
                            <ListItemIcon><DashboardIcon /></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                        <ListItemButton onClick={() => setShow("pending")}>
                            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
                            <ListItemText primary="Pending" />
                        </ListItemButton>
                        <ListItemButton onClick={() => setShow("teachers")}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Teachers" />
                        </ListItemButton>
                        <ListItemButton onClick={() => setShow("students")}>
                            <ListItemIcon><BarChartIcon /></ListItemIcon>
                            <ListItemText primary="Students" />
                        </ListItemButton>
                        <ListItemButton onClick={() => setShow("resources")}>
                            <ListItemIcon><BarChartIcon /></ListItemIcon>
                            <ListItemText primary="Resources" />
                        </ListItemButton>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Log out" />
                        </ListItemButton>
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        {show === 'resources' && (
                            <CustomBox1>
                                <Resources />
                            </CustomBox1>
                        )}
                        {show === 'teachers' && (
                            <CustomBox>
                                <Teachers /> {/* Directly render the Teachers component */}
                            </CustomBox>
                        )}
                        {show === 'students' && (
                            <CustomBox1>
                                <Students />
                            </CustomBox1>
                        )}
                        {show === 'pending' && (
                            <CustomBox1>
                                <PendingTutors />
                            </CustomBox1>
                        )}
                        {show === 'dashboard' && (
                            <CustomBox1>
                                <Dashboard />
                            </CustomBox1>
                        )}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default AdminDashboard;