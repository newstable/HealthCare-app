import React, { useEffect, useState } from 'react';
import api from '../api';

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
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Health Records</h2>
      {role === 'patient' && (
        <form onSubmit={handleAddRecord} style={{ marginBottom: 16 }}>
          <input
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            required
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
          <textarea
            placeholder="Data (JSON)"
            value={data}
            onChange={e => setData(e.target.value)}
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
          <button type="submit">Add Record</button>
        </form>
      )}
      {role === 'doctor' && (
        <form onSubmit={e => { e.preventDefault(); fetchPatientRecords(); }} style={{ marginBottom: 16 }}>
          <input
            placeholder="Patient ID"
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            required
            style={{ marginRight: 8 }}
          />
          <button type="submit">View Patient Records</button>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {records.map((rec, i) => (
            <li key={rec._id || i} style={{ marginBottom: 12 }}>
              <b>{rec.date?.slice(0, 10)}</b>: {rec.description}
              <pre style={{ background: '#f4f4f4', padding: 8 }}>{JSON.stringify(rec.data, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default RecordsPage; 