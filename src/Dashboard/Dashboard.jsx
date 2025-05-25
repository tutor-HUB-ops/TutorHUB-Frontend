// import * as React from 'react';
import Logo from '../Landing/media/logo.png'
// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { useState, useContext, useEffect } from 'react'
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
import Teachers from './Teachers';
import Booked from './Booked';
import Profile from './Profile';
import Resources from './Resources';

import { useNavigate } from "react-router-dom";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        TutorHub
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();


const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const [, setTeachers] = useState([]);
  const [, setBooked] = useState([]);


  const [show, setShow] = useState('profile');

  const navigate = useNavigate()
  const MySwal = withReactContent(Swal)

  async function handleLogout() {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure you want to logout?',
        text: "You will need to login again to access your account.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        // Clear all auth-related data
        localStorage.removeItem('token');
        document.cookie = 'JAA_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        MySwal.fire({
          title: 'Logged out successfully!',
          text: 'Redirecting to home page...',
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 2000,
          didOpen: () => {
            MySwal.showLoading()
          },
        }).then(() => {
          navigate('/');
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      MySwal.fire({
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { name } = useContext(UserContext)

  async function fetchTeachers() {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('JAA_access_token='))
        .split('=')[1];
      // console.log(token)
      await fetch("https://ruby-fragile-angelfish.cyclic.app/student/getteachers", {
        headers: {
          "content-type": "application/json",
          authorization: token
        }
      })
        .then((res) => res.json())
        .then((res) => {
          setTeachers(res.teachers)
          // console.log(res.teachers)
        })
        .catch((err) => {
          console.log(err)
        })

    } catch (error) {
      console.log(error)
    }
  }

  async function fetchBooking() {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('JAA_access_token='))
        .split('=')[1];
      // console.log(token)
      await fetch("https://ruby-fragile-angelfish.cyclic.app/student/mybookings", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: token
        }
      })
        .then((res) => res.json())
        .then((res) => {
          // console.log(res)
          setBooked(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    fetchTeachers()
    fetchBooking()
  }, [show])

  //   useEffect(() => {
  //     console.log("showing "+show)
  //   }, [show])


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


  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
              backgroundColor: "#4CAF50",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {`Welcome, ${name}`}
            </Typography>
            {/* notification sinor new mehon yalebet */}
            <IconButton color="inherit">
              <Badge badgeContent={4} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>

        </AppBar>


        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: [1],
              mx: 2
            }}
          >

            {/* logo */}
            {/* <Box sx={{outline: '1px solid'}}> */}
            <img src={Logo} alt="" style={{ minWidth: '40%' }} />
            {/* </Box> */}

            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {/* <MainListItems setShow={setShow}/> */}

            {/* <React.Fragment> */}
            <ListItemButton onClick={() => setShow("profile")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton onClick={() => setShow("bookings")}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="My Classes" />
            </ListItemButton>

            <ListItemButton onClick={() => setShow("teachers")}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Teachers" />
            </ListItemButton>

            <ListItemButton onClick={() => setShow("resources")}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Resources" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItemButton>
            {/* </React.Fragment> */}

            <Divider sx={{ my: 1 }} />
            {/* {secondaryListItems} */}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {show === 'profile' && (
              <Box sx={{ width: '100%' }}>
                <Profile />
              </Box>
            )}

            {show === 'bookings' && (
              <CustomBox1>
                <Booked />
              </CustomBox1>
            )}

            {show === 'teachers' && (
              <CustomBox>
                <Teachers /> {/* Directly render the Teachers component */}
              </CustomBox>
            )}
            {show === 'resources' && (
              <CustomBox1>
                <Resources />
              </CustomBox1>
            )}

            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>

      </Box>
      {/* <TeacherCard
        availability="Available"
        email="teacher@example.com"
        hourlyRate={50}
        name="John Doe"
        qualification="PhD in Mathematics"
        subjects={["Math", "Physics", "Chemistry"]}
        _id="12345"
      /> */}
    </ThemeProvider>
  );
}



export default Dashboard