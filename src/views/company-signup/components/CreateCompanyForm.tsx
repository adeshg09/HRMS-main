/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create company Page to add/edit companies.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useEffect, useState, useRef, useContext, FormEvent } from 'react';
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
  Card,
  FormHelperText
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* Relative Imports */
import {
  AddCompanyFormValues,
  ShortPlanDurationModel,
  ShortPlanModel
} from 'models/master';
import { CustomField, SelectInput, TextInput } from 'components/InputFields';
import { AdminDashboardPage, AuthPage } from 'components/Page';
import { AdminFormLayout } from 'components/CardLayout';
import Loader from 'components/Loader';
import { UploadSingleImage } from 'components/InputFields/upload';
import { getPlansRequest } from 'services/master/user/plan';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages, countries } from 'constants/appConstant';
import SessionContext from 'context/SessionContext';
import { apiBaseUrl } from 'config/config';
import { getDomainName } from 'helper/commonHelper';
import { PAGE_ADMIN_DASHBOARD, PAGE_ROOT } from 'routes/paths';
import { registerCompanyRequest } from 'services/master/user/company';
import { getPlanDurationsRequest } from 'services/master/user/planDuration';

/* Local Imports */
import adminStyle from '../index.style';

// ----------------------------------------------------------------------

/* Constants */

// ----------------------------------------------------------------------

const steps = ['Company Details', 'User Details', 'Plan Details'];

