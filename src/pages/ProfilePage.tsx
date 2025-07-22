import React, { useState } from 'react';
import { Typography, Button, Avatar, Box, TextField, Alert, CircularProgress, Paper } from '@mui/material';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  React.useEffect(() => {
    setForm(profile || {});
    setSelectedImage(null);
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
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, or GIF)');
        return;
      }

      setSelectedImage(URL.createObjectURL(file));
      setImageUploading(true);
      setError('');
      setSuccess('');
      
      try {
        await onUploadImage(file);
        setSuccess('Profile image uploaded successfully!');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Image upload failed');
        setSelectedImage(null);
      } finally {
        setImageUploading(false);
      }
    }
  };

  // Get the avatar URL from the profile
  const getAvatarUrl = () => {
    if (selectedImage) return selectedImage;
    if (profile?.profile?.avatarUrl) return `http://localhost:5000${profile.profile.avatarUrl}`;
    return undefined;
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
          minWidth: 450,
          maxWidth: 500,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar 
            src={getAvatarUrl()} 
            sx={{ 
              width: 120, 
              height: 120, 
              mb: 3,
              border: '4px solid #E2E8F0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
              }
            }} 
          />
          <Button 
            variant="outlined" 
            component="label" 
            size="medium" 
            disabled={imageUploading} 
            sx={{ 
              mb: 1,
              borderColor: '#4A9BA8',
              color: '#4A9BA8',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#2E7D8A',
                backgroundColor: 'rgba(74, 155, 168, 0.08)',
              }
            }}
          >
            {imageUploading ? <CircularProgress size={20} /> : '📷 Upload New Image'}
            <input 
              type="file" 
              accept="image/*" 
              hidden 
              onChange={handleImageChange} 
            />
          </Button>
          {imageUploading && (
            <Typography variant="caption" color="text.secondary">
              Uploading...
            </Typography>
          )}
        </Box>
        
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
            Profile
          </Typography>
        </Box>
        
        {edit ? (
          <Box component="form" onSubmit={handleUpdate}>
            <TextField
              name="name"
              label="Full Name"
              value={form.name || ''}
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
              name="email"
              label="Email Address"
              value={form.email || ''}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(248, 250, 252, 0.8)',
                }
              }}
            />
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
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
            </Button>
            <Button 
              type="button" 
              onClick={() => setEdit(false)} 
              variant="outlined"
              fullWidth 
              sx={{ 
                mb: 2,
                borderColor: '#718096',
                color: '#718096',
                '&:hover': {
                  borderColor: '#4A5568',
                  backgroundColor: 'rgba(113, 128, 150, 0.08)',
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Box textAlign="center">
            <Box sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3, 
              backgroundColor: 'rgba(248, 250, 252, 0.8)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
            }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#2D3748' }}>
                <strong>Name:</strong> {profile.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#2D3748' }}>
                <strong>Email:</strong> {profile.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 0, fontWeight: 600, color: '#2D3748' }}>
                <strong>Role:</strong> {profile.role === 'patient' ? 'Patient' : 'Healthcare Provider'}
              </Typography>
            </Box>
            <Button 
              onClick={() => setEdit(true)} 
              variant="outlined" 
              fullWidth 
              sx={{ 
                mb: 2,
                py: 1.5,
                borderColor: '#4A9BA8',
                color: '#4A9BA8',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#2E7D8A',
                  backgroundColor: 'rgba(74, 155, 168, 0.08)',
                }
              }}
            >
              ✏️ Edit Profile
            </Button>
            <Button 
              onClick={onLogout} 
              variant="contained" 
              fullWidth
              sx={{ 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #F56565 0%, #E53E3E 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(245, 101, 101, 0.3)',
                }
              }}
            >
              🚪 Logout
            </Button>
          </Box>
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
      </Paper>
    </Box>
  );
};

export default ProfilePage; 