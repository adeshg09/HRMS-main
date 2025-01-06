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
  School as SchoolIcon
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import SessionContext from 'context/SessionContext';
import { EditEmployeeEducationDetailsFormValues } from 'models/company/employee';
import { getEmployeeEducationDetailsByUserIdRequest } from 'services/company/employee/educationDetails';
import Loader from 'components/Loader';
import styles from './education.style';

interface IViewEducationDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// Default empty education entry
const emptyEducation: EditEmployeeEducationDetailsFormValues = {
  ddlCourse: 'graduation',
  txtDegreeSpecialization: '',
  txtInstituteName: '',
  txtFromDate: '',
  txtToDate: '',
  ddlStatus: '',
  ddlStudyMode: '',
  txtPercentage: ''
};

const ViewEducationDetails = ({
  handleViewMode
}: IViewEducationDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);

  /* States */
  const [
    initialValuesEducationDetailsEntries,
    setInitialValuesEducationDetailsEntries
  ] = useState<EditEmployeeEducationDetailsFormValues[]>([emptyEducation]);
  const [loading, setLoading] = useState(false);

  /**
   * function to get all the education details with backend action
   *
   * @returns {void}
   */
  const handleGetEducationDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeEducationDetailsByUserIdRequest(
        Number(user?.id)
      );
      console.log('edu res is', response);
      const educationDetailsData: any = response?.employeeEducationalDetails;
      if (educationDetailsData && educationDetailsData.length > 0) {
        setInitialValuesEducationDetailsEntries(
          educationDetailsData.map((education: any) => ({
            ddlCourse: education.course || 'graduation',
            txtDegreeSpecialization: education.degree_specialization || '',
            txtInstituteName: education.institute_name || '',
            txtFromDate: education.from_date || '',
            txtToDate: education.to_date || '',
            ddlStatus: education.status || '',
            ddlStudyMode: education.study_mode || '',
            txtPercentage: education.percentage || ''
          }))
        );
      } else {
        // If no data is returned, maintain the default empty entry
        setInitialValuesEducationDetailsEntries([emptyEducation]);
      }
    } catch (error) {
      console.error('Error fetching education details:', error);
      // On error, maintain the default empty entry
      setInitialValuesEducationDetailsEntries([emptyEducation]);
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

  const renderEducationDetailsAccordion = (
    education: EditEmployeeEducationDetailsFormValues,
    index: number
  ): JSX.Element => (
    <Accordion key={index} sx={styles.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        aria-controls={`education-details-${index}-content`}
        id={`education-details-${index}-header`}
        sx={styles.accordionSummary}
      >
        <Typography variant="h6" display="flex" alignItems="center">
          <SchoolIcon sx={{ marginRight: '8px' }} />
          {(education.ddlCourse || 'Graduation').charAt(0).toUpperCase() +
            (education.ddlCourse || 'Graduation').slice(1)}{' '}
          Education Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <Box sx={styles.accordionDetails}>
          {viewItem('Degree Specialization', education.txtDegreeSpecialization)}
          {viewItem('Institute Name', education.txtInstituteName)}
          {viewItem('From Date', education.txtFromDate)}
          {viewItem('To Date', education.txtToDate)}
          {viewItem('Status', education.ddlStatus)}
          {viewItem('Study Mode', education.ddlStudyMode)}
          {viewItem('Percentage', education.txtPercentage)}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    handleGetEducationDetails();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.card}>
          <CardHeader
            subheader="Please use edit to update education details."
            title="Education Details"
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
              Edit Education Details
            </Button>
          </Box>
          <Divider />
          {loading ? (
            <Loader />
          ) : (
            <Box sx={styles.educationDetailsContainer}>
              {initialValuesEducationDetailsEntries.map((education, index) =>
                renderEducationDetailsAccordion(education, index)
              )}
            </Box>
          )}
        </Card>
      </Grid>
    </Box>
  );
};

export default ViewEducationDetails;
