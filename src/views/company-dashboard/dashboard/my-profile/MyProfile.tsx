// index.tsx
import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Typography,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  WorkOutline as WorkIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import AdminDashboardPage from 'components/Page/AdminDashboardPage';
import styles from './profile.style';
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';

const MyProfilePage = (): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: 'Adesh',
    lastName: 'Gadage',
    email: 'agadage@techechelons.com',
    role: 'Full Stack Developer Intern'
  });

  const handleUpdateProfile = (newData: any): void => {
    setUserData(newData);
    setIsEditing(false);
  };

  return (
    <AdminDashboardPage title="My Profile">
      <Box sx={styles.profileContainer}>
        {/* Header Card */}
        <Card sx={styles.headerCard}>
          <Button
            color="primary"
            type="submit"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            sx={styles.editProfile}
          >
            Edit Profile
          </Button>

          <Box sx={styles.profileInfo}>
            <Avatar src="/api/placeholder/120/120" sx={styles.avatar} />
            <Box>
              <Typography variant="h4" fontWeight="600" gutterBottom>
                {userData.firstName} {userData.lastName}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {userData.role}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                {userData.email}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Dynamic Content */}
        {isEditing ? (
          <EditProfile
            userData={userData}
            onCancel={() => setIsEditing(false)}
            onSave={handleUpdateProfile}
          />
        ) : (
          <ViewProfile userData={userData} />
        )}
      </Box>
    </AdminDashboardPage>
  );
};

export default MyProfilePage;
