import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../services/appApi';
import { useSelector } from 'react-redux';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NoteRounded from '@mui/icons-material/NoteRounded';
import UploadFile from '@mui/icons-material/UploadFile';
import ForumRounded from '@mui/icons-material/ForumRounded';
import LoginRounded from '@mui/icons-material/LoginRounded';
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import ExitToAppRounded from '@mui/icons-material/ExitToAppRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
// import Star from '@mui/icons-material/Star';

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

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
  backgroundColor: '#1976d2', // Change the background color to red
  color: 'white', // Change the text color to white
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const user = useSelector((state) => state?.user?.data);
  const userToken = useSelector((state) => state?.user?.token);
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const [logoutFunction] = useLogoutMutation();

  const handleOpenEvent = () => setOpen(true);
  const handleCloseEvent = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            onClick={handleOpenEvent}
            color='inherit'
            aria-label='open drawer'
            edge='start'
            sx={{
              marginRight: 5,
              ...(open && {
                display: 'none',
                transition: '3000ms ease-in-out',
              }),
            }}>
            <MenuIcon />
          </IconButton>
          <Typography
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
            variant='h6'
            noWrap
            component='div'>
            DIU SMART FORUM
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer onMouseLeave={handleCloseEvent} variant='permanent' open={open}>
        <DrawerHeader>
          <IconButton onClick={handleCloseEvent}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => navigate('/')}
              className='customized_blue font_verdana'
              onMouseEnter={handleOpenEvent}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <ForumRounded className='customized_blue font_verdana' />
              </ListItemIcon>
              <ListItemText primary={'Forum'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {user && (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate('/upload/note')}
                className='customized_blue font_verdana'
                onMouseEnter={handleOpenEvent}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <UploadFile className='customized_blue font_verdana' />
                </ListItemIcon>
                <ListItemText primary={'Upload Note'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => navigate('/view-notes')}
              className='customized_blue font_verdana'
              onMouseEnter={handleOpenEvent}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <NoteRounded className='customized_blue font_verdana' />
              </ListItemIcon>
              <ListItemText primary={'All Notes'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* {user && (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate('/starred')}
                className='customized_blue font_verdana'
                onMouseEnter={handleOpenEvent}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <Star className='customized_blue font_verdana' />
                </ListItemIcon>
                <ListItemText primary={'Starred'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          )} */}

          {/* <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => navigate('/discuss')}
              className='customized_blue font_verdana'
              onMouseEnter={handleOpenEvent}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <NearMeRounded className='customized_blue font_verdana' />
              </ListItemIcon>
              <ListItemText primary={'Discuss'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem> */}

          {!user && (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate('/login')}
                className='customized_blue font_verdana'
                onMouseEnter={handleOpenEvent}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <LoginRounded className='customized_blue font_verdana' />
                </ListItemIcon>
                <ListItemText primary={'Login'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          )}
          {!user && (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate('/signup')}
                className='customized_blue font_verdana'
                onMouseEnter={handleOpenEvent}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <PersonAddRounded className='customized_blue font_verdana' />
                </ListItemIcon>
                <ListItemText primary={'Signup'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          )}
          {user && (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate(`/account?user=${user.name}`)}
                className='customized_blue font_verdana'
                onMouseEnter={handleOpenEvent}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <PersonRoundedIcon className='customized_blue font_verdana' />
                </ListItemIcon>
                <ListItemText primary={'Profile'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          )}

          {user && (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => {
                  logoutFunction({
                    headers: {
                      authorization: 'Bearer ' + userToken,
                    },
                  });
                  navigate('/login');
                }}
                className='customized_blue font_verdana'
                onMouseEnter={handleOpenEvent}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <ExitToAppRounded className='customized_blue font_verdana' />
                </ListItemIcon>
                <ListItemText primary={'Logout'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </Box>
  );
}
