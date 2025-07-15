import React, { useEffect, useState } from 'react';
import api from '../api';

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
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Appointments</h2>
      {role === 'patient' && (
        <form onSubmit={handleRequest} style={{ marginBottom: 16 }}>
          <input
            placeholder="Doctor ID"
            value={doctorId}
            onChange={e => setDoctorId(e.target.value)}
            required
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
          <input
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
          <input
            placeholder="Reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
          <button type="submit">Request Appointment</button>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {appointments.map((appt, i) => (
            <li key={appt._id || i} style={{ marginBottom: 12 }}>
              <b>{new Date(appt.date).toLocaleString()}</b> with Doctor: {appt.doctor} <br />
              <b>Status:</b> {appt.status} <br />
              <b>Reason:</b> {appt.reason}
              {role === 'doctor' && (
                <div style={{ marginTop: 8 }}>
                  <select
                    value={statusUpdate[appt._id] || appt.status}
                    onChange={e => handleStatusChange(appt._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={() => handleUpdateStatus(appt._id)} style={{ marginLeft: 8 }}>
                    Update Status
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default AppointmentsPage; 