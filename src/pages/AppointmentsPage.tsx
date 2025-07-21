import React, { useEffect, useState } from 'react';
import api from '../api';
import { Card, CardContent, Typography, TextField, Button, Alert, Box, List, ListItem, ListItemText, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const primaryColor = '#4e54c8';
const secondaryColor = '#8f94fb';
const buttonRadius = 18;

const AppointmentsPage: React.FC = () => {
  const [role, setRole] = useState<string>('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // For patients
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  // For doctors
  const [statusUpdate, setStatusUpdate] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const fetchRoleAndAppointments = async () => {
      try {
        setLoading(true);
        const profile = await api.get('/profile/me');
        setRole(profile.data.role);
        if (profile.data.role === 'patient') {
          const res = await api.get('/appointments/mine');
          setAppointments(res.data);
        } else if (profile.data.role === 'doctor') {
          const res = await api.get('/appointments/doctor');
          setAppointments(res.data);
        }
      } catch (err) {
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchRoleAndAppointments();
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/appointments', { doctor: doctorId, date, reason });
      setSuccess('Appointment requested!');
      setDoctorId('');
      setDate('');
      setReason('');
      // Refresh
      const res = await api.get('/appointments/mine');
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to request appointment');
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    setStatusUpdate({ ...statusUpdate, [id]: status });
  };

  const handleUpdateStatus = async (id: string) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/appointments/${id}/status`, { status: statusUpdate[id] });
      setSuccess('Status updated!');
      // Refresh
      const res = await api.get('/appointments/doctor');
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" sx={{ background: 'linear-gradient(120deg, #f8fafc 0%, #e0eafc 100%)' }}>
      <Card sx={{ minWidth: 350, maxWidth: 600, width: '100%', boxShadow: 4, p: 2, borderRadius: 5, background: 'linear-gradient(120deg, #f8fafc 0%, #e0eafc 100%)' }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} mb={3} align="center" sx={{ color: primaryColor, letterSpacing: 1 }}>
            Appointments
          </Typography>
          {role === 'patient' && (
            <Box component="form" onSubmit={handleRequest} mb={3}>
              <TextField
                label="Doctor ID"
                value={doctorId}
                onChange={e => setDoctorId(e.target.value)}
                required
                fullWidth
                margin="normal"
                sx={{ background: '#fff', borderRadius: 2 }}
              />
              <TextField
                type="datetime-local"
                label="Date & Time"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={{ background: '#fff', borderRadius: 2 }}
              />
              <TextField
                label="Reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                minRows={3}
                sx={{ background: '#fff', borderRadius: 2, fontSize: '1.1rem' }}
                InputProps={{ style: { fontSize: '1.1rem' } }}
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, borderRadius: buttonRadius, background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`, fontWeight: 700, fontSize: '1.1rem', letterSpacing: 1 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'REQUEST APPOINTMENT'}
              </Button>
            </Box>
          )}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {appointments.map((appt, i) => (
                <ListItem key={appt._id || i} alignItems="flex-start" sx={{ mb: 2, borderRadius: 3, boxShadow: 2, bgcolor: '#fff', flexDirection: 'column', alignItems: 'flex-start', border: `1.5px solid ${primaryColor}22` }}>
                  <ListItemText
                    primary={<Typography variant="h6" sx={{ color: primaryColor, fontWeight: 600 }}>{new Date(appt.date).toLocaleString()} with Doctor: {appt.doctor}</Typography>}
                    secondary={<>
                      <Typography variant="body2" sx={{ color: secondaryColor }}><b>Status:</b> {appt.status}</Typography>
                      <Typography variant="body2" sx={{ color: '#333' }}><b>Reason:</b> {appt.reason}</Typography>
                      {role === 'doctor' && (
                        <Box mt={1} display="flex" alignItems="center" gap={1}>
                          <FormControl size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={statusUpdate[appt._id] || appt.status}
                              label="Status"
                              onChange={e => handleStatusChange(appt._id, e.target.value)}
                              sx={{ minWidth: 120 }}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="confirmed">Confirmed</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                              <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                          </FormControl>
                          <Button onClick={() => handleUpdateStatus(appt._id)} variant="contained" color="secondary" size="small" disabled={loading} sx={{ borderRadius: buttonRadius, fontWeight: 600 }}>
                            Update Status
                          </Button>
                        </Box>
                      )}
                    </>}
                  />
                </ListItem>
              ))}
            </List>
          )}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AppointmentsPage; 