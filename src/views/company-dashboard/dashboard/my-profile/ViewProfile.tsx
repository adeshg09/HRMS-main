// ViewProfile.tsx
import { Box, Card, Grid, Typography, Divider } from '@mui/material';
import styles from './profile.style';

interface ViewProfileProps {
  userData: any;
}

const ViewProfile = ({ userData }: ViewProfileProps): JSX.Element => {
  const profileFields = [
    { label: 'First Name', value: userData.firstName },
    { label: 'Last Name', value: userData.lastName },
    { label: 'Email', value: userData.email },
    { label: 'Phone', value: '9322342112' }
  ];

  return (
    <Card sx={styles.contentCard}>
      <Typography variant="h4" sx={{ mb: 3 }} fontWeight="500">
        Profile Information
      </Typography>
      <Grid container spacing={3}>
        {profileFields.map((field, index) => (
          <Grid
            item
            xs={12}
            sm={field.label === 'Address' ? 12 : 6}
            key={index}
          >
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="textSecondary">
                {field.label}
              </Typography>
              <Typography variant="body1">{field.value}</Typography>
            </Box>
            <Divider />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default ViewProfile;