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
  AddEmployeePersonalDetailsFormValues,
  PersonalDetailsValues
} from 'models/company/employee';
import { getEmployeePersonalDetailsByUserIdRequest } from 'services/company/employee/personalDetails';
import Loader from 'components/Loader';
import { countries } from 'constants/appConstant';
import styles from './personal.style';

interface IViewPersonalDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// Default empty personal details
const emptyPersonalDetails: AddEmployeePersonalDetailsFormValues = {
  txtBirthDate: '',
  txtAge: 0,
  ddlBirthCountry: '',
  ddlBirthState: '',
  txtBirthLocation: '',
  ddlGender: '',
  ddlMaritalStatus: '',
  txtMarriageDate: '',
  ddlBloodGroup: '',
  txtPanNumber: '',
  txtCaste: '',
  txtReligion: '',
  txtResidence: ''
};

const ViewPersonalDetails = ({
  handleViewMode
}: IViewPersonalDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [initialValuesPersonalDetails, setInitialValuesPersonalDetails] =
    useState<AddEmployeePersonalDetailsFormValues>(emptyPersonalDetails);

  const handleGetPersonalDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeePersonalDetailsByUserIdRequest(
        Number(user?.id)
      );
      const personalDetailsData: PersonalDetailsValues =
        response?.employeePersonalDetail;

      if (personalDetailsData) {
        const country =
          countries.find(
            (x) => x.alpha2Code === personalDetailsData.birth_country?.trim()
          )?.country || '';

        setInitialValuesPersonalDetails({
          txtBirthDate: personalDetailsData.birth_date || '',
          txtAge: personalDetailsData.age || 0,
          ddlBirthCountry: country || '',
          ddlBirthState: personalDetailsData.birth_state || '',
          txtBirthLocation: personalDetailsData.birth_location || '',
          ddlGender: personalDetailsData.gender || '',
          ddlMaritalStatus: personalDetailsData.marital_status || '',
          txtMarriageDate: personalDetailsData.marriage_date || '',
          ddlBloodGroup: personalDetailsData.blood_group || '',
          txtPanNumber: personalDetailsData.pan_number || '',
          txtCaste: personalDetailsData.caste || '',
          txtReligion: personalDetailsData.religion || '',
          txtResidence: personalDetailsData.residence || ''
        });
      } else {
        setInitialValuesPersonalDetails(emptyPersonalDetails);
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      setInitialValuesPersonalDetails(emptyPersonalDetails);
    } finally {
      setLoading(false);
    }
  };

  const viewItem = (title: string, value: any): JSX.Element => (
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
    handleGetPersonalDetails();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
    >
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.profileParent}>
          <CardHeader
            subheader="Please use edit to update personal details."
            title="Personal Details"
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
              Edit Personal Details
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
                    'Birth Date',
                    initialValuesPersonalDetails.txtBirthDate
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem('Age', initialValuesPersonalDetails.txtAge || 0)}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Birth Country',
                    initialValuesPersonalDetails.ddlBirthCountry
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Birth State',
                    initialValuesPersonalDetails.ddlBirthState
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Birth Location',
                    initialValuesPersonalDetails.txtBirthLocation
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem('Gender', initialValuesPersonalDetails.ddlGender)}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Marital Status',
                    initialValuesPersonalDetails.ddlMaritalStatus
                  )}
                </Grid>
                {/* Always show Marriage Date field but with "Not provided" if single or empty */}
                <Grid item xs={12}>
                  {viewItem(
                    'Marriage Date',
                    initialValuesPersonalDetails.txtMarriageDate
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Blood Group',
                    initialValuesPersonalDetails.ddlBloodGroup
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Pan Number',
                    initialValuesPersonalDetails.txtPanNumber
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem('Caste', initialValuesPersonalDetails.txtCaste)}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Religion',
                    initialValuesPersonalDetails.txtReligion
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Residence',
                    initialValuesPersonalDetails.txtResidence
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

export default ViewPersonalDetails;
