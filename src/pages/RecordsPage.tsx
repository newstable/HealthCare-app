import React, { useEffect, useState } from 'react';
import api from '../api';
import { Card, CardContent, Typography, TextField, Button, Alert, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const primaryColor = '#4e54c8';
const secondaryColor = '#8f94fb';
const buttonRadius = 18;

const RecordsPage: React.FC = () => {
  const [role, setRole] = useState<string>('');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [desc, setDesc] = useState('');
  const [data, setData] = useState('');
  const [patientId, setPatientId] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchRoleAndRecords = async () => {
      try {
        setLoading(true);
        const profile = await api.get('/profile/me');
        setRole(profile.data.role);
        if (profile.data.role === 'patient') {
          const res = await api.get('/records/mine');
          setRecords(res.data);
        }
      } catch (err) {
        setError('Failed to load records');
      } finally {
        setLoading(false);
      }
    };
    fetchRoleAndRecords();
  }, []);

  const fetchPatientRecords = async () => {
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const res = await api.get(`/records/patient/${patientId}`);
      setRecords(res.data);
      setSuccess('Records loaded');
    } catch (err) {
      setError('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/records', { description: desc, data: data ? JSON.parse(data) : {} });
      setDesc('');
      setData('');
      setSuccess('Record added!');
      // Refresh records
      const res = await api.get('/records/mine');
      setRecords(res.data);
    } catch (err) {
      setError('Failed to add record (data must be valid JSON)');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" sx={{ background: 'linear-gradient(120deg, #f8fafc 0%, #e0eafc 100%)' }}>
      <Card sx={{ minWidth: 350, maxWidth: 600, width: '100%', boxShadow: 4, p: 2, borderRadius: 5, background: 'linear-gradient(120deg, #f8fafc 0%, #e0eafc 100%)' }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} mb={3} align="center" sx={{ color: primaryColor, letterSpacing: 1 }}>
            Health Records
          </Typography>
          {role === 'patient' && (
            <Box component="form" onSubmit={handleAddRecord} mb={3}>
              <TextField
                label="Description"
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
                fullWidth
                margin="normal"
                sx={{ background: '#fff', borderRadius: 2, fontWeight: 600, fontSize: '1.1rem' }}
                InputProps={{ style: { fontWeight: 600, fontSize: '1.1rem' } }}
              />
              <TextField
                label="Data (JSON)"
                value={data}
                onChange={e => setData(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                minRows={4}
                sx={{ background: '#fff', borderRadius: 2, fontSize: '1rem' }}
                InputProps={{ style: { fontSize: '1rem' } }}
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, borderRadius: buttonRadius, background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`, fontWeight: 700, fontSize: '1.1rem', letterSpacing: 1 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'ADD RECORD'}
              </Button>
            </Box>
          )}
          {role === 'doctor' && (
            <Box component="form" onSubmit={e => { e.preventDefault(); fetchPatientRecords(); }} mb={3} display="flex" gap={2}>
              <TextField
                label="Patient ID"
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                required
                fullWidth
                sx={{ background: '#fff', borderRadius: 2 }}
              />
              <Button type="submit" variant="contained" sx={{ borderRadius: buttonRadius, background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`, fontWeight: 700 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'VIEW PATIENT RECORDS'}
              </Button>
            </Box>
          )}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {records.map((rec, i) => (
                <ListItem key={rec._id || i} alignItems="flex-start" sx={{ mb: 2, borderRadius: 3, boxShadow: 2, bgcolor: '#fff', border: `1.5px solid ${primaryColor}22` }}>
                  <ListItemText
                    primary={<Typography variant="h6" sx={{ color: primaryColor, fontWeight: 600 }}>{rec.date?.slice(0, 10)}: {rec.description}</Typography>}
                    secondary={<pre style={{ background: 'none', padding: 0, margin: 0, color: '#333', fontSize: '1rem' }}>{JSON.stringify(rec.data, null, 2)}</pre>}
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

export default RecordsPage; 