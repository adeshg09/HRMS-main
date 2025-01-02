// EditProfile.tsx
import { Box, Card, Grid, TextField, Button, Stack } from '@mui/material';
import { useState } from 'react';
import styles from './profile.style';

interface EditProfileProps {
  userData: any;
  onCancel: () => void;
  onSave: (data: any) => void;
}

const EditProfile = ({
  userData,
  onCancel,
  onSave
}: EditProfileProps): JSX.Element => {
  const [formData, setFormData] = useState(userData);

  const handleChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent): any => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card sx={styles.contentCard}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              sx={styles.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              sx={styles.formField}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              sx={styles.formField}
            />
          </Grid>
          {/* Add other form fields similar to ViewProfile */}

          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={onCancel}
                sx={styles.actionButton}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={styles.actionButton}
              >
                Save Changes
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
};

export default EditProfile;
