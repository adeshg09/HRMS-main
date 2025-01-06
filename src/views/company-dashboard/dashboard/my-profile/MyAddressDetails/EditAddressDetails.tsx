/* Imports */
import {
  Box,
  Button,
  Stepper,
  Typography,
  Step,
  StepLabel,
  CardActions,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  MenuItem,
  FormHelperText,
  Checkbox,
  StepConnector,
  Card,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  stepConnectorClasses,
  CardHeader,
  Divider
} from '@mui/material';
import { FieldArray, Form, Formik, FormikHelpers, getIn } from 'formik';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* Relative Imports */
import useSnackbarClose from 'hooks/useSnackbarClose';
import {
  countries,
  employeeAddressDetails,
  employeeEducationDetails,
  employeeEmergencyContactDetails,
  employeePersonalDetails,
  employeeProfessionalDetails,
  toastMessages
} from 'constants/appConstant';
import SessionContext from 'context/SessionContext';

import {
  EditEmployeeAddressDetailsFormValues,
  EditEmployeeEducationDetailsFormValues,
  EditEmployeeEmergencyContactDetailsFormValues,
  EditEmployeeExperienceDetailsFormValues,
  EditEmployeePersonalDetailsFormValues,
  PersonalDetailsValues
} from 'models/company/employee';
import { CustomField, SelectInput, TextInput } from 'components/InputFields';
import {
  getEmployeePersonalDetailsByUserIdRequest,
  updateEmployeePersonalDetailRequest
} from 'services/company/employee/personalDetails';
import { getDate } from 'utility/formatDate';

/* Local Imports */
import Loader from 'components/Loader';
import {
  getEmployeeEmergencyContactDetailsByUserIdRequest,
  saveEmployeeEmergencyContactDetailRequest
} from 'services/company/employee/emergencyContactDetails';
import {
  getEmployeeEducationDetailsByUserIdRequest,
  saveEmployeeEducationDetailRequest
} from 'services/company/employee/educationDetails';
import {
  getEmployeeExperienceDetailsByUserIdRequest,
  SaveEmployeeExperienceDetails
} from 'services/company/employee/experienceDetails';
import {
  getEmployeeAddressDetailsByUserIdRequest,
  saveEmployeeAddressDetailRequest
} from 'services/company/employee/addressDetails';
import styles from './address.style';

interface IEditAddressDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}
/**
 * Component to edit emergency contact information
 *
 * @component
 * @returns {JSX.Element}
 */
