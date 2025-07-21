import React, { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import RecordsPage from './pages/RecordsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ChatbotPage from './pages/ChatbotPage';
import api, { getCurrentUser, logout as apiLogout } from './api';
import {
  AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Drawer, List, ListItemText, useTheme, useMediaQuery, ListItemButton, Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Auth Context
const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

const navLinks = [
  { to: '/', label: 'Auth', auth: false },
  { to: '/profile', label: 'Profile', auth: true },
  { to: '/records', label: 'Health Records', auth: true },
  { to: '/appointments', label: 'Appointments', auth: true },
  { to: '/chatbot', label: 'AI Chatbot', auth: true },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, profile } = useAuth();

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {navLinks.filter(link => (user ? link.auth : !link.auth)).map(link => (
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
        {user && profile && (
          <Avatar src={profile.avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} />
        )}
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
          navLinks.filter(link => (user ? link.auth : !link.auth)).map(link => (
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

// Auth Provider
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(getCurrentUser());
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoading(true);
          const res = await api.get('/profile/me');
          setProfile(res.data);
        } catch {
          setProfile(null);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const login = () => {
    setUser(getCurrentUser());
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (data: any) => {
    const res = await api.put('/profile/me', data);
    setProfile(res.data);
  };

  const uploadProfileImage = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setProfile((prev: any) => ({ ...prev, avatarUrl: res.data.avatarUrl }));
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, updateProfile, uploadProfileImage }}>
      {children}
    </AuthContext.Provider>
  );
};

// Route protection
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box sx={{ minHeight: '80vh', py: 4 }}>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePageWrapper />
                  </PrivateRoute>
                }
              />
              <Route
                path="/records"
                element={
                  <PrivateRoute>
                    <RecordsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <PrivateRoute>
                    <AppointmentsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <PrivateRoute>
                    <ChatbotPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Box>
        </Container>
      </Router>
    </AuthProvider>
  );
};

// ProfilePage wrapper to inject context props
const ProfilePageWrapper = () => {
  const { profile, logout, updateProfile, uploadProfileImage, loading } = useAuth();
  if (!profile) return <div>Loading...</div>;
  return (
    <ProfilePage
      profile={profile}
      onLogout={logout}
      onUpdate={updateProfile}
      onUploadImage={uploadProfileImage}
      loading={loading}
    />
  );
};

export default App;
