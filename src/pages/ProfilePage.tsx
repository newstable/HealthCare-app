import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Avatar, Box, TextField, Alert, CircularProgress } from '@mui/material';

interface ProfilePageProps {
  profile: any;
  onLogout: () => void;
  onUpdate: (data: any) => Promise<void>;
  onUploadImage: (file: File) => Promise<void>;
  loading: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onLogout, onUpdate, onUploadImage, loading }) => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<any>(profile || {});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  React.useEffect(() => {
    setForm(profile || {});
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await onUpdate(form);
      setEdit(false);
      setSuccess('Profile updated!');
    } catch (err: any) {
      setError('Update failed');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUploading(true);
      setError('');
      setSuccess('');
      try {
        await onUploadImage(e.target.files[0]);
        setSuccess('Image uploaded!');
      } catch {
        setError('Image upload failed');
      } finally {
        setImageUploading(false);
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Card sx={{ minWidth: 350, maxWidth: 420, width: '100%', boxShadow: 3, p: 2 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar src={profile?.avatarUrl} sx={{ width: 80, height: 80, mb: 1 }} />
            <Button variant="outlined" component="label" size="small" disabled={imageUploading} sx={{ mb: 1 }}>
              {imageUploading ? <CircularProgress size={18} /> : 'Upload Image'}
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
          </Box>
          <Typography variant="h5" fontWeight={700} mb={2} align="center">
            Profile
          </Typography>
          {edit ? (
            <Box component="form" onSubmit={handleUpdate}>
              <TextField
                name="name"
                label="Name"
                value={form.name || ''}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                name="email"
                label="Email"
                value={form.email || ''}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                disabled
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, mb: 1 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
              </Button>
              <Button type="button" onClick={() => setEdit(false)} fullWidth color="secondary" sx={{ mb: 1 }}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Box textAlign="center">
              <Typography><b>Name:</b> {profile.name}</Typography>
              <Typography><b>Email:</b> {profile.email}</Typography>
              <Typography><b>Role:</b> {profile.role}</Typography>
              <Button onClick={() => setEdit(true)} variant="outlined" fullWidth sx={{ mt: 2, mb: 1 }}>Edit Profile</Button>
              <Button onClick={onLogout} variant="contained" color="error" fullWidth>Logout</Button>
            </Box>
          )}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage; 