const EditAddressDetails = ({
  handleViewMode
}: IEditAddressDetailsProps): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [initialValues, setInitialValues] = useState<
    EditEmployeeAddressDetailsFormValues[]
  >([
    {
      txtId: null,
      ddlAddressType: '',
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
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[] | []>([]);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    addressDetails: Yup.array()
      .of(
        Yup.object().shape({
          ddlAddressType: Yup.string().required(
            'Please select the address type.'
          ),
          txtBuildingName: Yup.string().required(
            'Please enter the building name.'
          ),
          txtFlatNumber: Yup.string().required('Please enter the flat number.'),
          txtStreetName: Yup.string().required('Please enter the street name.'),
          txtLandmark: Yup.string().required('Please enter the landmark'),
          txtCity: Yup.string().required('Please enter the city.'),
          ddlCountry: Yup.string().required('Please select the country.'),
          ddlState: Yup.string().required('Please select the state.'),
          txtPincode: Yup.string()
            .matches(/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode.')
            .required('Please enter the pincode.'),
          txtTelephoneNumber: Yup.string()
            .matches(
              /^[0-9]{10}$/,
              'Please enter a valid 10-digit telephone number.'
            )
            .required('Please enter the Telephone number.'),
          txtPhone: Yup.string()
            .matches(
              /^[0-9]{10}$/,
              'Please enter a valid 10-digit phone number.'
            )
            .required('Please enter the phone number.')
        })
      )
      .min(1, 'Please add at least one address.')
  });

  const getEmployeeAddressDetails = async (): Promise<void> => {
    setLoading(true);
    const response = await getEmployeeAddressDetailsByUserIdRequest(
      Number(user?.id)
    );
    console.log('res is', response);
    const addressData = response?.employeeAddresses;
    if (addressData?.length) {
      const formatteddata = addressData.map((address: any) => ({
        txtId: address.id,
        ddlAddressType: address.address_type,
        txtBuildingName: address.building_name,
        txtFlatNumber: address.flat_number,
        txtStreetName: address.street_name,
        txtLandmark: address.landmark,
        txtCity: address.city,
        ddlCountry: address.country,
        ddlState: address.state,
        txtPincode: address.pincode,
        txtTelephoneNumber: address.telephone_number,
        txtPhone: address.phone
      }));
      setInitialValues(formatteddata);
    }
    setLoading(false);
  };

  /**
   * function to handle country change
   * @return {void}
   */
  const handleCountryChange = (countryCode: string): void => {
    const selectedCountry = countries.find((x) => x.alpha2Code === countryCode);
    setStates(selectedCountry ? selectedCountry.states : []);
  };

  /**
   * Submit function to save/update user with backend action
   * @param {UserFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */

  const handleFormSubmit = async (
    values: {
      addressDetails: EditEmployeeAddressDetailsFormValues[];
    },
    { setSubmitting }: any
  ): Promise<void> => {
    try {
      if (!user.id) {
        throw new Error('User ID not found');
      }

      const requestData = values.addressDetails.map((detail) => {
        // Create base contact data
        const baseContact = {
          addressType: detail.ddlAddressType,
          buildingName: detail.txtBuildingName,
          flatNumber: detail.txtFlatNumber,
          streetName: detail.txtStreetName,
          landmark: detail.txtLandmark,
          city: detail.txtCity,
          state: detail.ddlState,
          pincode: detail.txtPincode,
          telephoneNumber: detail.txtTelephoneNumber,
          phone: detail.txtPhone,
          userId: user.id
        };

        // If id exists, include it in the object
        if (detail.txtId !== null) {
          return {
            ...baseContact,
            id: detail.txtId
          };
        }

        // Return base contact without id for new contacts
        return baseContact;
      });

      console.log('req data is', requestData);

      const response = await saveEmployeeAddressDetailRequest({
        employeeAddresses: requestData
      });

      if (response?.status.response_code === 200) {
        handleViewMode(false);
        showSnackbar(
          toastMessages.success.adminDashboard.employee
            .employeeAddressDetailsUpdated,
          'success'
        );
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getEmployeeAddressDetails();
    }
  }, [user?.id]);

  return (
    <Formik
      enableReinitialize
      initialValues={{ addressDetails: initialValues }}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        setFieldValue
      }) => (
        <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <Box>
            <Card sx={styles.profileCard}>
              <CardHeader
                subheader="Please change the below details to update address details."
                title="Edit Address Details"
                sx={styles.cardHeaderEdit}
                titleTypographyProps={{ variant: 'h3', component: 'h3' }}
              />
              <Divider />
              {!loading ? (
                <CardContent>
                  <FieldArray name="addressDetails">
                    {({ push, remove }) => (
                      <div
                        style={{
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            push({
                              txtId: null,
                              ddlAddressType: '',
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
                            });
                          }}
                          sx={{ ml: 80, mb: 2 }}
                        >
                          Add Address
                        </Button>

                        {values.addressDetails.map(
                          (address: any, index: number) => (
                            <Accordion key={index} sx={{ mb: 2 }}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`address-${index}-content`}
                                id={`address-${index}-header`}
                                sx={{
                                  backgroundColor: '#1976d2',
                                  color: 'white'
                                }}
                              >
                                <Grid container alignItems="center" spacing={2}>
                                  <Grid item xs={11}>
                                    <Typography variant="subtitle1">
                                      Address #{index + 1}
                                      {address.ddlAddressType &&
                                        ` - ${address.ddlAddressType}`}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={1}>
                                    {index > 0 && (
                                      <IconButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          remove(index);
                                        }}
                                        size="small"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    )}
                                  </Grid>
                                </Grid>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6} md={6}>
                                    <SelectInput
                                      label="Select Address Type"
                                      name={`addressDetails.${index}.ddlAddressType`}
                                      value={
                                        values.addressDetails[index]
                                          .ddlAddressType
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.ddlAddressType`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.ddlAddressType`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.ddlAddressType`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.ddlAddressType`
                                        )
                                      }
                                    >
                                      <MenuItem value="">- None -</MenuItem>
                                      {employeeAddressDetails.addressType.map(
                                        (option) => (
                                          <MenuItem
                                            key={option.id}
                                            value={option.value}
                                          >
                                            {option.name}
                                          </MenuItem>
                                        )
                                      )}
                                    </SelectInput>
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Building Name"
                                      name={`addressDetails.${index}.txtBuildingName`}
                                      value={
                                        values.addressDetails[index]
                                          .txtBuildingName
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtBuildingName`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.txtBuildingName`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtBuildingName`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.txtBuildingName`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Flat No"
                                      name={`addressDetails.${index}.txtFlatNumber`}
                                      value={
                                        values.addressDetails[index]
                                          .txtFlatNumber
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtFlatNumber`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.txtFlatNumber`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtFlatNumber`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.txtFlatNumber`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Street Name"
                                      name={`addressDetails.${index}.txtStreetName`}
                                      value={
                                        values.addressDetails[index]
                                          .txtStreetName
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtStreetName`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.txtStreetName`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtStreetName`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.txtStreetName`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Landmark"
                                      name={`addressDetails.${index}.txtLandmark`}
                                      value={
                                        values.addressDetails[index].txtLandmark
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtLandmark`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.txtLandmark`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtLandmark`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.txtLandmark`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="City"
                                      name={`addressDetails.${index}.txtCity`}
                                      value={
                                        values.addressDetails[index].txtCity
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtCity`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.txtCity`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtCity`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.txtCity`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <SelectInput
                                      label="Country"
                                      name={`addressDetails.${index}.ddlCountry`}
                                      value={
                                        values.addressDetails[index].ddlCountry
                                      }
                                      onChange={(e) => {
                                        handleChange(e);
                                        handleCountryChange(
                                          e.target.value as string
                                        );
                                      }}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.ddlCountry`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.ddlCountry`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.ddlCountry`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.ddlCountry`
                                        )
                                      }
                                    >
                                      <MenuItem key="-1" value="">
                                        - None -
                                      </MenuItem>
                                      {countries.map((option, i) => (
                                        <MenuItem
                                          key={i}
                                          value={option.alpha2Code}
                                        >
                                          {option.country}
                                        </MenuItem>
                                      ))}
                                    </SelectInput>
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <SelectInput
                                      label="State"
                                      name={`addressDetails.${index}.ddlState`}
                                      value={
                                        values.addressDetails[index].ddlState
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.ddlState`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.ddlState`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.ddlState`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.ddlState`
                                        )
                                      }
                                    >
                                      <MenuItem key="-1" value="">
                                        - None -
                                      </MenuItem>
                                      {states.map((option, i) => (
                                        <MenuItem key={i} value={option}>
                                          {option}
                                        </MenuItem>
                                      ))}
                                    </SelectInput>
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Pincode"
                                      name={`addressDetails.${index}.txtPincode`}
                                      value={
                                        values.addressDetails[index].txtPincode
                                      }
                                      inputProps={{ maxLength: 6 }}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtPincode`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.txtPincode`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtPincode`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.txtPincode`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Telephone No"
                                      name={`addressDetails.${index}.txtTelephoneNumber`}
                                      type="number"
                                      value={
                                        values.addressDetails[index]
                                          .txtTelephoneNumber
                                      }
                                      inputProps={{ maxLength: 10 }}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtTelephoneNumber`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.txtTelephoneNumber`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtTelephoneNumber`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.txtTelephoneNumber`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Mobile No"
                                      name={`addressDetails.${index}.txtPhone`}
                                      type="number"
                                      value={
                                        values.addressDetails[index].txtPhone
                                      }
                                      inputProps={{ maxLength: 10 }}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtPhone`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${index}.txtPhone`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${index}.txtPhone`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${index}.txtPhone`
                                        )
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          )
                        )}
                      </div>
                    )}
                  </FieldArray>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end" p={2}>
                      <LoadingButton
                        type="submit"
                        color="primary"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{ m: 1 }}
                      >
                        {isSubmitting ? 'Please wait...' : 'Update'}
                      </LoadingButton>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => handleViewMode(false)}
                        sx={{ m: 1 }}
                      >
                        {id ? 'Cancel' : 'Back'}
                      </Button>
                    </Box>
                  </Grid>
                </CardContent>
              ) : (
                <Loader />
              )}
            </Card>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default EditAddressDetails;
