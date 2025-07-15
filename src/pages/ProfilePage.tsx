import React, { useEffect, useState } from 'react';
import api from '../api';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/profile/me');
        setProfile(res.data);
        setForm(res.data);
      } catch (err: any) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/profile/me', form);
      setProfile(res.data);
      setEdit(false);
      setSuccess('Profile updated!');
    } catch (err: any) {
      setError('Update failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Profile</h2>
      {edit ? (
        <form onSubmit={handleUpdate}>
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            placeholder="Name"
            required
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
          <input
            name="email"
            value={form.email || ''}
            onChange={handleChange}
            placeholder="Email"
            required
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
            disabled
          />
          <button type="submit" style={{ width: '100%', marginBottom: 8 }}>Save</button>
          <button type="button" onClick={() => setEdit(false)} style={{ width: '100%' }}>Cancel</button>
        </form>
      ) : (
        <div>
          <div><b>Name:</b> {profile.name}</div>
          <div><b>Email:</b> {profile.email}</div>
          <div><b>Role:</b> {profile.role}</div>
          <button onClick={() => setEdit(true)} style={{ width: '100%', marginTop: 8 }}>Edit Profile</button>
        </div>
      )}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default ProfilePage; 