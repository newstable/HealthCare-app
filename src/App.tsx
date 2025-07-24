import React, { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import RecordsPage from './pages/RecordsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ChatbotPage from './pages/ChatbotPage';
import api, { getCurrentUser, logout as apiLogout } from './api';
import {
  AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Drawer, List, ListItemText, useTheme, useMediaQuery, ListItemButton, Avatar, ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Custom MUI Theme with Healthcare Colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D8A', // Professional teal blue
      light: '#4A9BA8',
      dark: '#1B5A65',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6B6B', // Warm coral red
      light: '#FF8E8E',
      dark: '#E55555',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
    },
    success: {
      main: '#48BB78',
      light: '#68D391',
      dark: '#38A169',
    },
    warning: {
      main: '#ED8936',
      light: '#F6AD55',
      dark: '#DD6B20',
    },
    error: {
      main: '#F56565',
      light: '#FC8181',
      dark: '#E53E3E',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #2E7D8A 0%, #4A9BA8 100%)',
          boxShadow: '0 4px 20px rgba(46, 125, 138, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2E7D8A 0%, #4A9BA8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1B5A65 0%, #2E7D8A 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4A9BA8',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2E7D8A',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
          borderLeft: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 138, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(46, 125, 138, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(46, 125, 138, 0.16)',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

// Auth Context
const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

const navLinks = [
  { to: '/', label: 'Auth', auth: false },
  { to: '/about', label: 'About Us', auth: false },
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
        {user && (
          <ListItemButton component={Link} to="/profile" selected={location.pathname === '/profile'}>
            <ListItemText primary="Profile" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 70 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ffffff 0%, #E2E8F0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '-0.5px'
          }}
        >
          🏥 Healthcare App
        </Typography>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile ? (
              <>
                <IconButton 
                  color="inherit" 
                  edge="end" 
                  onClick={() => setDrawerOpen(true)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                  {drawer}
                </Drawer>
              </>
            ) : (
              <>
                {navLinks.filter(link => link.auth).map(link => (
                  <Button
                    key={link.to}
                    component={Link}
                    to={link.to}
                    color={location.pathname === link.to ? 'secondary' : 'inherit'}
                    sx={{ 
                      color: '#fff', 
                      mx: 1,
                      backgroundColor: location.pathname === link.to ? 'rgba(255,255,255,0.15)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </>
            )}
            {profile && (
              <Avatar 
                src={profile.profile?.avatarUrl ? `http://localhost:5000${profile.profile.avatarUrl}` : undefined}
                sx={{ 
                  width: 45, 
                  height: 45, 
                  cursor: 'pointer',
                  border: '3px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    border: '3px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                  }
                }}
                component={Link}
                to="/profile"
              />
            )}
          </Box>
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navigation />
          <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
            <Box sx={{ minHeight: 'calc(100vh - 120px)', py: 2 }}>
              <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/about" element={<AboutPage />} />
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
    </ThemeProvider>
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
