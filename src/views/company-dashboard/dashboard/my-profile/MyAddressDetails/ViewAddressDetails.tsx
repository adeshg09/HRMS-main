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
  Home as HomeIcon
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import SessionContext from 'context/SessionContext';
import { EditEmployeeAddressDetailsFormValues } from 'models/company/employee';
import { getEmployeeAddressDetailsByUserIdRequest } from 'services/company/employee/addressDetails';
import { countries } from 'constants/appConstant';
import Loader from 'components/Loader';
import styles from './address.style';

interface IViewAddressDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// Default empty address entry
const emptyAddress: EditEmployeeAddressDetailsFormValues = {
  ddlAddressType: 'permanent',
  txtBuildingName: '',
  txtFlatNumber: '',
  txtStreetName: '',
  txtLandmark: '',
  txtCity: '',
  ddlCountry: '',
  ddlState: '',
  txtPincode: '',
  txtTelephoneNumber: '',
  txtPhone: ''
};

const ViewAddressDetails = ({
  handleViewMode
}: IViewAddressDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);

  /* States */
  const [
    initialValuesAddressDetailsEntries,
    setInitialValuesAddressDetailsEntries
  ] = useState<EditEmployeeAddressDetailsFormValues[]>([emptyAddress]);
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
   * function to get all the users with backend action
   *
   * @returns {void}
   */
  const handleGetAddressDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeAddressDetailsByUserIdRequest(
        Number(user?.id)
      );
      const addressDetailsData: any = response?.employeeAddresses;

      if (addressDetailsData && addressDetailsData.length > 0) {
        setInitialValuesAddressDetailsEntries(
          addressDetailsData.map((address: any) => ({
            ddlAddressType: address.address_type || 'permanent',
            txtBuildingName: address.building_name || '',
            txtFlatNumber: address.flat_number || '',
            txtStreetName: address.street_name || '',
            txtLandmark: address.landmark || '',
            txtCity: address.city || '',
            ddlState: address.state || '',
            txtPincode: address.pincode || '',
            txtTelephoneNumber: address.telephone_number || '',
            txtPhone: address.phone || ''
          }))
        );
      } else {
        // If no data is returned, maintain the default empty entry
        setInitialValuesAddressDetailsEntries([emptyAddress]);
      }
    } catch (error) {
      console.error('Error fetching address details:', error);
      // On error, maintain the default empty entry
      setInitialValuesAddressDetailsEntries([emptyAddress]);
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

  const renderAddressDetailsAccordion = (
    address: EditEmployeeAddressDetailsFormValues,
    index: number
  ): JSX.Element => (
    <Accordion key={index} sx={styles.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        aria-controls={`address-details-${index}-content`}
        id={`address-details-${index}-header`}
        sx={styles.accordionSummary}
      >
        <Typography variant="h6" display="flex" alignItems="center">
          <HomeIcon sx={{ marginRight: '8px' }} />
          {(address.ddlAddressType || 'Permanent').charAt(0).toUpperCase() +
            (address.ddlAddressType || 'Permanent').slice(1)}{' '}
          Address
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <Box sx={styles.accordionDetails}>
          {viewItem('Building Name', address.txtBuildingName)}
          {viewItem('Flat Number', address.txtFlatNumber)}
          {viewItem('Street Name', address.txtStreetName)}
          {viewItem('Landmark', address.txtLandmark)}
          {viewItem('City', address.txtCity)}
          {viewItem('State', address.ddlState)}
          {viewItem('Pincode', address.txtPincode)}
          {viewItem('Telephone Number', address.txtTelephoneNumber)}
          {viewItem('Phone', address.txtPhone)}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    handleGetAddressDetails();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.card}>
          <CardHeader
            subheader="Please use edit to update address details."
            title="Address Details"
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
              Edit Address Details
            </Button>
          </Box>
          <Divider />
          {loading ? (
            <Loader />
          ) : (
            <Box sx={styles.addressDetailsContainer}>
              {initialValuesAddressDetailsEntries.map((address, index) =>
                renderAddressDetailsAccordion(address, index)
              )}
            </Box>
          )}
        </Card>
      </Grid>
    </Box>
  );
};

export default ViewAddressDetails;
