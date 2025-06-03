import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { getUser, saveToken } from '../auth';

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const logout = () => {
    saveToken('');
    navigate('/login');
  };

  const navLinks = [
  user && { label: 'Dashboard', to: '/dashboard' }, // Show Dashboard to all logged-in users
  { label: 'Tickets', to: '/tickets' },
  user?.role === 'TicketMaker' && { label: 'Create Ticket', to: '/create' },
  user?.role === 'Admin' && { label: 'Admin', to: '/admin' }
].filter(Boolean);


  const authLinks = user
    ? [{ label: 'Logout', action: logout }]
    : [
        { label: 'Login', to: '/login' },
        { label: 'Register', to: '/register' }
      ];

  const drawer = (
    <Box onClick={() => setMobileOpen(false)} sx={{ width: 250 }}>
      <List>
        {navLinks.map((item) => (
          <ListItem button component={RouterLink} to={item.to} key={item.label}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {authLinks.map((item) =>
          item.to ? (
            <ListItem button component={RouterLink} to={item.to} key={item.label}>
              <ListItemText primary={item.label} />
            </ListItem>
          ) : (
            <ListItem button onClick={item.action} key={item.label}>
              <ListItemText primary={item.label} />
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Ticket Manager
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navLinks.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={RouterLink}
                  to={item.to}
                >
                  {item.label}
                </Button>
              ))}
              {authLinks.map((item) =>
                item.to ? (
                  <Button
                    key={item.label}
                    color="inherit"
                    component={RouterLink}
                    to={item.to}
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    key={item.label}
                    color="inherit"
                    onClick={item.action}
                    startIcon={<LogoutIcon />}
                  >
                    {item.label}
                  </Button>
                )
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </>
  );
}