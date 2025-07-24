import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Container,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  HealthAndSafety as HealthIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      avatar: '👩‍⚕️',
      description: 'Board-certified physician with 15+ years of experience in digital health innovation.',
    },
    {
      name: 'Michael Chen',
      role: 'Lead Software Engineer',
      avatar: '👨‍💻',
      description: 'Full-stack developer specializing in healthcare technology and AI integration.',
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Head of Patient Care',
      avatar: '👩‍⚕️',
      description: 'Experienced healthcare administrator focused on patient experience and care coordination.',
    },
    {
      name: 'David Thompson',
      role: 'UX/UI Designer',
      avatar: '👨‍🎨',
      description: 'Design expert creating intuitive healthcare interfaces for better user experience.',
    },
  ];

  const features = [
    {
      icon: <HealthIcon sx={{ fontSize: 40, color: '#2E7D8A' }} />,
      title: 'Comprehensive Health Records',
      description: 'Secure digital storage of medical history, test results, and treatment plans.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#48BB78' }} />,
      title: 'Quick Appointment Booking',
      description: 'Easy scheduling with healthcare providers at your convenience.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#ED8936' }} />,
      title: 'HIPAA Compliant Security',
      description: 'Your health information is protected with enterprise-grade security measures.',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: '#667EEA' }} />,
      title: 'AI-Powered Health Assistant',
      description: '24/7 intelligent chatbot for health queries and guidance.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" fontWeight={800} sx={{ mb: 2, color: '#2E7D8A' }}>
          About Healthy Care
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          Revolutionizing healthcare delivery through innovative technology and compassionate care
        </Typography>
        <Chip
          label="Trusted by 10,000+ Patients"
          color="primary"
          size="medium"
          icon={<VerifiedIcon />}
          sx={{ fontSize: '1.1rem', py: 1 }}
        />
      </Box>

      {/* Mission & Vision */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 6 }}>
        <Box sx={{ flex: '1 1 400px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #2E7D8A 0%, #4A9BA8 100%)', color: 'white' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                To make quality healthcare accessible, affordable, and convenient for everyone through 
                cutting-edge technology and personalized care solutions.
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 400px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #48BB78 0%, #68D391 100%)', color: 'white' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                To become the leading digital healthcare platform that empowers patients and providers 
                to achieve better health outcomes through seamless technology integration.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* What We Do */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={700} sx={{ textAlign: 'center', mb: 4, color: '#2E7D8A' }}>
          What We Do
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ flex: '1 1 250px', minWidth: 250 }}>
              <Card sx={{ 
                height: '100%', 
                textAlign: 'center',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#2E7D8A' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Our Values */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={700} sx={{ textAlign: 'center', mb: 4, color: '#2E7D8A' }}>
          Our Core Values
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2, color: '#2E7D8A' }}>
                Patient-Centered Care
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Every decision we make is guided by what's best for our patients' health and well-being.
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2, color: '#2E7D8A' }}>
                Innovation Excellence
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We continuously innovate to provide the most advanced and effective healthcare solutions.
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2, color: '#2E7D8A' }}>
                Trust & Security
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We maintain the highest standards of data security and patient privacy protection.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={700} sx={{ textAlign: 'center', mb: 4, color: '#2E7D8A' }}>
          Meet Our Team
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
          Dedicated professionals committed to transforming healthcare
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {teamMembers.map((member, index) => (
            <Box key={index} sx={{ flex: '1 1 250px', minWidth: 250 }}>
              <Card sx={{ 
                textAlign: 'center',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      fontSize: '2rem',
                      mx: 'auto',
                      mb: 2,
                      bgcolor: '#4A9BA8',
                    }}
                  >
                    {member.avatar}
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#2E7D8A' }}>
                    {member.name}
                  </Typography>
                  <Chip
                    label={member.role}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {member.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={700} sx={{ textAlign: 'center', mb: 4, color: '#2E7D8A' }}>
          Contact Us
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: '1 1 400px' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 3, color: '#2E7D8A' }}>
                  Get in Touch
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <EmailIcon sx={{ color: '#4A9BA8' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary="contact@healthcare.com"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PhoneIcon sx={{ color: '#4A9BA8' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary="+1 (555) 123-4567"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationIcon sx={{ color: '#4A9BA8' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary="123 Healthcare Ave, Medical District, NY 10001"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <TimeIcon sx={{ color: '#4A9BA8' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Business Hours"
                      secondary="Monday - Friday: 8:00 AM - 6:00 PM EST"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 400px' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 3, color: '#2E7D8A' }}>
                  Support & Information
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <SupportIcon sx={{ color: '#4A9BA8' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Technical Support"
                      secondary="support@healthcare.com"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PeopleIcon sx={{ color: '#4A9BA8' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Partnership Inquiries"
                      secondary="partnerships@healthcare.com"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <SecurityIcon sx={{ color: '#4A9BA8' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Privacy & Security"
                      secondary="privacy@healthcare.com"
                    />
                  </ListItem>
                </List>
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #2E7D8A 0%, #4A9BA8 100%)',
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    Send us a Message
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Footer Stats */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3, color: '#2E7D8A' }}>
          Our Impact
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#2E7D8A' }}>
              10,000+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Happy Patients
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#48BB78' }}>
              500+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Healthcare Providers
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#ED8936' }}>
              50,000+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Appointments Booked
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#667EEA' }}>
              99.9%
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Uptime
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AboutPage; 