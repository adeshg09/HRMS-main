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
  Work as WorkIcon
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { getEmployeeExperienceDetailsByUserIdRequest } from 'services/company/employee/experienceDetails';
import styles from './experience.style';

interface IViewExperienceDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// Default empty experience entry
const emptyExperience = {
  companyName: '',
  employeeId: '',
  jobTitle: '',
  startDate: '',
  endDate: '',
  country: '',
  city: '',
  state: '',
  employmentType: '',
  supervisorName: '',
  supervisorPhone: ''
};

const ViewExperienceDetails = ({
  handleViewMode
}: IViewExperienceDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const [experienceDetails, setExperienceDetails] = useState([emptyExperience]);
  const [loading, setLoading] = useState(false);

  const handleGetExperienceDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeExperienceDetailsByUserIdRequest(
        Number(user?.id)
      );
      console.log('exp res is', response);
      const experienceData = response?.employeeExperienceDetails;

      if (experienceData && experienceData.length > 0) {
        setExperienceDetails(
          experienceData.map((experience: any) => ({
            companyName: experience.company_name || '',
            employeeId: experience.employee_id || '',
            jobTitle: experience.job_title || '',
            startDate: experience.start_date || '',
            endDate: experience.end_date || '',
            country: experience.country || '',
            city: experience.city || '',
            state: experience.state || '',
            employmentType: experience.employment_type || '',
            supervisorName: experience.supervisor_name || '',
            supervisorPhone: experience.supervisor_phone || ''
          }))
        );
      } else {
        setExperienceDetails([emptyExperience]);
      }
    } catch (error) {
      console.error('Error fetching experience details:', error);
      setExperienceDetails([emptyExperience]);
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

  const renderExperienceDetailsAccordion = (
    experience: any,
    index: number
  ): JSX.Element => (
    <Accordion key={index} sx={styles.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        aria-controls={`experience-details-${index}-content`}
        id={`experience-details-${index}-header`}
        sx={styles.accordionSummary}
      >
        <Typography variant="h6" display="flex" alignItems="center">
          <WorkIcon sx={{ marginRight: '8px' }} />
          {experience.companyName
            ? `${experience.companyName} Experience`
            : `Experience ${index + 1}`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <Box sx={styles.accordionDetails}>
          {viewItem('Company Name', experience.companyName)}
          {viewItem('Employee ID', experience.employeeId)}
          {viewItem('Job Title', experience.jobTitle)}
          {viewItem('Start Date', experience.startDate)}
          {viewItem('End Date', experience.endDate)}
          {viewItem('Country', experience.country)}
          {viewItem('City', experience.city)}
          {viewItem('State', experience.state)}
          {viewItem('Employment Type', experience.employmentType)}
          {viewItem('Supervisor Name', experience.supervisorName)}
          {viewItem('Supervisor Phone', experience.supervisorPhone)}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    handleGetExperienceDetails();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.card}>
          <CardHeader
            subheader="Please use edit to update experience details."
            title="Experience Details"
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
              Edit Experience Details
            </Button>
          </Box>
          <Divider />
          {loading ? (
            <Loader />
          ) : (
            <Box sx={styles.experienceDetailsContainer}>
              {experienceDetails.map((experience, index) =>
                renderExperienceDetailsAccordion(experience, index)
              )}
            </Box>
          )}
        </Card>
      </Grid>
    </Box>
  );
};

export default ViewExperienceDetails;
