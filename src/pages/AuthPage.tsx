import React, { useState } from 'react';
import api from '../api';
import { Typography, TextField, Button, Alert, Box, MenuItem, CircularProgress, Paper } from '@mui/material';

const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (isRegister) {
        await api.post('/auth/register', form);
        setSuccess('Registration successful! You can now log in.');
        setIsRegister(false);
      } else {
        const res = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        setSuccess('Login successful!');
        window.location.href = '/profile';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="80vh"
      sx={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E0 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Paper 
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          p: 4,
          minWidth: 400,
          maxWidth: 450,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography 
            variant="h4" 
            fontWeight={800} 
            sx={{ 
              mb: 1,
              background: 'linear-gradient(135deg, #2E7D8A 0%, #4A9BA8 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isRegister ? 'Join our healthcare platform' : 'Sign in to your account'}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {isRegister && (
            <TextField
              name="name"
              label="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }
              }}
            />
          )}
          <TextField
            name="email"
            type="email"
            label="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }
            }}
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }
            }}
          />
          {isRegister && (
            <TextField
              select
              name="role"
              label="I am a"
              value={form.role}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }
              }}
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="doctor">Healthcare Provider</MenuItem>
            </TextField>
          )}
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2E7D8A 0%, #4A9BA8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1B5A65 0%, #2E7D8A 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(46, 125, 138, 0.3)',
              }
            }}
            disabled={loading}
            size="large"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isRegister ? 'Create Account' : 'Sign In'
            )}
          </Button>
        </Box>
        
        <Box textAlign="center" mt={2}>
          <Button
            onClick={() => setIsRegister(!isRegister)}
            variant="text"
            fullWidth
            sx={{ 
              color: '#4A9BA8',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(74, 155, 168, 0.08)',
              }
            }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
          </Button>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: '#E53E3E',
              }
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mt: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: '#38A169',
              }
            }}
          >
            {success}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default AuthPage; 