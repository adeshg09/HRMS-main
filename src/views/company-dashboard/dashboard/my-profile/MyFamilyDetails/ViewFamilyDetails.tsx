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
  People as PeopleIcon
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import SessionContext from 'context/SessionContext';
import { EditEmployeeFamilyDetailsFormValues } from 'models/company/employee';
import { getEmployeeFamilyDetailsByUserIdRequest } from 'services/company/employee/familyDetails';
import { countries } from 'constants/appConstant';
import Loader from 'components/Loader';
import styles from './family.style';

interface IViewFamilyDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// Default empty family member entry
const emptyFamilyMember: EditEmployeeFamilyDetailsFormValues = {
  ddlRelationType: 'family member',
  txtName: '',
  txtAge: '',
  txtBirthDate: '',
  txtCurrentAddress: '',
  ddlBirthCountry: '',
  ddlBirthState: '',
  txtBirthLocation: '',
  txtOccupation: '',
  txtPhone: ''
};

const ViewFamilyDetails = ({
  handleViewMode
}: IViewFamilyDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);

  /* States */
  const [
    initialValuesFamilyDetailsEntries,
    setInitialValuesFamilyDetailsEntries
  ] = useState<EditEmployeeFamilyDetailsFormValues[]>([emptyFamilyMember]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[] | []>([]);

  /**
   * function to handle country change
   * @return {void}
   */
  const handleCountryChange = (countryCode: string): void => {
    const selectedCountry = countries.find((x) => x.alpha2Code === countryCode);
    setStates(selectedCountry ? selectedCountry.states : []);
  };

  /**
   * function to get all the family details with backend action
   *
   * @returns {void}
   */
  const handleGetFamilyDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeFamilyDetailsByUserIdRequest(
        Number(user?.id)
      );
      console.log('res is', response);
      const familyDetailsData: any = response?.employeeFamilyDetails;

      if (familyDetailsData && familyDetailsData.length > 0) {
        setInitialValuesFamilyDetailsEntries(
          familyDetailsData.map((member: any) => ({
            ddlRelationType: member.relation_type || 'family member',
            txtName: member.name || '',
            txtAge: member.age || '',
            txtBirthDate: member.birth_date || '',
            txtCurrentAddress: member.current_address || '',
            ddlBirthCountry: member.birth_country || '',
            ddlBirthState: member.birth_state || '',
            txtBirthLocation: member.birth_location || '',
            txtOccupation: member.occupation || '',
            txtPhone: member.phone || ''
          }))
        );
      } else {
        // If no data is returned, maintain the default empty entry
        setInitialValuesFamilyDetailsEntries([emptyFamilyMember]);
      }
    } catch (error) {
      console.error('Error fetching family details:', error);
      // On error, maintain the default empty entry
      setInitialValuesFamilyDetailsEntries([emptyFamilyMember]);
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

  const renderFamilyMemberAccordion = (
    member: EditEmployeeFamilyDetailsFormValues,
    index: number
  ): JSX.Element => (
    <Accordion key={index} sx={styles.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        aria-controls={`family-member-${index}-content`}
        id={`family-member-${index}-header`}
        sx={styles.accordionSummary}
      >
        <Typography variant="h6" display="flex" alignItems="center">
          <PeopleIcon sx={{ marginRight: '8px' }} />
          {(member.ddlRelationType || 'Family Member').charAt(0).toUpperCase() +
            (member.ddlRelationType || 'Family Member').slice(1)}{' '}
          Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <Box sx={styles.accordionDetails}>
          {viewItem('Relation Type', member.ddlRelationType)}
          {viewItem('Full Name', member.txtName)}
          {viewItem('Age', member.txtAge)}
          {viewItem('Birth Date', member.txtBirthDate)}
          {viewItem('Current Address', member.txtCurrentAddress)}
          {viewItem('Birth Country', member.ddlBirthCountry)}
          {viewItem('Birth State', member.ddlBirthState)}
          {viewItem('Birth Location', member.txtBirthLocation)}
          {viewItem('Occupation', member.txtOccupation)}
          {viewItem('Phone', member.txtPhone)}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    handleGetFamilyDetails();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.card}>
          <CardHeader
            subheader="Please use edit to update family details."
            title="Family Details"
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
              Edit Family Details
            </Button>
          </Box>
          <Divider />
          {loading ? (
            <Loader />
          ) : (
            <Box sx={styles.familyDetailsContainer}>
              {initialValuesFamilyDetailsEntries.map((member, index) =>
                renderFamilyMemberAccordion(member, index)
              )}
            </Box>
          )}
        </Card>
      </Grid>
    </Box>
  );
};

export default ViewFamilyDetails;
