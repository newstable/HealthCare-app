import React, { useState } from 'react';
import api from '../api';
import { Card, CardContent, Typography, TextField, Button, Alert, Box, MenuItem, CircularProgress } from '@mui/material';

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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Card sx={{ minWidth: 350, maxWidth: 400, width: '100%', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={2} align="center">
            {isRegister ? 'Register' : 'Login'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            {isRegister && (
              <TextField
                name="name"
                label="Name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
            )}
            <TextField
              name="email"
              type="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
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
            />
            {isRegister && (
              <TextField
                select
                name="role"
                label="Role"
                value={form.role}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </TextField>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              disabled={loading}
              size="large"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : isRegister ? 'Register' : 'Login'}
            </Button>
          </Box>
          <Button
            onClick={() => setIsRegister(!isRegister)}
            fullWidth
            color="secondary"
            sx={{ mb: 1 }}
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthPage; 