const CreateCompany = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const fileUploadRef: any = useRef();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();
  const [states, setStates] = useState<string[] | []>([]);
  // const [numOfMonths, setNumOfMonths] = useState();
  const [activeStep, setActiveStep] = useState(0);
  // const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Array<ShortPlanModel>>([]);
  const [planDuration, setPlanDuration] = useState<
    Array<ShortPlanDurationModel>
  >([]);

  /* Constants */
  const [initialValues, setInitialValues] = useState({
    // txtName: '',
    // txtDisplayName: '',
    // fileLogo: '',
    // txtAddress: '',
    // txtCountry: '',
    // txtState: '',
    // txtCity: '',
    // txtPinCode: '',
    // txtDomainName: '',
    txtName: 'sdf',
    txtDisplayName: 'sadf',
    fileLogo: '',
    txtAddress: '',
    txtCountry: 'AF',
    txtState: 'Badakhshan',
    txtCity: '',
    txtPinCode: '',
    txtDomainName: 'sdf',
    chkIsActive: true,
    txtFirstName: 'sd',
    txtLastName: 'asd',
    txtRegisteredEmail: 'sdf1@g.df',
    txtPassword: 'asdqwe123',
    txtConfirmPassword: 'asdqwe123',
    // txtIpAddress: '',
    chkIsUserActive: true,
    ddlPlan: '',
    ddlPlanDuration: '',
    // txtUserCount: '',
    txtUserCount: 200,
    txtStartDate: '',
    txtEndDate: ''
  } as AddCompanyFormValues);

  const isLastStep = activeStep === steps.length - 1;

  /* Functions */
  // const handleNext = (): void => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  const handleBack = (): void => {
    if (activeStep === 0) {
      // navigate(companyRegisterPath);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  /**
   * @return {void}
   */
  const handleCountryChange = (countryCode: string): void => {
    const selectedCountry = countries.find((x) => x.alpha2Code === countryCode);
    setStates(selectedCountry ? selectedCountry.states : []);
  };

  /**
   * function to get all the plans with backend action
   * @returns {void}
   */
  const handleGetPlans = async (): Promise<any> => {
    try {
      const response = await getPlansRequest();
      if (response && response.status.response_code === 200) {
        setPlans(response.plans);
        console.log(
          response.plans[0].id,
          response.plans?.length > 0 ? response.plans[0].id : ''
        );
        // setInitialValues({
        //   ...initialValues,
        //   ddlPlan: response.plans?.length > 0 ? response.plans[0].id : ''
        // });
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to get all the plan duration with backend action
   *
   * @returns {void}
   */
  const handleGetPlanDurations = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getPlanDurationsRequest();
      if (response?.status.response_code === 200) {
        setPlanDuration(response.plan_durations || []);
        console.log(response.plan_durations[0].no_of_month);
        // setInitialValues({
        //   ...initialValues,
        //   ddlPlanDuration:
        //     response.plan_durations?.length > 0
        //       ? response.plan_durations[0].no_of_month
        //       : ''
        // });
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  const submitForms = (): void => {
    // actions.setSubmitting(false);
    setActiveStep(activeStep + 1);
  };

  /* Functions */
  /**
   * function to get the coupon code by id with backend action
   * @param {string} companyId - id of coupon code to fetch the detail
   * @returns {void}
   */
  // const getCompanyById = async (companyId: string): Promise<void> => {
  //   setLoading(true);
  //   try {
  //     const response = await getCompanyByIdRequest(Number(companyId));
  //     console.log(response);
  //     if (response && response.status.response_code === 200) {
  //       const companyData: CompanyModelTemp = response.company;
  //       const companyCountryAlphaCode =
  //         countries.find((x) => x.country === companyData.country?.trim() || '')
  //           ?.alpha2Code || '';
  //       setInitialValues({
  //         txtName: companyData.name,
  //         txtDisplayName: companyData.display_name,
  //         fileLogo: companyData.logo || '',
  //         txtAddress: companyData.address || '',
  //         // txtCountry: companyData.country || '',
  //         txtCountry: companyCountryAlphaCode,
  //         txtState: companyData.state || '',
  //         txtCity: companyData.city || '',
  //         txtPinCode: companyData.pin_code || '',
  //         txtDomainName: companyData.domain_name,
  //         chkIsActive: companyData.is_active,
  //         txtFirstName: companyData.first_name,
  //         txtLastName: companyData.last_name,
  //         txtRegisteredEmail: companyData.registered_email,
  //         chkIsUserActive: companyData.is_user_active,
  //         ddlPlan: companyData.plan_id?.id || '',
  //         // ddlPlanDuration: companyData.plan_duration || '',
  //         ddlPlanDuration: '',
  //         txtUserCount: companyData.user_count || '',
  //         txtStartDate: companyData.start_date || '',
  //         txtEndDate: companyData.end_date || ''
  //       });
  //       handleCountryChange(companyCountryAlphaCode);
  //     } else {
  //       showSnackbar(toastMessages.error.common, 'error');
  //     }
  //   } catch {
  //     showSnackbar(toastMessages.error.common, 'error');
  //   }
  //   setLoading(false);
  // };

  /**
   * Submit function to save/update company with backend action
   * @param {AddCompanyFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: AddCompanyFormValues,
    { resetForm, setSubmitting }: any
  ): Promise<void> => {
    console.log(values, 'values');
    if (isLastStep) {
      // submitForms();
      try {
        const requestData: any = {
          name: values.txtName.trim(),
          displayName: values.txtDisplayName.trim(),
          logo: values.fileLogo || null,
          address: values.txtAddress.trim(),
          // country: values.txtCountry.trim(),
          country:
            countries.find((x) => x.alpha2Code === values.txtCountry.trim())
              ?.country || '',
          state: values.txtState.trim(),
          city: values.txtCity.trim(),
          pinCode: values.txtPinCode.trim(),
          domainName: values.txtDomainName.trim(),
          isActive: values.chkIsActive,
          firstName: values.txtFirstName,
          lastName: values.txtLastName,
          registeredEmail: values.txtRegisteredEmail.trim(),
          password: values.txtPassword,
          isUserActive: values.chkIsUserActive,
          planId: values.ddlPlan || 0,
          planDuration: values.ddlPlanDuration || 0,
          userCount: values.txtUserCount || 0,
          startDate: values.txtStartDate,
          endDate: values.txtEndDate
        };
        // if (id) {
        //   requestData.modifiedBy = user.id;
        //   const response = await updateCompanyRequest(Number(id), requestData);
        //   if (response?.status.response_code === 200) {
        //     showSnackbar(
        //       toastMessages.success.adminDashboard.companyUpdated,
        //       'success'
        //     );
        //     navigate(manageCompanyPath);
        //   } else if (response?.status.response_code === 206) {
        //     showSnackbar(
        //       toastMessages.error.adminDashboard.companyDuplicate,
        //       'error'
        //     );
        //   } else {
        //     showSnackbar(toastMessages.error.common, 'error');
        //   }
        // } else {
        // requestData.createdBy = user.id;
        const response = await registerCompanyRequest(requestData);
        if (response?.status.response_code === 200) {
          // navigate(manageCompanyPath);
          // navigate(companyRegisterPath);
          setActiveStep(0);

          resetForm();
          // for reset of logo field
          if (fileUploadRef.current?.value !== undefined) {
            fileUploadRef.current.value = '';
          }
          showSnackbar(
            toastMessages.success.public.companyRegistered,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(toastMessages.error.public.companyDuplicate, 'error');
        } else {
          console.log('------343  -----');
          showSnackbar(toastMessages.error.common, 'error');
        }
        // }
      } catch (e) {
        console.log('------347-----', e);
        showSnackbar(toastMessages.error.common, 'error');
      }
    } else {
      setActiveStep(activeStep + 1);
      setSubmitting(false);
    }
  };

  function addMonthsToDate(date: Date, numMonths: number): string {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + numMonths);
    return `${newDate.getDate().toString().padStart(2, '0')}/${(
      newDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${newDate.getFullYear()}`;
  }

  const validationSchema = [
    Yup.object().shape({
      txtName: Yup.string()
        .trim()
        .required('Please enter the company name.')
        .matches(
          /^[a-zA-Z0-9 ]+$/,
          'Please enter only alphabetics and/or numbers.'
        ),
      txtDisplayName: Yup.string()
        .trim()
        .required('Please enter the display name.'),
      txtCountry: Yup.string().trim().required('Please select a country.'),
      txtState: Yup.string().trim().required('Please select a state.'),
      // txtCity: Yup.string().trim().required('Please select a city.'),
      txtPinCode: Yup.number(),
      txtDomainName: Yup.string()
        .trim()
        .required('Please enter the domain name.')
        .matches(
          /^[a-zA-Z0-9_]+$/,
          'Please enter only alphabetics, underscore and/or numbers.'
        )
    }),
    Yup.object().shape({
      txtFirstName: Yup.string()
        .trim()
        .required('Please enter the first name.'),
      txtLastName: Yup.string().trim().required('Please enter the last name.'),
      txtRegisteredEmail: Yup.string()
        .email('Please enter the valid email address.')
        .required('Please enter your registered email address.'),
      // txtPassword: !id
      //   ? Yup.string()
      //       .min(4, 'Please enter minimum 4 characters.')
      //       .max(100, 'Please enter less than 100 characters.')
      //       .required('Please enter new password.')
      //   : Yup.string(),
      txtPassword: Yup.string()
        .min(7, 'Password should be minimum 7 characters.')
        .max(100, 'Password should be maximum 100 characters.')
        .required('Please enter the password.'),
      // txtConfirmPassword: !id
      // ? Yup.string()
      //     .oneOf([Yup.ref('txtPassword'), undefined], 'passwords must match!')
      //     .required('confirm password is required!')
      // : Yup.string()
      txtConfirmPassword: Yup.string()
        .oneOf([Yup.ref('txtPassword'), undefined], 'Passwords must match!')
        .required('Please enter the confirm password.')
    }),
    Yup.object().shape({
      // ddlPlanDuration: Yup.number().required(
      //   'Please select the plan duration.'
      // ),
      // txtUserCount: Yup.number()
      //   .nullable()
      //   .required('Please enter the user count.'),
      // txtStartDate: Yup.string().trim().required('Please enter the start date.'),
      ddlPlan: Yup.number().required('Please select the plan.'),
      ddlPlanDuration: Yup.number()
        // .nullable()
        .when('ddlPlan', {
          is: (v: any) => !!v,
          then: (schema) => schema.required('Please select the plan duration.')
          // then: (schema) =>
          //   schema.nullable().required('Please select the plan duration.'),
          // then: Yup.number().nullable().required('Please select the plan duration.'),
          // otherwise: (schema) => schema.nullable()
        }),
      txtUserCount: Yup.number()
        // .nullable()
        .when('ddlPlan', {
          is: (v: any) => !!v,
          then: (schema) =>
            schema
              .positive('Please enter valid user count.')
              .required('Please enter the user count.')
        }),
      txtStartDate: Yup.string().when('ddlPlan', {
        is: (v: any) => !!v,
        then: (schema) => schema.required('Please enter the start date.')
      })
    })
  ];
  const currentValidationSchema = validationSchema[activeStep];

  useEffect(() => {
    handleGetPlans();
    handleGetPlanDurations();
  }, []);

  useEffect(() => {
    if (plans?.length && planDuration?.length) {
      setInitialValues({
        ...initialValues,
        ddlPlan: plans[0].id,
        ddlPlanDuration: planDuration[0].no_of_month
      });
    }
  }, [plans?.length, planDuration?.length]);

  return (
    <Box sx={{ width: '100%' }}>
      <>
        {/* <AdminDashboardPage title="Manage Companies"> */}
        <AuthPage title="Company SignUp">
          {!loading ? (
            <AdminFormLayout
              // title="Company Sign Up"
              title="Register Company"
              // subtitle="Please fill the below details to create new company."
              subtitle="Please fill the below details to register your company."
            >
              <>
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validationSchema={currentValidationSchema}
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
                    isValid,
                    setFieldValue
                  }) => (
                    <>
                      <Form autoComplete="off" onSubmit={handleSubmit}>
                        <Stepper activeStep={activeStep} sx={{ mt: 2, p: 2 }}>
                          {steps.map((label, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                              optional?: React.ReactNode;
                            } = {};

                            return (
                              <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                              </Step>
                            );
                          })}
                        </Stepper>
                        {activeStep === 0 && (
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Company Name"
                                  name="txtName"
                                  value={values.txtName}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={(e) => {
                                    if (!values.txtDomainName) {
                                      setFieldValue(
                                        'txtDomainName',
                                        getDomainName(e.target.value)
                                      );
                                    }
                                    handleBlur(e);
                                  }}
                                  error={Boolean(
                                    touched.txtName && errors.txtName
                                  )}
                                  helperText={String(
                                    touched.txtName && errors.txtName
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Display Name"
                                  name="txtDisplayName"
                                  value={values.txtDisplayName}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtDisplayName &&
                                      errors.txtDisplayName
                                  )}
                                  helperText={String(
                                    touched.txtDisplayName &&
                                      errors.txtDisplayName
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={12}>
                                <TextInput
                                  multiline
                                  label="Address"
                                  name="txtAddress"
                                  value={values.txtAddress}
                                  rows={2}
                                  inputProps={{ maxLength: 1000 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtAddress && errors.txtAddress
                                  )}
                                  helperText={String(
                                    touched.txtAddress && errors.txtAddress
                                  )}
                                  sx={adminStyle.textMultilineInputStyle}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <SelectInput
                                  label="Select Country"
                                  name="txtCountry"
                                  value={values.txtCountry}
                                  onChange={(e) => {
                                    handleChange(e);
                                    handleCountryChange(
                                      e.target.value as string
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtCountry && errors.txtCountry
                                  )}
                                  helperText={String(
                                    touched.txtCountry && errors.txtCountry
                                  )}
                                >
                                  <MenuItem key="-1" value="">
                                    - None -
                                  </MenuItem>
                                  {countries.map((option, i) => (
                                    <MenuItem key={i} value={option.alpha2Code}>
                                      {option.country}
                                    </MenuItem>
                                  ))}
                                </SelectInput>
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <SelectInput
                                  label="Select State"
                                  name="txtState"
                                  value={values.txtState}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtState && errors.txtState
                                  )}
                                  helperText={String(
                                    touched.txtState && errors.txtState
                                  )}
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
                                  label="City"
                                  name="txtCity"
                                  value={values.txtCity}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtCity && errors.txtCity
                                  )}
                                  helperText={String(
                                    touched.txtCity && errors.txtCity
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Pincode"
                                  name="txtPinCode"
                                  value={values.txtPinCode}
                                  inputProps={{ maxLength: 6 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtPinCode && errors.txtPinCode
                                  )}
                                  helperText={String(
                                    touched.txtPinCode && errors.txtPinCode
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  // disabled={!!id}
                                  label="Domain Name"
                                  name="txtDomainName"
                                  value={values.txtDomainName}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtDomainName &&
                                      errors.txtDomainName
                                  )}
                                  helperText={String(
                                    touched.txtDomainName &&
                                      errors.txtDomainName
                                  )}
                                />
                                {/* {!id && ( */}
                                <FormHelperText>
                                  Domain name can't be changed, choose wisely!
                                </FormHelperText>
                                {/* )} */}
                              </Grid>
                              {/* <Grid
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <CustomField
                                  name="fileLogo"
                                  label="Upload File"
                                >
                                  <Box
                                    component="input"
                                    type="file"
                                    ref={fileUploadRef}
                                    onChange={(event: any) => {
                                      setFieldValue(
                                        'fileLogo',
                                        event.currentTarget.files[0]
                                      );
                                    }}
                                  />
                                </CustomField>
                              </Grid> */}
                              <Grid item xs={12} sm={6} md={6}>
                                <CustomField
                                  name="fileLogo"
                                  label="Upload Logo"
                                >
                                  <UploadSingleImage
                                    label="Upload"
                                    file={values.fileLogo}
                                    onFileChange={(val) => {
                                      setFieldValue('fileLogo', val);
                                    }}
                                    // aspectRatio={239 / 60}
                                    aspectRatio={240 / 80}
                                  />
                                </CustomField>
                              </Grid>
                              <Grid item xs={12} sm={12} md={12}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      name="chkIsActive"
                                      checked={values.chkIsActive}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  }
                                  label={
                                    <Typography variant="body2" ml={2}>
                                      Is Active
                                    </Typography>
                                  }
                                  sx={adminStyle.formControlLabel}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        )}
                        {activeStep === 1 && (
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="First Name"
                                  name="txtFirstName"
                                  value={values.txtFirstName}
                                  inputProps={{ maxLength: 50 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtFirstName && errors.txtFirstName
                                  )}
                                  helperText={String(
                                    touched.txtFirstName && errors.txtFirstName
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Last Name"
                                  name="txtLastName"
                                  value={values.txtLastName}
                                  inputProps={{ maxLength: 50 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtLastName && errors.txtLastName
                                  )}
                                  helperText={String(
                                    touched.txtLastName && errors.txtLastName
                                  )}
                                />
                              </Grid>
                              {/* {!id && (
                                <> */}
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Password"
                                  name="txtPassword"
                                  type="password"
                                  value={values.txtPassword}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtPassword && errors.txtPassword
                                  )}
                                  helperText={String(
                                    touched.txtPassword && errors.txtPassword
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Confirm Password"
                                  name="txtConfirmPassword"
                                  type="password"
                                  value={values.txtConfirmPassword}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtConfirmPassword &&
                                      errors.txtConfirmPassword
                                  )}
                                  helperText={String(
                                    touched.txtConfirmPassword &&
                                      errors.txtConfirmPassword
                                  )}
                                />
                              </Grid>
                              {/* </>
                              )} */}
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  // disabled={!!id}
                                  label="Registered Email"
                                  name="txtRegisteredEmail"
                                  value={values.txtRegisteredEmail}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtRegisteredEmail &&
                                      errors.txtRegisteredEmail
                                  )}
                                  helperText={String(
                                    touched.txtRegisteredEmail &&
                                      errors.txtRegisteredEmail
                                  )}
                                />
                              </Grid>

                              <Grid item xs={12} sm={12} md={12}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      name="chkIsUserActive"
                                      checked={values.chkIsUserActive}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  }
                                  label={
                                    <Typography variant="body2" ml={2}>
                                      Is User Active
                                    </Typography>
                                  }
                                  sx={adminStyle.formControlLabel}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        )}
                        {activeStep === 2 && (
                          <>
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    disabled
                                    label="Select Plan"
                                    name="ddlPlan"
                                    value={values.ddlPlan}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlPlan && errors.ddlPlan
                                    )}
                                    helperText={String(
                                      touched.ddlPlan && errors.ddlPlan
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {plans.map((option: ShortPlanModel) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {option.name}
                                      </MenuItem>
                                    ))}
                                  </SelectInput>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    disabled
                                    // disabled={!!id}
                                    label="Select Plan Duration"
                                    name="ddlPlanDuration"
                                    value={values.ddlPlanDuration}
                                    onChange={(e: any) => {
                                      const duration = e.target.value;
                                      setFieldValue(
                                        'ddlPlanDuration',
                                        duration
                                      );
                                      if (duration && values.txtStartDate) {
                                        const endDateTest = addMonthsToDate(
                                          new Date(values.txtStartDate),
                                          duration
                                        );
                                        // setFieldValue(
                                        //   'txtEndDate',
                                        //   moment(
                                        //     endDateTest,
                                        //     'DD/MM/YYYY'
                                        //   ).format('MM/DD/YYYY')
                                        // );
                                        setFieldValue(
                                          'txtEndDate',
                                          moment(
                                            endDateTest,
                                            'DD/MM/YYYY'
                                          ).toDate()
                                        );
                                      }
                                    }}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlPlanDuration &&
                                        errors.ddlPlanDuration
                                    )}
                                    helperText={String(
                                      touched.ddlPlanDuration &&
                                        errors.ddlPlanDuration
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {planDuration.map(
                                      (option: ShortPlanDurationModel) => (
                                        <MenuItem
                                          key={option.id}
                                          value={option.no_of_month}
                                        >
                                          {`${option.no_of_month} ${
                                            option.no_of_month < 1
                                              ? 'Month'
                                              : 'Months'
                                          }`}
                                        </MenuItem>
                                      )
                                    )}
                                  </SelectInput>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    disabled
                                    fullWidth
                                    label="User Count"
                                    name="txtUserCount"
                                    type="number"
                                    value={values.txtUserCount}
                                    // inputProps={{ min: 1, defaultValue: 200 }}
                                    inputProps={{ min: 1 }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtUserCount &&
                                        errors.txtUserCount
                                    )}
                                    helperText={String(
                                      touched.txtUserCount &&
                                        errors.txtUserCount
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      // minDate={new Date().toString()}
                                      // disabled={!!id}
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtStartDate}
                                      onChange={(date: any) => {
                                        setFieldValue('txtStartDate', date);
                                        if (date !== null) {
                                          if (values.ddlPlanDuration) {
                                            const endDateTest = addMonthsToDate(
                                              date,
                                              values.ddlPlanDuration
                                            );
                                            // setFieldValue(
                                            //   'txtEndDate',
                                            //   moment(
                                            //     endDateTest,
                                            //     'DD/MM/YYYY'
                                            //   ).format('MM/DD/YYYY')
                                            // );
                                            setFieldValue(
                                              'txtEndDate',
                                              moment(
                                                endDateTest,
                                                'DD/MM/YYYY'
                                              ).toDate()
                                            );
                                          }
                                        }
                                      }}
                                      renderInput={(params: any) => (
                                        <CustomField
                                          name="txtStartDate"
                                          label="Start Date"
                                          error={Boolean(
                                            touched.txtStartDate &&
                                              errors.txtStartDate
                                          )}
                                          helperText={String(
                                            touched.txtStartDate &&
                                              errors.txtStartDate
                                          )}
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name="txtStartDate"
                                            // label="Start Date"
                                            value={values.txtStartDate}
                                            error={Boolean(
                                              touched.txtStartDate &&
                                                errors.txtStartDate
                                            )}
                                          />
                                        </CustomField>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      disabled
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtEndDate}
                                      onChange={handleChange}
                                      renderInput={(params: any) => (
                                        <CustomField
                                          name="txtEndDate"
                                          label="End Date"
                                          error={Boolean(
                                            touched.txtEndDate &&
                                              errors.txtEndDate
                                          )}
                                          helperText={String(
                                            touched.txtEndDate &&
                                              errors.txtEndDate
                                          )}
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name="txtEndDate"
                                            // label="End Date"
                                            value={values.txtEndDate}
                                            error={Boolean(
                                              touched.txtEndDate &&
                                                errors.txtEndDate
                                            )}
                                          />
                                        </CustomField>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </>
                        )}
                        <CardActions>
                          <Button
                            color="secondary"
                            variant="contained"
                            // disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{
                              mr: 1,
                              display: activeStep === 0 ? 'none' : 'block'
                            }}
                          >
                            {/* {id && activeStep === 0 ? 'Cancel' : 'Back'} */}
                            Back
                          </Button>
                          <Box sx={{ flex: '1 1 auto' }} />

                          <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {activeStep === steps.length - 1 ? 'Save' : 'Next'}
                          </Button>
                        </CardActions>
                      </Form>
                    </>
                  )}
                </Formik>
              </>
            </AdminFormLayout>
          ) : (
            <Loader />
          )}
        </AuthPage>
        {/* </AdminDashboardPage> */}
      </>
    </Box>
  );
};

export default CreateCompany;
