import {
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';

import SessionContext from 'context/SessionContext';
import {
  AddEmployeeProfessionalDetailsFormValues,
  ProfessionalDetailsValues
} from 'models/company/employee';
import { getEmployeeProfessionalDetailsByUserIdRequest } from 'services/company/employee/professionalDetails';
import { getDesignationByIdRequest } from 'services/company/designation';
import Loader from 'components/Loader';
import styles from './index.style';

interface IViewProfessionalDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// Default empty professional details
const emptyProfessionalDetails: AddEmployeeProfessionalDetailsFormValues = {
  txtEmployeeCode: '',
  ddlDesignation: '',
  txtJoinDate: '',
  ddlEmploymentType: '',
  ddlWorkingType: ''
};

const ViewProfessionalDetails = ({
  handleViewMode
}: IViewProfessionalDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [
    initialValuesProfessionalDetails,
    setInitialValuesProfessionalDetails
  ] = useState<AddEmployeeProfessionalDetailsFormValues>(
    emptyProfessionalDetails
  );

  const handleGetProfessionalDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeProfessionalDetailsByUserIdRequest(
        Number(user?.id)
      );
      const professionalData: ProfessionalDetailsValues =
        response?.employeeProfessionalDetail;

      if (professionalData) {
        try {
          const { designation } = await getDesignationByIdRequest(
            Number(professionalData.designation_id)
          );

          setInitialValuesProfessionalDetails({
            txtEmployeeCode: professionalData.employee_code || '',
            ddlDesignation: designation?.name || '',
            txtJoinDate: professionalData.join_date || '',
            ddlEmploymentType: professionalData.employment_type || '',
            ddlWorkingType: professionalData.working_type || ''
          });
        } catch (designationError) {
          console.error('Error fetching designation:', designationError);
          // Set values but with empty designation if designation fetch fails
          setInitialValuesProfessionalDetails({
            txtEmployeeCode: professionalData.employee_code || '',
            ddlDesignation: '',
            txtJoinDate: professionalData.join_date || '',
            ddlEmploymentType: professionalData.employment_type || '',
            ddlWorkingType: professionalData.working_type || ''
          });
        }
      } else {
        setInitialValuesProfessionalDetails(emptyProfessionalDetails);
      }
    } catch (error) {
      console.error('Error fetching professional details:', error);
      setInitialValuesProfessionalDetails(emptyProfessionalDetails);
    } finally {
      setLoading(false);
    }
  };

  const viewItem = (title: string, value: string | number): JSX.Element => (
    <Grid container spacing={0} sx={styles.mainGrid} p={2}>
      <Grid item md={4} sm={4} xs={4} pr={2}>
        <Typography
          variant="h6"
          sx={{
            justifyContent: 'flex-start'
          }}
        >
          {title} :
        </Typography>
      </Grid>
      <Grid item md={8} sm={8} xs={8}>
        <Typography variant="body1">{value || 'Not provided'}</Typography>
      </Grid>
    </Grid>
  );

  useEffect(() => {
    handleGetProfessionalDetails();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.profileParent}>
          <CardHeader
            subheader="Please use edit to update professional details."
            title="Professional Details"
            sx={styles.cardHeaderEdit}
            titleTypographyProps={{ variant: 'h3', component: 'h3' }}
          />
          <Box sx={styles.editProfile}>
            <Button
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              onClick={() => handleViewMode(true)}
              startIcon={<EditIcon />}
              disabled={loading}
            >
              Edit Professional Details
            </Button>
          </Box>
          <Divider />
          <CardContent style={{ textAlign: 'center' }}>
            {loading ? (
              <Loader />
            ) : (
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  {viewItem(
                    'Employee Code',
                    initialValuesProfessionalDetails.txtEmployeeCode
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Designation',
                    initialValuesProfessionalDetails.ddlDesignation
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Join Date',
                    initialValuesProfessionalDetails.txtJoinDate
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Employment Type',
                    initialValuesProfessionalDetails.ddlEmploymentType
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Working Type',
                    initialValuesProfessionalDetails.ddlWorkingType
                  )}
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default ViewProfessionalDetails;
