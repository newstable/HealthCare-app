import React, { useEffect, useState } from 'react';
import api from '../api';
import { Card, CardContent, Typography, TextField, Button, Alert, Box, List, ListItem, ListItemText, CircularProgress, MenuItem, Select, FormControl, InputLabel, Avatar, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  profile?: {
    specialization?: string;
    avatarUrl?: string;
  };
}

interface Appointment {
  _id: string;
  patient: string | { _id: string; name: string; email: string };
  doctor: string | { _id: string; name: string; email: string };
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
}

const primaryColor = '#2E7D8A';
const secondaryColor = '#4A9BA8';
const buttonRadius = 18;

const AppointmentsPage: React.FC = () => {
  const [role, setRole] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // For patients
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  // For doctors
  const [statusUpdate, setStatusUpdate] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const fetchRoleAndData = async () => {
      try {
        setLoading(true);
        const profile = await api.get('/profile/me');
        setRole(profile.data.role);
        
        if (profile.data.role === 'patient') {
          // Load doctors for patient
          const doctorsRes = await api.get('/appointments/doctors');
          setDoctors(doctorsRes.data);
          
          // Load patient's appointments
          const appointmentsRes = await api.get('/appointments/mine');
          setAppointments(appointmentsRes.data);
        } else if (profile.data.role === 'doctor') {
          // Load doctor's appointments
          const appointmentsRes = await api.get('/appointments/doctor');
          setAppointments(appointmentsRes.data);
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchRoleAndData();
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/appointments', { 
        doctor: selectedDoctor, 
        date, 
        reason 
      });
      setSuccess('Appointment requested successfully!');
      setSelectedDoctor('');
      setDate('');
      setReason('');
      // Refresh appointments
      const res = await api.get('/appointments/mine');
      setAppointments(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request appointment');
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
      setSuccess('Status updated successfully!');
      // Refresh appointments
      const res = await api.get('/appointments/doctor');
      setAppointments(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  const getDoctorName = (doctor: string | { _id: string; name: string; email: string }) => {
    return typeof doctor === 'string' ? doctor : doctor.name;
  };

  const getPatientName = (patient: string | { _id: string; name: string; email: string }) => {
    return typeof patient === 'string' ? patient : patient.name;
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
      <Card sx={{ 
        minWidth: 350, 
        maxWidth: 800, 
        width: '100%', 
        boxShadow: 4, 
        p: 2, 
        borderRadius: 5, 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <CardContent>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            mb={3} 
            align="center" 
            sx={{ 
              color: primaryColor, 
              letterSpacing: 1,
              background: 'linear-gradient(135deg, #2E7D8A 0%, #4A9BA8 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Appointments
          </Typography>
          
          {role === 'patient' && (
            <Box component="form" onSubmit={handleRequest} mb={3}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  label="Select Doctor"
                  sx={{ 
                    background: '#fff', 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#CBD5E0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4A9BA8',
                    },
                  }}
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor._id} value={doctor._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={doctor.profile?.avatarUrl ? `http://localhost:5000${doctor.profile.avatarUrl}` : undefined}
                          sx={{ width: 32, height: 32 }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            Dr. {doctor.name}
                          </Typography>
                          {doctor.profile?.specialization && (
                            <Typography variant="caption" color="text.secondary">
                              {doctor.profile.specialization}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                type="datetime-local"
                label="Date & Time"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  background: '#fff', 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#CBD5E0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A9BA8',
                  },
                }}
              />
              
              <TextField
                label="Reason for Visit"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                minRows={3}
                sx={{ 
                  background: '#fff', 
                  borderRadius: 2, 
                  fontSize: '1.1rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#CBD5E0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A9BA8',
                  },
                }}
                InputProps={{ style: { fontSize: '1rem' } }}
              />
              
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 3, 
                  borderRadius: buttonRadius, 
                  background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`, 
                  fontWeight: 700, 
                  fontSize: '1.1rem', 
                  letterSpacing: 1,
                  py: 1.5,
                  '&:hover': {
                    background: `linear-gradient(90deg, #1B5A65 0%, #2E7D8A 100%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(46, 125, 138, 0.3)',
                  }
                }} 
                disabled={loading}
              >
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
                <ListItem 
                  key={appt._id || i} 
                  alignItems="flex-start" 
                  sx={{ 
                    mb: 2, 
                    borderRadius: 3, 
                    boxShadow: 2, 
                    bgcolor: '#fff', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start', 
                    border: `1.5px solid ${primaryColor}22`,
                    p: 3,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 600 }}>
                          {new Date(appt.date).toLocaleString()}
                        </Typography>
                        <Chip 
                          label={appt.status.toUpperCase()} 
                          color={getStatusColor(appt.status) as any}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Doctor:</strong> Dr. {getDoctorName(appt.doctor)}
                        </Typography>
                        {role === 'doctor' && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Patient:</strong> {getPatientName(appt.patient)}
                          </Typography>
                        )}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          <strong>Reason:</strong> {appt.reason}
                        </Typography>
                        
                        {role === 'doctor' && (
                          <Box mt={2} display="flex" alignItems="center" gap={2}>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                              <InputLabel>Update Status</InputLabel>
                              <Select
                                value={statusUpdate[appt._id] || appt.status}
                                label="Update Status"
                                onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                                sx={{ 
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#CBD5E0',
                                  },
                                }}
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="confirmed">Confirmed</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                              </Select>
                            </FormControl>
                            <Button 
                              onClick={() => handleUpdateStatus(appt._id)} 
                              variant="contained" 
                              color="secondary" 
                              size="small" 
                              disabled={loading} 
                              sx={{ 
                                borderRadius: buttonRadius, 
                                fontWeight: 600,
                                background: `linear-gradient(90deg, ${secondaryColor} 0%, ${primaryColor} 100%)`,
                                '&:hover': {
                                  background: `linear-gradient(90deg, #2E7D8A 0%, #1B5A65 100%)`,
                                }
                              }}
                            >
                              Update
                            </Button>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          {appointments.length === 0 && !loading && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                {role === 'patient' ? 'No appointments scheduled yet.' : 'No appointments assigned yet.'}
              </Typography>
              {role === 'patient' && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Schedule your first appointment above!
                </Typography>
              )}
            </Box>
          )}
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mt: 2,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#38A169',
                }
              }}
            >
              {success}
            </Alert>
          )}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#E53E3E',
                }
              }}
            >
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AppointmentsPage; 