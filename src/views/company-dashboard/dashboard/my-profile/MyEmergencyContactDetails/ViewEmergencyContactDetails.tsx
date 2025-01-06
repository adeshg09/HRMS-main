import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { getEmployeeEmergencyContactDetailsByUserIdRequest } from 'services/company/employee/emergencyContactDetails';
import styles from './emergencyContact.style';

interface IViewEmergencyContactDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// Default empty emergency contact entry
const emptyEmergencyContact = {
  contactName: '',
  contactAddress: '',
  contactRelation: '',
  phone: ''
};

const ViewEmergencyContactDetails = ({
  handleViewMode
}: IViewEmergencyContactDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const [emergencyContacts, setEmergencyContacts] = useState([
    emptyEmergencyContact
  ]);
  const [loading, setLoading] = useState(false);

  const handleGetEmergencyContacts = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeEmergencyContactDetailsByUserIdRequest(
        Number(user?.id)
      );
      const contactsData = response?.employeeEmergencyContacts;

      if (contactsData && contactsData.length > 0) {
        setEmergencyContacts(
          contactsData.map((contact: any) => ({
            contactName: contact.contact_name || '',
            contactAddress: contact.contact_address || '',
            contactRelation: contact.contact_relation || '',
            phone: contact.phone || ''
          }))
        );
      } else {
        setEmergencyContacts([emptyEmergencyContact]);
      }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      setEmergencyContacts([emptyEmergencyContact]);
    } finally {
      setLoading(false);
    }
  };

  const viewItem = (title: string, value: string | number): JSX.Element => (
    <Grid container spacing={1} sx={styles.viewItemGrid}>
      <Grid item xs={4}>
        <Typography variant="subtitle1" sx={styles.viewItemLabel}>
          {title}:
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body1" sx={styles.viewItemValue}>
          {value || 'Not provided'}
        </Typography>
      </Grid>
    </Grid>
  );

  const renderEmergencyContactDetailsAccordion = (
    contact: any,
    index: number
  ): JSX.Element => (
    <Accordion key={index} sx={styles.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        aria-controls={`emergency-contact-details-${index}-content`}
        id={`emergency-contact-details-${index}-header`}
        sx={styles.accordionSummary}
      >
        <Typography variant="h6" display="flex" alignItems="center">
          <PhoneIcon sx={{ marginRight: '8px' }} />
          Emergency Contact {index + 1}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <Box sx={styles.accordionDetails}>
          {viewItem('Contact Name', contact.contactName)}
          {viewItem('Contact Address', contact.contactAddress)}
          {viewItem('Relation', contact.contactRelation)}
          {viewItem('Phone', contact.phone)}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    handleGetEmergencyContacts();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.card}>
          <CardHeader
            subheader="Please use edit to update emergency contact details."
            title="Emergency Contact Details"
            sx={styles.cardHeader}
            titleTypographyProps={{ variant: 'h3', component: 'h3' }}
          />
          <Box sx={styles.editProfile}>
            <Button
              color="primary"
              size="large"
              variant="contained"
              onClick={() => handleViewMode(true)}
              startIcon={<EditIcon />}
              sx={styles.editButton}
              disabled={loading}
            >
              Edit Emergency Contact Details
            </Button>
          </Box>
          <Divider />
          {loading ? (
            <Loader />
          ) : (
            <Box sx={styles.emergencyContactDetailsContainer}>
              {emergencyContacts.map((contact, index) =>
                renderEmergencyContactDetailsAccordion(contact, index)
              )}
            </Box>
          )}
        </Card>
      </Grid>
    </Box>
  );
};

export default ViewEmergencyContactDetails;
