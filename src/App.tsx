import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import RecordsPage from './pages/RecordsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ChatbotPage from './pages/ChatbotPage';
import {
  AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const navLinks = [
  { to: '/', label: 'Auth' },
  { to: '/profile', label: 'Profile' },
  { to: '/records', label: 'Health Records' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/chatbot', label: 'AI Chatbot' },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {navLinks.map(link => (
          <ListItemButton key={link.to} component={Link} to={link.to} selected={location.pathname === link.to}>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Healthcare App
        </Typography>
        {isMobile ? (
          <>
            <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              {drawer}
            </Drawer>
          </>
        ) : (
          navLinks.map(link => (
            <Button
              key={link.to}
              component={Link}
              to={link.to}
              color={location.pathname === link.to ? 'secondary' : 'inherit'}
              sx={{ color: '#fff', mx: 1 }}
            >
              {link.label}
            </Button>
          ))
        )}
      </Toolbar>
    </AppBar>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ minHeight: '80vh', py: 4 }}>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
};

export default App;
