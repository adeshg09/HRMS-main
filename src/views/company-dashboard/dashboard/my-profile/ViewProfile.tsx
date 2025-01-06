/* Imports */
import {
  Box,
  Button,
  Grid,
  Typography,
  List,
  ListItem,
  styled,
  Chip
} from '@mui/material';
import { useContext } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';

/* Relative Imports */
import SessionContext from 'context/SessionContext';

// Styled Components
const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginBottom: theme.spacing(1)
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 400
}));

const ChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1) // This adds consistent spacing between chips
}));

interface IViewProfileProps {
  handleViewMode: (newEditMode: boolean) => void;
}

/**
 * Component to display profile information
 *
 * @component
 * @returns {JSX.Element}
 */
const ViewProfile = ({ handleViewMode }: IViewProfileProps): JSX.Element => {
  /* Hooks */
  const { user } = useContext(SessionContext);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleViewMode(true)}
          startIcon={<EditIcon />}
        >
          Edit Profile
        </Button>
      </Box>

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Profile Information
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">First Name</InfoLabel>
            <InfoValue variant="body1">{user.first_name}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">Last Name</InfoLabel>
            <InfoValue variant="body1">{user.last_name}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">Email</InfoLabel>
            <InfoValue variant="body1">{user.email}</InfoValue>
          </Grid>

          {user?.profile?.roles && user.profile.roles.length > 0 && (
            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Roles</InfoLabel>
              <ChipContainer>
                {user.profile.roles.map((role: any) => (
                  <Chip
                    key={role.id}
                    label={role.name}
                    size="medium"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </ChipContainer>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewProfile;
