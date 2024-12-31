/* Imports */
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldArray, Form, Formik, FormikHelpers, getIn } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
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
  stepConnectorClasses
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/* Relative Imports */
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import useSnackbarClose from 'hooks/useSnackbarClose';
import Loader from 'components/Loader';
import {
  AddEmployeeAddressDetailsFormValues,
  AddEmployeeDetailsFormValues,
  AddEmployeeDocumentsFormValues,
  AddEmployeeEducationDetailsFormValues,
  AddEmployeeEmergencyContactDetailsFormValues,
  AddEmployeeExperienceDetailsFormValues,
  AddEmployeeFamilyDetailsFormValues,
  AddEmployeePersonalDetailsFormValues,
  AddEmployeeProfessionalDetailsFormValues,
  AddUserFormValues,
  PersonalDetailsValues,
  ProfessionalDetailsValues,
  UserValues
} from 'models/company/employee';
import {
  RoleModel,
  ShortDesignationModel,
  ShortRoleModel
} from 'models/company';
import {
  countries,
  employeeAddressDetails,
  employeeEducationDetails,
  employeeEmergencyContactDetails,
  employeeFamilyDetails,
  employeePersonalDetails,
  employeeProfessionalDetails,
  toastMessages
} from 'constants/appConstant';
import { getDesignationsRequest } from 'services/company/designation';
import {
  getEmployeePersonalDetailsByUserIdRequest,
  insertEmployeePersonalDetailRequest,
  updateEmployeePersonalDetailRequest
} from 'services/company/employee/personalDetails';
import { AdminDashboardPage } from 'components/Page';
import {
  getUserByIdRequest,
  registerUserRequest,
  updateUserRequest
} from 'services/company/employee/accountSetup';
import {
  getEmployeeProfessionalDetailsByUserIdRequest,
  insertEmployeeProfessionalDetailRequest,
  updateEmployeeProfessionalDetailRequest
} from 'services/company/employee/professionalDetails';
import {
  getEmployeeFamilyDetailsByUserIdRequest,
  insertEmployeeFamilyDetailRequest,
  updateEmployeeFamilyDetailRequest
} from 'services/company/employee/familyDetails';
import {
  getEmployeeEmergencyContactDetailsByUserIdRequest,
  insertEmployeeEmergencyContactDetailRequest,
  updateEmployeeEmergencyContactDetailRequest
} from 'services/company/employee/emergencyContactDetails';
import {
  getEmployeeAddressDetailsByUserIdRequest,
  insertEmployeeAddressDetailRequest,
  updateEmployeeAddressDetailRequest
} from 'services/company/employee/addressDetails';
import {
  getEmployeeEducationDetailsByUserIdRequest,
  insertEmployeeEducationalDetailRequest,
  updateEmployeeEducationalDetailRequest
} from 'services/company/employee/educationDetails';
import {
  getEmployeeExperienceDetailsByUserIdRequest,
  insertEmployeeExperienceDetailRequest,
  updateEmployeeExperienceDetailRequest
} from 'services/company/employee/experienceDetails';
import { AdminFormLayout } from 'components/CardLayout';
import {
  AutoCompleteInput,
  CustomField,
  SelectInput,
  TextInput
} from 'components/InputFields';
import { getRolesRequest } from 'services/company/role';

/* Local Imports */

import { getDate } from 'utility/formatDate';
import { ALLOWED_FILE_FORMATS } from 'components/InputFields/upload/UploadSingleFile';
import { DocumentModel } from 'models/company/DocumentType';
import { getDocumentType } from 'services/company/employee/documentTypeDetails';
import { getEmployeeDocumentDetailsByUserIdRequest } from 'services/company/employee/documentUpload';
import adminStyle from '../../company.style';
import DocumentUploadStep from './DocumentUploadStep';

/* Constants */
const manageEmployeePath = PAGE_COMPANY_DASHBOARD.employees.absolutePath;

const steps = [
  'Create User',
  'Personal Details',
  'Professional Details',
  'Address Details',
  'Family Details',
  'Educational Details',
  'Emergency Contact Details',
  'Experience Details',
  'Document Details'
];

const EditEmployee = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [states, setStates] = useState<string[] | []>([]);
  const [designations, setDesignations] = useState<
    Array<ShortDesignationModel>
  >([]);
  const [roles, setRoles] = useState<Array<RoleModel>>([]);
  const [documentTypes, setDocumentTypes] = useState<Array<DocumentModel>>([]);
  const [activeStep, setActiveStep] = useState(8);
  const [completedSteps, setCompletedSteps] = useState<{
    [key: number]: boolean;
  }>({});
  const [savedStepData, setSavedStepData] = useState<{ [key: number]: any }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  /* Constants */
  const [initialValuesCreateUser, setInitialValuesCreateUser] = useState({
    txtFirstName: '',
    txtLastName: '',
    txtEmail: '',
    txtPassword: '',
    ddlRoles: [],
    chkIsActive: true,
    chkShowActivity: true
  } as AddUserFormValues);

  const [initialValuesPersonalDetails, setInitialValuesPersonalDetails] =
    useState({
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
    } as AddEmployeePersonalDetailsFormValues);

  const [
    initialValuesProfessionalDetails,
    setInitialValuesProfessionalDetails
  ] = useState({
    txtEmployeeCode: '',
    ddlDesignation: '',
    txtJoinDate: '',
    ddlEmploymentType: '',
    ddlWorkingType: ''
  } as AddEmployeeProfessionalDetailsFormValues);

  const [
    initialValuesAddressDetailsEntries,
    setInitialValuesAddressDetailsEntries
  ] = useState({
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
  } as AddEmployeeAddressDetailsFormValues);

  const [
    initialValuesFamilyDetailsEntries,
    setInitialValuesFamilyDetailsEntries
  ] = useState({
    ddlRelationType: '',
    txtName: '',
    txtAge: '',
    txtBirthDate: '',
    txtCurrentAddress: '',
    ddlBirthCountry: '',
    ddlBirthState: '',
    txtBirthLocation: '',
    txtOccupation: '',
    txtPhone: ''
  } as AddEmployeeFamilyDetailsFormValues);

  const [
    initialValuesEducationDetailsEntries,
    setInitialValuesEducationDetailsEntries
  ] = useState({
    ddlCourse: '',
    txtDegreeSpecialization: '',
    txtInstituteName: '',
    txtFromDate: '',
    txtToDate: '',
    ddlStatus: '',
    ddlStudyMode: '',
    txtPercentage: ''
  } as AddEmployeeEducationDetailsFormValues);

  const [
    initialValuesEmergencyContactDetailsEntries,
    setInitialValuesEmergencyContactDetailsEntries
  ] = useState({
    txtContactName: '',
    txtContactAddress: '',
    ddlContactRelation: '',
    txtPhone: ''
  } as AddEmployeeEmergencyContactDetailsFormValues);

  const [
    initialValuesExperienceDetailsEntries,
    setInitialValuesExperienceDetailsEntries
  ] = useState({
    txtCompanyName: '',
    txtEmployeeId: '',
    txtJobTitle: '',
    txtStartDate: '',
    txtEndDate: '',
    ddlCountry: '',
    txtCity: '',
    ddlState: '',
    ddlEmploymentType: '',
    txtSupervisorName: '',
    txtSupervisorPhone: ''
  } as AddEmployeeExperienceDetailsFormValues);

  const [
    initialValuesDocumentDetailsEntries,
    setInitialValuesDocumentDetailsEntries
  ] = useState({
    documentTypeId: 0,
    employeeDocument: ''
  } as AddEmployeeDocumentsFormValues);

  const initialValues: AddEmployeeDetailsFormValues = {
    ...initialValuesCreateUser,
    ...initialValuesPersonalDetails,
    ...initialValuesProfessionalDetails,
    addressDetails: [initialValuesAddressDetailsEntries],
    familyDetails: [initialValuesFamilyDetailsEntries],
    educationDetails: [initialValuesEducationDetailsEntries],
    emergencyContactDetails: [initialValuesEmergencyContactDetailsEntries],
    experienceDetails: [initialValuesExperienceDetailsEntries],
    documentDetails: [initialValuesDocumentDetailsEntries]
  };
  const isLastStep = activeStep === steps.length - 1;

  /* Functions */
  /**
   * function to go back
   * @return {void}
   */
  const handleBack = (): void => {
    if (activeStep === 0) {
      navigate(manageEmployeePath);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
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
   * function to get all the designation with backend action
   * @return {void}
   */
  const handleGetDesignations = async (): Promise<void> => {
    try {
      const response = await getDesignationsRequest();
      if (response && response.status.response_code === 200) {
        setDesignations(response.designations);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to get all the roles with backend action
   * @returns {void}
   */
  const handleGetRoles = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getRolesRequest();
      if (response && response.status.response_code === 200) {
        setRoles(response.roles);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get all the available document types with backend action
   * @returns {void}
   */
  const handleGetDocumentTypes = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getDocumentType();
      if (response && response.status.response_code === 200) {
        setDocumentTypes(response.documentTypes);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  const isEqual = (obj1: any, obj2: any): boolean => {
    // Handle null/undefined cases
    if (obj1 === obj2) return true;
    if (!obj1 || !obj2) return false;

    // Normalize arrays (especially for roleIds)
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;
      return obj1.every((item, index) => isEqual(item, obj2[index]));
    }

    // Handle object comparison
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      const keys1 = Object.keys(obj1).filter((key) => obj1[key] !== undefined);
      const keys2 = Object.keys(obj2).filter((key) => obj2[key] !== undefined);

      // Check if object has prototype properties that need to be ignored
      if (keys1.includes('[[Prototype]]') || keys2.includes('[[Prototype]]')) {
        return true;
      }

      if (keys1.length !== keys2.length) return false;

      return keys1.every((key) => {
        // Special handling for roleIds
        if (key === 'roleIds') {
          const roles1 =
            typeof obj1[key] === 'string' ? JSON.parse(obj1[key]) : obj1[key];
          const roles2 =
            typeof obj2[key] === 'string' ? JSON.parse(obj2[key]) : obj2[key];
          return isEqual(roles1, roles2);
        }
        return isEqual(obj1[key], obj2[key]);
      });
    }

    // Handle primitive values
    return obj1 === obj2;
  };

  const getStepData = (
    values: AddEmployeeDetailsFormValues,
    step: number
  ): any => {
    switch (step) {
      case 0:
        return {
          txtFirstName: values.txtFirstName,
          txtLastName: values.txtLastName,
          txtEmail: values.txtEmail,
          txtPassword: values.txtPassword,
          ddlRoles: values.ddlRoles,
          chkIsActive: values.chkIsActive,
          chkShowActivity: values.chkShowActivity
        };
      case 1:
        return {
          txtBirthDate: values.txtBirthDate,
          txtAge: values.txtAge,
          ddlBirthCountry: values.ddlBirthCountry,
          ddlBirthState: values.ddlBirthState,
          txtBirthLocation: values.txtBirthLocation,
          ddlGender: values.ddlGender,
          ddlMaritalStatus: values.ddlMaritalStatus,
          txtMarriageDate: values.txtMarriageDate,
          ddlBloodGroup: values.ddlBloodGroup,
          txtPanNumber: values.txtPanNumber,
          txtCaste: values.txtCaste,
          txtReligion: values.txtReligion,
          txtResidence: values.txtResidence
        };
      case 2:
        return {
          txtEmployeeCode: values.txtEmployeeCode,
          ddlDesignation: values.ddlDesignation,
          txtJoinDate: values.txtJoinDate,
          ddlEmploymentType: values.ddlEmploymentType,
          ddlWorkingType: values.ddlWorkingType
        };
      case 3:
        return { addressDetails: values.addressDetails };
      case 4:
        return { familyDetails: values.familyDetails };
      case 5:
        return { educationDetails: values.educationDetails };
      case 6:
        return { emergencyContactDetails: values.emergencyContactDetails };
      case 7:
        return { experienceDetails: values.experienceDetails };
      case 8:
        return { documentDetails: values.documentDetails };
      default:
        return {};
    }
  };

  // Helper function to normalize keys for comparison
  const normalizeKeys = (obj: any): any => {
    const normalized: any = {};

    Object.keys(obj).forEach((key) => {
      // Remove 'txt', 'ddl', 'chk' prefixes
      let normalizedKey =
        key
          .replace(/^txt/, '')
          .replace(/^ddl/, '')
          .replace(/^chk/, '')
          // Convert to camelCase if it isn't already
          .charAt(0)
          .toLowerCase() + key.slice(1);

      // Special case for roleIds
      if (normalizedKey === 'roles') normalizedKey = 'roleIds';

      normalized[normalizedKey] = obj[key];
    });

    return normalized;
  };

  /**
   * Submit function to save Employee Details based on Details type with backend action
   * @param {AddEmployeeDetailsFormValues} values - input values of form
   * @param {object} {setSubmitting} - function to check submission
   * @return {void}
   */

  const handleFormSubmit = async (
    values: AddEmployeeDetailsFormValues,
    { setSubmitting }: FormikHelpers<AddEmployeeDetailsFormValues>
  ): Promise<void> => {
    try {
      let response;

      if (activeStep === 0) {
        const requestDataUserForm: any = {
          firstName: values.txtFirstName,
          lastName: values.txtLastName,
          email: values.txtEmail,
          password: values.txtPassword,
          phone: values.txtPhone,
          roleIds: JSON.stringify(values.ddlRoles),
          isActive: values.chkIsActive,
          showActivity: values.chkShowActivity
        };

        if (completedSteps[0]) {
          response = await updateUserRequest(userId, requestDataUserForm);
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 0: true }));
          setSavedStepData((prev) => ({ ...prev, 0: requestDataUserForm }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[0]
              ? toastMessages.success.adminDashboard.userUpdated
              : toastMessages.success.adminDashboard.userSaved,
            'success'
          );
        } else if (response?.status.response_code === 205) {
          showSnackbar(
            toastMessages.error.adminDashboard.userDuplicate,
            'error'
          );
        } else if (response?.status.response_code === 209) {
          showSnackbar(
            toastMessages.error.adminDashboard.companyUserExceed,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else if (activeStep === 1) {
        const requestDataEmployeePersonalDetails: any = {
          birthDate: values.txtBirthDate,
          age: values.txtAge,
          birthCountry: values.ddlBirthCountry,
          birthState: values.ddlBirthState,
          birthLocation: values.txtBirthLocation,
          gender: values.ddlGender,
          maritalStatus: values.ddlMaritalStatus,
          bloodGroup: values.ddlBloodGroup,
          panNumber: values.txtPanNumber,
          caste: values.txtCaste,
          religion: values.txtReligion,
          residence: values.txtResidence
        };

        if (values.ddlMaritalStatus !== 'single') {
          requestDataEmployeePersonalDetails.marriageDate =
            values.txtMarriageDate;
        }

        if (completedSteps[1]) {
          response = await updateEmployeePersonalDetailRequest(
            userId,
            requestDataEmployeePersonalDetails
          );
        } else {
          requestDataEmployeePersonalDetails.userId = userId;
          response = await insertEmployeePersonalDetailRequest(
            requestDataEmployeePersonalDetails
          );
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 1: true }));
          setSavedStepData((prev) => ({
            ...prev,
            1: requestDataEmployeePersonalDetails
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[1]
              ? toastMessages.success.adminDashboard.employee
                  .employeePersonalDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeePersonalDetailsSaved,
            'success'
          );
        }
      } else if (activeStep === 2) {
        const requestDataProfessionalDetails: any = {
          employeeCode: values.txtEmployeeCode,
          designationId: values.ddlDesignation,
          joinDate: values.txtJoinDate,
          employmentType: values.ddlEmploymentType,
          workingType: values.ddlWorkingType
        };

        if (completedSteps[2]) {
          response = await updateEmployeeProfessionalDetailRequest(
            userId,
            requestDataProfessionalDetails
          );
        } else {
          requestDataProfessionalDetails.userId = userId;
          response = await insertEmployeeProfessionalDetailRequest(
            requestDataProfessionalDetails
          );
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 2: true }));
          setSavedStepData((prev) => ({
            ...prev,
            2: requestDataProfessionalDetails
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[2]
              ? toastMessages.success.adminDashboard.employee
                  .employeeProfessionalDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeProfessionalDetailsSaved,
            'success'
          );
        }
      } else if (activeStep === 4) {
        const reqDataFamilyDetails: any = values.familyDetails.map(
          (detail) => ({
            relationType: detail.ddlRelationType,
            name: detail.txtName,
            age: detail.txtAge,
            birthDate: detail.txtBirthDate,
            currentAddress: detail.txtCurrentAddress,
            birthCountry: detail.ddlBirthCountry,
            birthState: detail.ddlBirthState,
            birthLocation: detail.txtBirthLocation,
            occupation: detail.txtOccupation,
            phone: detail.txtPhone
          })
        );

        if (completedSteps[4]) {
          // For update, pass userId separately (without it in familyDetails objects)
          response = await updateEmployeeFamilyDetailRequest(
            userId,
            reqDataFamilyDetails
          );
        } else {
          // For insert, include userId in each family detail object
          response = await insertEmployeeFamilyDetailRequest({
            familyDetails: reqDataFamilyDetails.map((detail: any) => ({
              ...detail,
              userId
            }))
          });
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 4: true }));
          setSavedStepData((prev) => ({
            ...prev,
            4: reqDataFamilyDetails
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[4]
              ? toastMessages.success.adminDashboard.employee
                  .employeeFamilyDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeFamilyDetailsSaved,
            'success'
          );
        }
      } else if (activeStep === 5) {
        const requestDataEducationDetails: any = values.educationDetails.map(
          (detail) => ({
            course: detail.ddlCourse,
            degreeSpecialization: detail.txtDegreeSpecialization,
            instituteName: detail.txtInstituteName,
            fromDate: detail.txtFromDate,
            toDate: detail.txtToDate,
            status: detail.ddlStatus,
            studyMode: detail.ddlStudyMode,
            percentage: detail.txtPercentage
          })
        );

        if (completedSteps[5]) {
          response = await updateEmployeeEducationalDetailRequest(
            userId,
            requestDataEducationDetails
          );
        } else {
          response = await insertEmployeeEducationalDetailRequest({
            educationalDetails: requestDataEducationDetails.map(
              (detail: any) => ({
                ...detail,
                userId
              })
            )
          });
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 5: true }));
          setSavedStepData((prev) => ({
            ...prev,
            5: requestDataEducationDetails
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[5]
              ? toastMessages.success.adminDashboard.employee
                  .employeeEducationDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeEducationDetailsSaved,
            'success'
          );
        }
      } else if (activeStep === 6) {
        const requestDataEmergencyContacts: any =
          values.emergencyContactDetails.map((contact) => ({
            contactName: contact.txtContactName,
            contactAddress: contact.txtContactAddress,
            contactRelation: contact.ddlContactRelation,
            phone: contact.txtPhone
          }));

        if (completedSteps[6]) {
          response = await updateEmployeeEmergencyContactDetailRequest(
            userId,
            requestDataEmergencyContacts
          );
        } else {
          response = await insertEmployeeEmergencyContactDetailRequest({
            emergencyContacts: requestDataEmergencyContacts.map(
              (contact: any) => ({
                ...contact,
                userId
              })
            )
          });
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 6: true }));
          setSavedStepData((prev) => ({
            ...prev,
            6: requestDataEmergencyContacts
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[6]
              ? toastMessages.success.adminDashboard.employee
                  .employeeEmergencyContactsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeEmergencyContactsSaved,
            'success'
          );
        }
      } else if (activeStep === 7) {
        const requestDataExperienceDetails: any = values.experienceDetails.map(
          (detail) => ({
            companyName: detail.txtCompanyName,
            employeeId: detail.txtEmployeeId,
            jobTitle: detail.txtJobTitle,
            startDate: detail.txtStartDate,
            endDate: detail.txtEndDate,
            country: detail.ddlCountry,
            city: detail.txtCity,
            state: detail.ddlState,
            employmentType: detail.ddlEmploymentType,
            supervisorName: detail.txtSupervisorName,
            supervisorPhone: detail.txtSupervisorPhone
          })
        );

        if (completedSteps[7]) {
          response = await updateEmployeeExperienceDetailRequest(
            userId,
            requestDataExperienceDetails
          );
        } else {
          response = await insertEmployeeExperienceDetailRequest({
            experienceDetails: requestDataExperienceDetails.map(
              (experience: any) => ({
                ...experience,
                userId
              })
            )
          });
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 7: true }));
          setSavedStepData((prev) => ({
            ...prev,
            7: requestDataExperienceDetails
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[7]
              ? toastMessages.success.adminDashboard.employee
                  .employeeExperienceDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeExperienceDetailsSaved,
            'success'
          );
        }
      } else if (activeStep === 3) {
        const requestDataAddressDetails: any = values.addressDetails.map(
          (detail) => ({
            addressType: detail.ddlAddressType,
            buildingName: detail.txtBuildingName,
            flatNumber: detail.txtFlatNumber,
            streetName: detail.txtStreetName,
            landmark: detail.txtLandmark,
            city: detail.txtCity,
            state: detail.ddlState,
            pincode: detail.txtPincode,
            telephoneNumber: detail.txtTelephoneNumber,
            phone: detail.txtPhone
          })
        );

        if (completedSteps[3]) {
          response = await updateEmployeeAddressDetailRequest(
            userId,
            requestDataAddressDetails
          );
        } else {
          response = await insertEmployeeAddressDetailRequest({
            employeeAddresses: requestDataAddressDetails.map(
              (address: any) => ({
                ...address,
                userId
              })
            )
          });
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 3: true }));
          setSavedStepData((prev) => ({
            ...prev,
            3: requestDataAddressDetails
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[3]
              ? toastMessages.success.adminDashboard.employee
                  .employeeAddressDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeAddressDetailsSaved,
            'success'
          );
        }
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
      setSubmitting(false);
    }
  };

  const getEmployeeDetailsByUserId = async (): Promise<void> => {
    setLoading(true);
    try {
      if (activeStep === 0) {
        const response = await getUserByIdRequest(Number(id));
        const userData: UserValues = response?.user;
        if (userData) {
          setInitialValuesCreateUser({
            txtFirstName: userData.first_name,
            txtLastName: userData.last_name,
            txtEmail: userData.email,
            txtPassword: userData.password,
            txtPhone: userData.phone,
            ddlRoles: userData.roles,
            chkIsActive: userData.is_active,
            chkShowActivity: userData.show_activity
          });
          setCompletedSteps((prev) => ({ ...prev, 0: true }));
          setUserId(Number(id));
        }
      } else if (activeStep === 1) {
        const response = await getEmployeePersonalDetailsByUserIdRequest(
          Number(id)
        );
        const personalDetailsData: PersonalDetailsValues =
          response?.employeePersonalDetail;
        if (personalDetailsData) {
          const countryCode =
            countries.find(
              (x) => x.country === personalDetailsData.birth_country?.trim()
            )?.alpha2Code || '';
          handleCountryChange(countryCode);
          setInitialValuesPersonalDetails({
            txtBirthDate: personalDetailsData.birth_date,
            txtAge: personalDetailsData.age,
            ddlBirthCountry: countryCode,
            ddlBirthState: personalDetailsData.birth_state,
            txtBirthLocation: personalDetailsData.birth_location,
            ddlGender: personalDetailsData.gender,
            ddlMaritalStatus: personalDetailsData.marital_status,
            txtMarriageDate: personalDetailsData.marriage_date,
            ddlBloodGroup: personalDetailsData.blood_group,
            txtPanNumber: personalDetailsData.pan_number,
            txtCaste: personalDetailsData.caste,
            txtReligion: personalDetailsData.religion,
            txtResidence: personalDetailsData.residence
          });
          setCompletedSteps((prev) => ({ ...prev, 1: true }));
        }
      } else if (activeStep === 2) {
        const response = await getEmployeeProfessionalDetailsByUserIdRequest(
          Number(id)
        );
        console.log('res is', response);
        const professionalData: ProfessionalDetailsValues =
          response?.employeeProfessionalDetail;
        if (professionalData) {
          setInitialValuesProfessionalDetails({
            txtEmployeeCode: professionalData.employee_code,
            ddlDesignation: professionalData.designation_id,
            txtJoinDate: professionalData.join_date,
            ddlEmploymentType: professionalData.employment_type,
            ddlWorkingType: professionalData.working_type
          });
          setCompletedSteps((prev) => ({ ...prev, 2: true }));
        }
      } else if (activeStep === 3) {
        const response = await getEmployeeAddressDetailsByUserIdRequest(
          Number(id)
        );
        const addressData = response?.employeeAddresses;
        if (addressData?.length) {
          setInitialValuesAddressDetailsEntries(
            addressData.map((address: any) => ({
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
            }))
          );
          setCompletedSteps((prev) => ({ ...prev, 3: true }));
        }
      } else if (activeStep === 4) {
        const response = await getEmployeeFamilyDetailsByUserIdRequest(
          Number(id)
        );
        const familyData = response?.familyDetails;
        if (familyData?.length) {
          setInitialValuesFamilyDetailsEntries(
            familyData.map((family: any) => ({
              ddlRelationType: family.relation_type,
              txtName: family.name,
              txtAge: family.age,
              txtBirthDate: family.birth_date,
              txtCurrentAddress: family.current_address,
              ddlBirthCountry: family.birth_country,
              ddlBirthState: family.birth_state,
              txtBirthLocation: family.birth_location,
              txtOccupation: family.occupation,
              txtPhone: family.phone
            }))
          );
          setCompletedSteps((prev) => ({ ...prev, 4: true }));
        }
      } else if (activeStep === 5) {
        const response = await getEmployeeEducationDetailsByUserIdRequest(
          Number(id)
        );
        const educationData = response?.educationalDetails;
        if (educationData?.length) {
          setInitialValuesEducationDetailsEntries(
            educationData.map((education: any) => ({
              ddlCourse: education.course,
              txtDegreeSpecialization: education.degree_specialization,
              txtInstituteName: education.institute_name,
              txtFromDate: education.from_date,
              txtToDate: education.to_date,
              ddlStatus: education.status,
              ddlStudyMode: education.study_mode,
              txtPercentage: education.percentage
            }))
          );
          setCompletedSteps((prev) => ({ ...prev, 5: true }));
        }
      } else if (activeStep === 6) {
        const response =
          await getEmployeeEmergencyContactDetailsByUserIdRequest(Number(id));
        const contactsData = response?.emergencyContacts;
        if (contactsData?.length) {
          setInitialValuesEmergencyContactDetailsEntries(
            contactsData.map((contact: any) => ({
              txtContactName: contact.contact_name,
              txtContactAddress: contact.contact_address,
              ddlContactRelation: contact.contact_relation,
              txtPhone: contact.phone
            }))
          );
          setCompletedSteps((prev) => ({ ...prev, 6: true }));
        }
      } else if (activeStep === 7) {
        const response = await getEmployeeExperienceDetailsByUserIdRequest(
          Number(id)
        );
        const experienceData = response?.experienceDetails;
        if (experienceData?.length) {
          setInitialValuesExperienceDetailsEntries(
            experienceData.map((experience: any) => ({
              txtCompanyName: experience.company_name,
              txtEmployeeId: experience.employee_id,
              txtJobTitle: experience.job_title,
              txtStartDate: experience.start_date,
              txtEndDate: experience.end_date,
              ddlCountry: experience.country,
              txtCity: experience.city,
              ddlState: experience.state,
              ddlEmploymentType: experience.employment_type,
              txtSupervisorName: experience.supervisor_name,
              txtSupervisorPhone: experience.supervisor_phone
            }))
          );
          setCompletedSteps((prev) => ({ ...prev, 7: true }));
        }
      } else if (activeStep === 8) {
        const response = await getEmployeeDocumentDetailsByUserIdRequest(
          Number(id)
        );
        const documentsData = response?.documents;
        if (documentsData?.length) {
          setInitialValuesDocumentDetailsEntries(
            documentsData.map((doc: any) => ({
              documentTypeId: doc.document_type_id,
              employeeDocument: doc.document_url
            }))
          );
          setCompletedSteps((prev) => ({ ...prev, 8: true }));
        }
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  const validationSchema = [
    // Create User Validation (Single)
    Yup.object().shape({
      txtFirstName: Yup.string()
        .trim()
        .required('Please enter the first name.')
        .matches(
          /^[a-zA-Z0-9 ]+$/,
          'Please enter only alphabetics and/or numbers.'
        ),
      txtLastName: Yup.string()
        .trim()
        .required('Please enter the last name.')
        .matches(
          /^[a-zA-Z0-9 ]+$/,
          'Please enter only alphabetics and/or numbers.'
        ),
      txtEmail: Yup.string()
        .trim()
        .email('Please enter the valid email address.')
        .required('Please enter the email address.'),
      txtPassword: Yup.string()
        .min(7, 'Password should be minimum 7 characters.')
        .max(100, 'Password should be maximum 100 characters.')
        .required('Please enter the password.'),
      ddlRoles: Yup.array()
        .min(1, 'Please select the role.')
        .required('Please select the role.'),
      chkIsActive: Yup.boolean(),
      chkShowActivity: Yup.boolean()
    }),

    // Personal Details Validation (Single)
    Yup.object().shape({
      txtBirthDate: Yup.date()
        .required('Please enter the birth date.')
        .max(new Date(), 'Birth date cannot be in the future.'),
      txtAge: Yup.number()
        .min(18, 'Age must be at least 18 years.')
        .required('Please enter the age.'),
      ddlBirthCountry: Yup.string().required(
        'Please select the birth country.'
      ),
      ddlBirthState: Yup.string().required('Please select the birth state.'),
      txtBirthLocation: Yup.string().required(
        'Please enter the birth location.'
      ),
      ddlGender: Yup.string().required('Please select the gender.'),
      ddlMaritalStatus: Yup.string().required(
        'Please select the marital status.'
      ),
      txtMarriageDate: Yup.date().when(['ddlMaritalStatus'], {
        is: (status: any) =>
          ['married', 'widowed', 'divorced'].includes(status),
        then: (schema) => schema.required('Please enter the marriage date.'),
        otherwise: (schema) => schema.nullable()
      }),
      ddlBloodGroup: Yup.string().required('Please select the blood group.'),
      txtPanNumber: Yup.string()
        .matches(
          /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          'Please enter a valid PAN number.'
        )
        .required('Please enter the PAN number.'),
      txtCaste: Yup.string().required('Please enter the caste'),
      txtReligion: Yup.string().required('Please enter the religion'),
      txtResidence: Yup.string().required('Please enter the residence')
    }),

    // Professional Details Validation (Single)
    Yup.object().shape({
      txtEmployeeCode: Yup.string().required('Please enter the employee code.'),
      ddlDesignation: Yup.string()
        .min(1, 'Please select the designation.')
        .required('Please select the designation.'),
      txtJoinDate: Yup.date()
        .required('Please enter the join date.')
        .max(new Date(), 'Join date cannot be in the future.'),
      ddlEmploymentType: Yup.string().required(
        'Please select the employment type.'
      ),
      ddlWorkingType: Yup.string().required('Please select the working type.')
    }),

    // Address Details Validation (Multiple)
    Yup.object().shape({
      addressDetails: Yup.array()
        .of(
          Yup.object().shape({
            ddlAddressType: Yup.string().required(
              'Please select the address type.'
            ),
            txtBuildingName: Yup.string().required(
              'Please enter the building name.'
            ),
            txtFlatNumber: Yup.string().required(
              'Please enter the flat number.'
            ),
            txtStreetName: Yup.string().required(
              'Please enter the street name.'
            ),
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
    }),

    // Family Details Validation (Multiple)
    Yup.object().shape({
      familyDetails: Yup.array()
        .of(
          Yup.object().shape({
            ddlRelationType: Yup.string().required(
              'Please select the relation type.'
            ),
            txtName: Yup.string()
              .required('Please enter the name.')
              .matches(/^[a-zA-Z ]+$/, 'Please enter only alphabetics.'),
            txtAge: Yup.number()
              .min(0, 'Age cannot be negative.')
              .required('Please enter the age.'),
            txtBirthDate: Yup.date()
              .required('Please enter the birth date.')
              .max(new Date(), 'Birth date cannot be in the future.'),
            txtCurrentAddress: Yup.string().required(
              'Please enter the current address.'
            ),
            ddlBirthCountry: Yup.string().required(
              'Please select the birth country.'
            ),
            ddlBirthState: Yup.string().required(
              'Please select the birth state.'
            ),
            txtBirthLocation: Yup.string().required(
              'Please enter the birth location.'
            ),
            txtOccupation: Yup.string().required(
              'Please enter the occupation.'
            ),
            txtPhone: Yup.string()
              .matches(
                /^[0-9]{10}$/,
                'Please enter a valid 10-digit phone number.'
              )
              .required('Please enter the phone number.')
          })
        )
        .min(1, 'Please add at least one family member.')
    }),

    // Education Details Validation (Multiple)
    Yup.object().shape({
      educationDetails: Yup.array()
        .of(
          Yup.object().shape({
            ddlCourse: Yup.string().required('Please select the course.'),
            txtDegreeSpecialization: Yup.string().required(
              'Please enter the degree specialization.'
            ),
            txtInstituteName: Yup.string().required(
              'Please enter the institute name.'
            ),
            txtFromDate: Yup.date()
              .required('Please enter the from date.')
              .max(new Date(), 'From date cannot be in the future.'),
            txtToDate: Yup.date()
              .min(Yup.ref('txtFromDate'), 'To date must be after from date.')
              .required('Please enter the to date.'),
            ddlStatus: Yup.string().required('Please select the status.'),
            ddlStudyMode: Yup.string().required(
              'Please select the study mode.'
            ),
            txtPercentage: Yup.number()
              .min(0, 'Percentage cannot be negative.')
              .max(100, 'Percentage cannot be more than 100.')
              .required('Please enter the percentage.')
          })
        )
        .min(1, 'Please add at least one education record.')
    }),

    // Emergency Contact Details Validation (Multiple)
    Yup.object().shape({
      emergencyContactDetails: Yup.array()
        .of(
          Yup.object().shape({
            txtContactName: Yup.string()
              .required('Please enter the contact name.')
              .matches(/^[a-zA-Z ]+$/, 'Please enter only alphabetics.'),
            txtContactAddress: Yup.string().required(
              'Please enter the contact address.'
            ),
            ddlContactRelation: Yup.string().required(
              'Please enter the contact relation.'
            ),
            txtPhone: Yup.string()
              .matches(
                /^[0-9]{10}$/,
                'Please enter a valid 10-digit phone number.'
              )
              .required('Please enter the phone number.')
          })
        )
        .min(1, 'Please add at least one emergency contact.')
    }),

    // Experience Details Validation (Multiple)
    Yup.object().shape({
      experienceDetails: Yup.array()
        .of(
          Yup.object().shape({
            txtCompanyName: Yup.string().required(
              'Please enter the company name.'
            ),
            txtEmployeeId: Yup.string().required(
              'Please enter the employee ID.'
            ),
            txtJobTitle: Yup.string().required('Please enter the job title.'),
            txtStartDate: Yup.date()
              .required('Please enter the start date.')
              .max(new Date(), 'Start date cannot be in the future.'),
            txtEndDate: Yup.date()
              .min(
                Yup.ref('txtStartDate'),
                'End date must be after start date.'
              )
              .required('Please enter the end date.'),
            ddlCountry: Yup.string().required('Please select the country.'),
            txtCity: Yup.string().required('Please enter the city.'),
            ddlState: Yup.string().required('Please select the state.'),
            ddlEmploymentType: Yup.string().required(
              'Please select the employment type.'
            ),
            txtSupervisorName: Yup.string()
              .required('Please enter the supervisor name.')
              .matches(/^[a-zA-Z ]+$/, 'Please enter only alphabetics.'),
            txtSupervisorPhone: Yup.string()
              .matches(
                /^[0-9]{10}$/,
                'Please enter a valid 10-digit phone number.'
              )
              .required('Please enter the supervisor phone number.')
          })
        )
        .min(1, 'Please add at least one experience record.')
    }),

    Yup.object().shape({
      documentDetails: Yup.array().of(
        Yup.object().shape({
          documentTypeId: Yup.number().required('Document type is required'),
          employeeDocument: Yup.mixed()
            .required('Document is required')
            .test('fileSize', 'File size must be less than 1MB', (value) => {
              if (!value) return true; // Skip validation if no file is provided
              const file = value as File; // Explicitly cast to File
              return file.size <= 1000000;
            })
            .test(
              'fileType',
              'File type must be PDF, JPEG, JPG, or PNG',
              (value) => {
                if (!value) return true; // Skip validation if no file is provided
                const file = value as File; // Explicitly cast to File
                return ALLOWED_FILE_FORMATS.includes(file.type);
              }
            )
        })
      )
    })
  ];
  const currentValidationSchema = validationSchema[activeStep];

  const CustomConnector = styled(StepConnector)(({ theme }) => ({
    // Media query for md breakpoint
    [`&.${theme.breakpoints.up('md')}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)'
    },

    // Alternative label styles
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)'
    },

    // Active state
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.primary.main,
        borderWidth: 2
      }
    },

    // Completed state
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.primary.main
      }
    },

    // Line styles
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderTopWidth: 2,
      borderRadius: 4,
      transition: 'all 0.3s ease'
    }
  }));

  const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
    flexDirection: 'column',
    '& .MuiStepLabel-iconContainer': {
      paddingRight: 0,
      marginBottom: 4
    },
    '& .MuiStepLabel-label': {
      marginTop: 4,
      fontSize: '0.75rem',
      textAlign: 'center',
      maxWidth: '70px',
      wordWrap: 'break-word',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
        maxWidth: '60px'
      },
      '&.Mui-active': {
        color: theme.palette.primary.main,
        fontWeight: 600,
        transform: 'scale(1.05)',
        transition: 'all 0.3s ease'
      }
    }
  }));

  useEffect(() => {
    handleGetRoles();
    handleGetDesignations();
    handleGetDocumentTypes();
  }, []);

  useEffect(() => {
    if (id) {
      getEmployeeDetailsByUserId();
    }
  }, [activeStep, id]);

  return (
    <Box sx={{ width: '100%' }}>
      <>
        <AdminDashboardPage title="Manage Employees">
          {!loading ? (
            <AdminFormLayout
              title="Edit Employee"
              subtitle="Please edit the below details to update employee."
            >
              <>
                <Formik
                  enableReinitialize={false}
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
                    setFieldValue
                  }) => {
                    const handleEmployeeSubmit = (): void => {
                      const allDocumentsUploaded = documentTypes.every(
                        (docType) =>
                          values.documentDetails.some(
                            (doc) =>
                              doc.documentTypeId === docType.id &&
                              doc.employeeDocument
                          )
                      );

                      if (!allDocumentsUploaded) {
                        showSnackbar(
                          'Please upload all required documents before submitting.',
                          'error'
                        );
                        return;
                      }

                      showSnackbar(
                        toastMessages.success.adminDashboard.employee
                          .employeeOnboard,
                        'success'
                      );
                      navigate(manageEmployeePath);
                    };
                    return (
                      <>
                        <Form autoComplete="off" onSubmit={handleSubmit}>
                          <Box sx={{ width: '100%', overflowX: 'auto' }}>
                            <Stepper
                              activeStep={activeStep}
                              alternativeLabel
                              connector={<CustomConnector />}
                              sx={{
                                mt: 2,
                                p: 1,
                                '& .MuiStep-root': {
                                  padding: '0 8px'
                                }
                              }}
                            >
                              {steps.map((label) => (
                                <Step key={label}>
                                  <CustomStepLabel>{label}</CustomStepLabel>
                                </Step>
                              ))}
                            </Stepper>
                          </Box>
                          {activeStep === 0 && (
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
                                      touched.txtFirstName &&
                                        errors.txtFirstName
                                    )}
                                    helperText={String(
                                      touched.txtFirstName &&
                                        errors.txtFirstName
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
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Email"
                                    name="txtEmail"
                                    type="email"
                                    value={values.txtEmail}
                                    inputProps={{ maxLength: 100 }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtEmail && errors.txtEmail
                                    )}
                                    helperText={String(
                                      touched.txtEmail && errors.txtEmail
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Password"
                                    name="txtPassword"
                                    type="password"
                                    value={values.txtPassword}
                                    inputProps={{ maxLength: 100 }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={Boolean(
                                      touched.txtPassword && errors.txtPassword
                                    )}
                                    helperText={String(
                                      touched.txtPassword && errors.txtPassword
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <AutoCompleteInput
                                    multiple
                                    label="Select Role"
                                    name="ddlRoles"
                                    value={values.ddlRoles}
                                    data={
                                      roles?.map(
                                        (val: ShortRoleModel) => val.id
                                      ) || []
                                    }
                                    originalData={roles}
                                    itemId="id"
                                    itemName="name"
                                    placeholder="search role"
                                    limitTags={2}
                                    renderOption={(
                                      props: any,
                                      option: any,
                                      { selected }: any
                                    ) => (
                                      <MenuItem {...props}>
                                        <Checkbox checked={selected} />
                                        {roles?.find(
                                          (val: ShortRoleModel) =>
                                            val.id === option
                                        )?.name || ''}
                                      </MenuItem>
                                    )}
                                    onChange={(e: any) => {
                                      setFieldValue('ddlRoles', e);
                                    }}
                                    error={Boolean(
                                      touched.ddlRoles && errors.ddlRoles
                                    )}
                                    helperText={String(
                                      touched.ddlRoles && errors.ddlRoles
                                    )}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  md={6}
                                  sx={{ paddingTop: '52px !important' }}
                                >
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
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        name="chkShowActivity"
                                        checked={values.chkShowActivity}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    }
                                    label={
                                      <Typography variant="body2" ml={2}>
                                        Show Activity
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
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      openTo="day"
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtBirthDate}
                                      onChange={(newValue: any) => {
                                        setFieldValue(
                                          'txtBirthDate',
                                          getDate(newValue, 'dd MMM yyyy')
                                        );
                                      }}
                                      renderInput={(params: any) => (
                                        <CustomField
                                          name="txtBirthDate"
                                          label="Birth Date"
                                          error={Boolean(
                                            touched.txtBirthDate &&
                                              errors.txtBirthDate
                                          )}
                                          helperText={String(
                                            touched.txtBirthDate &&
                                              errors.txtBirthDate
                                          )}
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name="txtBirthDate"
                                            value={values.txtBirthDate}
                                            error={Boolean(
                                              touched.txtBirthDate &&
                                                errors.txtBirthDate
                                            )}
                                          />
                                        </CustomField>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Age"
                                    name="txtAge"
                                    type="number"
                                    value={values.txtAge}
                                    inputProps={{ min: 1 }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtAge && errors.txtAge
                                    )}
                                    helperText={String(
                                      touched.txtAge && errors.txtAge
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select Birth Country"
                                    name="ddlBirthCountry"
                                    value={values.ddlBirthCountry}
                                    onChange={(e) => {
                                      handleChange(e);
                                      handleCountryChange(
                                        e.target.value as string
                                      );
                                    }}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlBirthCountry &&
                                        errors.ddlBirthCountry
                                    )}
                                    helperText={String(
                                      touched.ddlBirthCountry &&
                                        errors.ddlBirthCountry
                                    )}
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
                                    label="Select Birth State"
                                    name="ddlBirthState"
                                    value={values.ddlBirthState}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlBirthState &&
                                        errors.ddlBirthState
                                    )}
                                    helperText={String(
                                      touched.ddlBirthState &&
                                        errors.ddlBirthState
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
                                    label="Birth Location"
                                    name="txtBirthLocation"
                                    value={values.txtBirthLocation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtBirthLocation &&
                                        errors.txtBirthLocation
                                    )}
                                    helperText={String(
                                      touched.txtBirthLocation &&
                                        errors.txtBirthLocation
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select Gender"
                                    name="ddlGender"
                                    value={values.ddlGender}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlGender && errors.ddlGender
                                    )}
                                    helperText={String(
                                      touched.ddlGender && errors.ddlGender
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeePersonalDetails.gender.map(
                                      (option: any) => (
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
                                  <SelectInput
                                    label="Select Marital Status"
                                    name="ddlMaritalStatus"
                                    value={values.ddlMaritalStatus}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlMaritalStatus &&
                                        errors.ddlMaritalStatus
                                    )}
                                    helperText={String(
                                      touched.ddlMaritalStatus &&
                                        errors.ddlMaritalStatus
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeePersonalDetails.maritalStatus.map(
                                      (option: any) => (
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
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      openTo="day"
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtMarriageDate}
                                      disabled={
                                        values.ddlMaritalStatus === 'single'
                                      }
                                      onChange={(newValue: any) => {
                                        setFieldValue(
                                          'txtMarriageDate',
                                          newValue
                                        );
                                      }}
                                      renderInput={(params: any) => (
                                        <CustomField
                                          name="txtMarriageDate"
                                          label="Marriage Date"
                                          error={Boolean(
                                            touched.txtMarriageDate &&
                                              errors.txtMarriageDate
                                          )}
                                          helperText={String(
                                            touched.txtMarriageDate &&
                                              errors.txtMarriageDate
                                          )}
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name="txtMarriageDate"
                                            value={values.txtMarriageDate}
                                            error={Boolean(
                                              touched.txtMarriageDate &&
                                                errors.txtMarriageDate
                                            )}
                                          />
                                        </CustomField>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select Blood Group"
                                    name="ddlBloodGroup"
                                    value={values.ddlBloodGroup}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlBloodGroup &&
                                        errors.ddlBloodGroup
                                    )}
                                    helperText={String(
                                      touched.ddlBloodGroup &&
                                        errors.ddlBloodGroup
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeePersonalDetails.bloodGroups.map(
                                      (option: any) => (
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
                                    label="Pan Number"
                                    name="txtPanNumber"
                                    value={values.txtPanNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtPanNumber &&
                                        errors.txtPanNumber
                                    )}
                                    helperText={String(
                                      touched.txtPanNumber &&
                                        errors.txtPanNumber
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Caste"
                                    name="txtCaste"
                                    value={values.txtCaste}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtCaste && errors.txtCaste
                                    )}
                                    helperText={String(
                                      touched.txtCaste && errors.txtCaste
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Religion"
                                    name="txtReligion"
                                    value={values.txtReligion}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtReligion && errors.txtReligion
                                    )}
                                    helperText={String(
                                      touched.txtReligion && errors.txtReligion
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Residence"
                                    name="txtResidence"
                                    value={values.txtResidence}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtResidence &&
                                        errors.txtResidence
                                    )}
                                    helperText={String(
                                      touched.txtResidence &&
                                        errors.txtResidence
                                    )}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          )}
                          {activeStep === 2 && (
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Employee Code"
                                    name="txtEmployeeCode"
                                    value={values.txtEmployeeCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtEmployeeCode &&
                                        errors.txtEmployeeCode
                                    )}
                                    helperText={String(
                                      touched.txtEmployeeCode &&
                                        errors.txtEmployeeCode
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select Designation"
                                    name="ddlDesignation"
                                    value={values.ddlDesignation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlDesignation &&
                                        errors.ddlDesignation
                                    )}
                                    helperText={String(
                                      touched.ddlDesignation &&
                                        errors.ddlDesignation
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {designations.map((option: any) => (
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
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      openTo="day"
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtJoinDate}
                                      onChange={(newValue: any) => {
                                        setFieldValue('txtJoinDate', newValue);
                                      }}
                                      renderInput={(params: any) => (
                                        <CustomField
                                          name="txtJoinDate"
                                          label="Join Date"
                                          error={Boolean(
                                            touched.txtJoinDate &&
                                              errors.txtJoinDate
                                          )}
                                          helperText={String(
                                            touched.txtJoinDate &&
                                              errors.txtJoinDate
                                          )}
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name="txtJoinDate"
                                            value={values.txtJoinDate}
                                            error={Boolean(
                                              touched.txtJoinDate &&
                                                errors.txtJoinDate
                                            )}
                                          />
                                        </CustomField>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Employment Type"
                                    name="ddlEmploymentType"
                                    value={values.ddlEmploymentType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlEmploymentType &&
                                        errors.ddlEmploymentType
                                    )}
                                    helperText={String(
                                      touched.ddlEmploymentType &&
                                        errors.ddlEmploymentType
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeProfessionalDetails.employmentType.map(
                                      (option: any) => (
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
                                  <SelectInput
                                    label="Working Type"
                                    name="ddlWorkingType"
                                    value={values.ddlWorkingType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlWorkingType &&
                                        errors.ddlWorkingType
                                    )}
                                    helperText={String(
                                      touched.ddlWorkingType &&
                                        errors.ddlWorkingType
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeProfessionalDetails.workingType.map(
                                      (option: any) => (
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
                              </Grid>
                            </CardContent>
                          )}
                          {activeStep === 3 && (
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
                                      push(initialValuesAddressDetailsEntries);
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
                                        >
                                          <Grid
                                            container
                                            alignItems="center"
                                            spacing={2}
                                          >
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
                                                <MenuItem value="">
                                                  - None -
                                                </MenuItem>
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
                                                  values.addressDetails[index]
                                                    .txtLandmark
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
                                                  values.addressDetails[index]
                                                    .txtCity
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
                                                  values.addressDetails[index]
                                                    .ddlCountry
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
                                                  values.addressDetails[index]
                                                    .ddlState
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
                                                  <MenuItem
                                                    key={i}
                                                    value={option}
                                                  >
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
                                                  values.addressDetails[index]
                                                    .txtPincode
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
                                                  values.addressDetails[index]
                                                    .txtPhone
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
                          )}
                          {activeStep === 4 && (
                            <FieldArray name="familyDetails">
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
                                    onClick={() =>
                                      push(initialValuesFamilyDetailsEntries)
                                    }
                                    sx={{ ml: 80, mb: 2 }}
                                  >
                                    Add Member
                                  </Button>
                                  {values.familyDetails.map((member, index) => (
                                    <Accordion key={index} sx={{ mb: 2 }}>
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`family-member-${index}-content`}
                                        id={`family-member-${index}-header`}
                                      >
                                        <Grid
                                          container
                                          alignItems="center"
                                          spacing={2}
                                        >
                                          <Grid item xs={11}>
                                            <Typography variant="subtitle1">
                                              Family Member #{index + 1}
                                              {member.txtName &&
                                                ` - ${member.txtName}`}
                                              {member.ddlRelationType &&
                                                ` (${member.ddlRelationType})`}
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
                                              label="Select Relation Type"
                                              name={`familyDetails.${index}.ddlRelationType`}
                                              value={
                                                values.familyDetails[index]
                                                  .ddlRelationType
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.ddlRelationType`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.ddlRelationType`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.ddlRelationType`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.ddlRelationType`
                                                )
                                              }
                                            >
                                              <MenuItem key="-1" value="">
                                                - None -
                                              </MenuItem>
                                              {employeeFamilyDetails.relationType.map(
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
                                              label="Name"
                                              name={`familyDetails.${index}.txtName`}
                                              value={
                                                values.familyDetails[index]
                                                  .txtName
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtName`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.txtName`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtName`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.txtName`
                                                )
                                              }
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              fullWidth
                                              label="Age"
                                              name={`familyDetails.${index}.txtAge`}
                                              type="number"
                                              value={
                                                values.familyDetails[index]
                                                  .txtAge
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtAge`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.txtAge`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtAge`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.txtAge`
                                                )
                                              }
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              fullWidth
                                              label="Birth Date"
                                              name={`familyDetails.${index}.txtBirthDate`}
                                              type="date"
                                              value={
                                                values.familyDetails[index]
                                                  .txtBirthDate
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtBirthDate`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.txtBirthDate`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtBirthDate`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.txtBirthDate`
                                                )
                                              }
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              fullWidth
                                              label="Current Address"
                                              name={`familyDetails.${index}.txtCurrentAddress`}
                                              multiline
                                              rows={3}
                                              value={
                                                values.familyDetails[index]
                                                  .txtCurrentAddress
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtCurrentAddress`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.txtCurrentAddress`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtCurrentAddress`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.txtCurrentAddress`
                                                )
                                              }
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={6}>
                                            <SelectInput
                                              label="Birth Country"
                                              name={`familyDetails.${index}.ddlBirthCountry`}
                                              value={
                                                values.familyDetails[index]
                                                  .ddlBirthCountry
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
                                                  `familyDetails.${index}.ddlBirthCountry`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.ddlBirthCountry`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.ddlBirthCountry`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.ddlBirthCountry`
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
                                              label="Birth State"
                                              name={`familyDetails.${index}.ddlBirthState`}
                                              value={
                                                values.familyDetails[index]
                                                  .ddlBirthState
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.ddlBirthState`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.ddlBirthState`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.ddlBirthState`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.ddlBirthState`
                                                )
                                              }
                                            >
                                              <MenuItem key="-1" value="">
                                                - None -
                                              </MenuItem>
                                              {states.map((option, i) => (
                                                <MenuItem
                                                  key={i}
                                                  value={option}
                                                >
                                                  {option}
                                                </MenuItem>
                                              ))}
                                            </SelectInput>
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              fullWidth
                                              label="Birth Location"
                                              name={`familyDetails.${index}.txtBirthLocation`}
                                              value={
                                                values.familyDetails[index]
                                                  .txtBirthLocation
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtBirthLocation`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.txtBirthLocation`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtBirthLocation`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.txtBirthLocation`
                                                )
                                              }
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              fullWidth
                                              label="Occupation"
                                              name={`familyDetails.${index}.txtOccupation`}
                                              value={
                                                values.familyDetails[index]
                                                  .txtOccupation
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtOccupation`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.txtOccupation`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtOccupation`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.txtOccupation`
                                                )
                                              }
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              fullWidth
                                              label="Phone"
                                              name={`familyDetails.${index}.txtPhone`}
                                              type="number"
                                              value={
                                                values.familyDetails[index]
                                                  .txtPhone
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtPhone`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.txtPhone`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtPhone`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.txtPhone`
                                                )
                                              }
                                            />
                                          </Grid>
                                        </Grid>
                                      </AccordionDetails>
                                    </Accordion>
                                  ))}
                                </div>
                              )}
                            </FieldArray>
                          )}
                          {activeStep === 5 && (
                            <FieldArray name="educationDetails">
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
                                    onClick={() =>
                                      push(initialValuesEducationDetailsEntries)
                                    }
                                    sx={{ ml: 80, mb: 2 }}
                                  >
                                    Add Education
                                  </Button>
                                  {values.educationDetails.map(
                                    (education, index) => (
                                      <Accordion key={index} sx={{ mb: 2 }}>
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          aria-controls={`education-${index}-content`}
                                          id={`education-${index}-header`}
                                        >
                                          <Grid
                                            container
                                            alignItems="center"
                                            spacing={2}
                                          >
                                            <Grid item xs={11}>
                                              <Typography variant="subtitle1">
                                                Education #{index + 1}
                                                {education.ddlCourse &&
                                                  ` - ${education.ddlCourse}`}
                                                {education.txtDegreeSpecialization &&
                                                  ` (${education.txtDegreeSpecialization})`}
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
                                                label="Course"
                                                name={`educationDetails.${index}.ddlCourse`}
                                                value={
                                                  values.educationDetails[index]
                                                    .ddlCourse
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.ddlCourse`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `educationDetails.${index}.ddlCourse`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.ddlCourse`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `educationDetails.${index}.ddlCourse`
                                                  )
                                                }
                                              >
                                                <MenuItem key="-1" value="">
                                                  - None -
                                                </MenuItem>
                                                {employeeEducationDetails.course.map(
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
                                                label="Degree Specialization"
                                                name={`educationDetails.${index}.txtDegreeSpecialization`}
                                                value={
                                                  values.educationDetails[index]
                                                    .txtDegreeSpecialization
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.txtDegreeSpecialization`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `educationDetails.${index}.txtDegreeSpecialization`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.txtDegreeSpecialization`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `educationDetails.${index}.txtDegreeSpecialization`
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <TextInput
                                                fullWidth
                                                label="Institute Name"
                                                name={`educationDetails.${index}.txtInstituteName`}
                                                value={
                                                  values.educationDetails[index]
                                                    .txtInstituteName
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.txtInstituteName`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `educationDetails.${index}.txtInstituteName`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.txtInstituteName`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `educationDetails.${index}.txtInstituteName`
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                              >
                                                <DatePicker
                                                  openTo="day"
                                                  inputFormat="DD/MM/YYYY"
                                                  value={
                                                    values.educationDetails[
                                                      index
                                                    ].txtFromDate
                                                  }
                                                  onChange={(newValue) => {
                                                    setFieldValue(
                                                      `educationDetails.${index}.txtFromDate`,
                                                      newValue
                                                    );
                                                  }}
                                                  renderInput={(params) => (
                                                    <CustomField
                                                      name={`educationDetails.${index}.txtFromDate`}
                                                      label="From Date"
                                                      error={Boolean(
                                                        getIn(
                                                          touched,
                                                          `educationDetails.${index}.txtFromDate`
                                                        ) &&
                                                          getIn(
                                                            errors,
                                                            `educationDetails.${index}.txtFromDate`
                                                          )
                                                      )}
                                                      helperText={
                                                        getIn(
                                                          touched,
                                                          `educationDetails.${index}.txtFromDate`
                                                        ) &&
                                                        getIn(
                                                          errors,
                                                          `educationDetails.${index}.txtFromDate`
                                                        )
                                                      }
                                                    >
                                                      <TextField
                                                        {...params}
                                                        fullWidth
                                                        size="medium"
                                                        name={`educationDetails.${index}.txtFromDate`}
                                                        value={
                                                          values
                                                            .educationDetails[
                                                            index
                                                          ].txtFromDate
                                                        }
                                                        error={Boolean(
                                                          getIn(
                                                            touched,
                                                            `educationDetails.${index}.txtFromDate`
                                                          ) &&
                                                            getIn(
                                                              errors,
                                                              `educationDetails.${index}.txtFromDate`
                                                            )
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
                                                  openTo="day"
                                                  inputFormat="DD/MM/YYYY"
                                                  value={
                                                    values.educationDetails[
                                                      index
                                                    ].txtToDate
                                                  }
                                                  onChange={(newValue) => {
                                                    setFieldValue(
                                                      `educationDetails.${index}.txtToDate`,
                                                      newValue
                                                    );
                                                  }}
                                                  renderInput={(params) => (
                                                    <CustomField
                                                      name={`educationDetails.${index}.txtToDate`}
                                                      label="To Date"
                                                      error={Boolean(
                                                        getIn(
                                                          touched,
                                                          `educationDetails.${index}.txtToDate`
                                                        ) &&
                                                          getIn(
                                                            errors,
                                                            `educationDetails.${index}.txtToDate`
                                                          )
                                                      )}
                                                      helperText={
                                                        getIn(
                                                          touched,
                                                          `educationDetails.${index}.txtToDate`
                                                        ) &&
                                                        getIn(
                                                          errors,
                                                          `educationDetails.${index}.txtToDate`
                                                        )
                                                      }
                                                    >
                                                      <TextField
                                                        {...params}
                                                        fullWidth
                                                        size="medium"
                                                        name={`educationDetails.${index}.txtToDate`}
                                                        value={
                                                          values
                                                            .educationDetails[
                                                            index
                                                          ].txtToDate
                                                        }
                                                        error={Boolean(
                                                          getIn(
                                                            touched,
                                                            `educationDetails.${index}.txtToDate`
                                                          ) &&
                                                            getIn(
                                                              errors,
                                                              `educationDetails.${index}.txtToDate`
                                                            )
                                                        )}
                                                      />
                                                    </CustomField>
                                                  )}
                                                />
                                              </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <SelectInput
                                                label="Status"
                                                name={`educationDetails.${index}.ddlStatus`}
                                                value={
                                                  values.educationDetails[index]
                                                    .ddlStatus
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.ddlStatus`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `educationDetails.${index}.ddlStatus`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.ddlStatus`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `educationDetails.${index}.ddlStatus`
                                                  )
                                                }
                                              >
                                                <MenuItem key="-1" value="">
                                                  - None -
                                                </MenuItem>
                                                {employeeEducationDetails.status.map(
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
                                              <SelectInput
                                                label="Study Mode"
                                                name={`educationDetails.${index}.ddlStudyMode`}
                                                value={
                                                  values.educationDetails[index]
                                                    .ddlStudyMode
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.ddlStudyMode`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `educationDetails.${index}.ddlStudyMode`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.ddlStudyMode`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `educationDetails.${index}.ddlStudyMode`
                                                  )
                                                }
                                              >
                                                <MenuItem key="-1" value="">
                                                  - None -
                                                </MenuItem>
                                                {employeeEducationDetails.studyMode.map(
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
                                                label="Percentage"
                                                name={`educationDetails.${index}.txtPercentage`}
                                                type="number"
                                                value={
                                                  values.educationDetails[index]
                                                    .txtPercentage
                                                }
                                                inputProps={{
                                                  min: 0,
                                                  max: 100
                                                }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.txtPercentage`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `educationDetails.${index}.txtPercentage`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `educationDetails.${index}.txtPercentage`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `educationDetails.${index}.txtPercentage`
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
                          )}
                          {activeStep === 6 && (
                            <FieldArray name="emergencyContactDetails">
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
                                    onClick={() =>
                                      push(
                                        initialValuesEmergencyContactDetailsEntries
                                      )
                                    }
                                    sx={{ ml: 80, mb: 2 }}
                                  >
                                    Add Contact
                                  </Button>
                                  {values.emergencyContactDetails.map(
                                    (contact, index) => (
                                      <Accordion key={index} sx={{ mb: 2 }}>
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          aria-controls={`emergency-contact-${index}-content`}
                                          id={`emergency-contact-${index}-header`}
                                        >
                                          <Grid
                                            container
                                            alignItems="center"
                                            spacing={2}
                                          >
                                            <Grid item xs={11}>
                                              <Typography variant="subtitle1">
                                                Emergency Contact #{index + 1}
                                                {contact.txtContactName &&
                                                  ` - ${contact.txtContactName}`}
                                                {contact.ddlContactRelation &&
                                                  ` (${contact.ddlContactRelation})`}
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
                                              <TextInput
                                                fullWidth
                                                label="Contact Name"
                                                name={`emergencyContactDetails.${index}.txtContactName`}
                                                value={
                                                  values
                                                    .emergencyContactDetails[
                                                    index
                                                  ].txtContactName
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `emergencyContactDetails.${index}.txtContactName`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `emergencyContactDetails.${index}.txtContactName`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `emergencyContactDetails.${index}.txtContactName`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `emergencyContactDetails.${index}.txtContactName`
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <TextInput
                                                fullWidth
                                                label="Contact Address"
                                                name={`emergencyContactDetails.${index}.txtContactAddress`}
                                                multiline
                                                rows={3}
                                                value={
                                                  values
                                                    .emergencyContactDetails[
                                                    index
                                                  ].txtContactAddress
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `emergencyContactDetails.${index}.txtContactAddress`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `emergencyContactDetails.${index}.txtContactAddress`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `emergencyContactDetails.${index}.txtContactAddress`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `emergencyContactDetails.${index}.txtContactAddress`
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <SelectInput
                                                label="Contact Relation"
                                                name={`emergencyContactDetails.${index}.ddlContactRelation`}
                                                value={
                                                  values
                                                    .emergencyContactDetails[
                                                    index
                                                  ].ddlContactRelation
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `emergencyContactDetails.${index}.ddlContactRelation`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `emergencyContactDetails.${index}.ddlContactRelation`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `emergencyContactDetails.${index}.ddlContactRelation`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `emergencyContactDetails.${index}.ddlContactRelation`
                                                  )
                                                }
                                              >
                                                <MenuItem key="-1" value="">
                                                  - None -
                                                </MenuItem>
                                                {employeeEmergencyContactDetails.contactRelation.map(
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
                                                label="Phone Number"
                                                name={`emergencyContactDetails.${index}.txtPhone`}
                                                type="number"
                                                value={
                                                  values
                                                    .emergencyContactDetails[
                                                    index
                                                  ].txtPhone
                                                }
                                                inputProps={{ maxLength: 10 }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `emergencyContactDetails.${index}.txtPhone`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `emergencyContactDetails.${index}.txtPhone`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `emergencyContactDetails.${index}.txtPhone`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `emergencyContactDetails.${index}.txtPhone`
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
                          )}
                          {activeStep === 7 && (
                            <FieldArray name="experienceDetails">
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
                                    onClick={() =>
                                      push(
                                        initialValuesExperienceDetailsEntries
                                      )
                                    }
                                    sx={{ ml: 80, mb: 2 }}
                                  >
                                    Add Experience
                                  </Button>
                                  {values.experienceDetails.map(
                                    (experience, index) => (
                                      <Accordion key={index} sx={{ mb: 2 }}>
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          aria-controls={`experience-${index}-content`}
                                          id={`experience-${index}-header`}
                                        >
                                          <Grid
                                            container
                                            alignItems="center"
                                            spacing={2}
                                          >
                                            <Grid item xs={11}>
                                              <Typography variant="subtitle1">
                                                Experience #{index + 1}
                                                {experience.txtCompanyName &&
                                                  ` - ${experience.txtCompanyName}`}
                                                {experience.txtJobTitle &&
                                                  ` (${experience.txtJobTitle})`}
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
                                              <TextInput
                                                fullWidth
                                                label="Company Name"
                                                name={`experienceDetails.${index}.txtCompanyName`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].txtCompanyName
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtCompanyName`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.txtCompanyName`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtCompanyName`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.txtCompanyName`
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <TextInput
                                                fullWidth
                                                label="Employee ID"
                                                name={`experienceDetails.${index}.txtEmployeeId`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].txtEmployeeId
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtEmployeeId`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.txtEmployeeId`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtEmployeeId`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.txtEmployeeId`
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <TextInput
                                                fullWidth
                                                label="Job Title"
                                                name={`experienceDetails.${index}.txtJobTitle`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].txtJobTitle
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtJobTitle`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.txtJobTitle`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtJobTitle`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.txtJobTitle`
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                              >
                                                <DatePicker
                                                  openTo="day"
                                                  inputFormat="DD/MM/YYYY"
                                                  value={
                                                    values.experienceDetails[
                                                      index
                                                    ].txtStartDate
                                                  }
                                                  onChange={(newValue) => {
                                                    setFieldValue(
                                                      `experienceDetails.${index}.txtStartDate`,
                                                      newValue
                                                    );
                                                  }}
                                                  renderInput={(params) => (
                                                    <CustomField
                                                      name={`experienceDetails.${index}.txtStartDate`}
                                                      label="Start Date"
                                                      error={Boolean(
                                                        getIn(
                                                          touched,
                                                          `experienceDetails.${index}.txtStartDate`
                                                        ) &&
                                                          getIn(
                                                            errors,
                                                            `experienceDetails.${index}.txtStartDate`
                                                          )
                                                      )}
                                                      helperText={
                                                        getIn(
                                                          touched,
                                                          `experienceDetails.${index}.txtStartDate`
                                                        ) &&
                                                        getIn(
                                                          errors,
                                                          `experienceDetails.${index}.txtStartDate`
                                                        )
                                                      }
                                                    >
                                                      <TextField
                                                        {...params}
                                                        fullWidth
                                                        size="medium"
                                                        name={`experienceDetails.${index}.txtStartDate`}
                                                        value={
                                                          values
                                                            .experienceDetails[
                                                            index
                                                          ].txtStartDate
                                                        }
                                                        error={Boolean(
                                                          getIn(
                                                            touched,
                                                            `experienceDetails.${index}.txtStartDate`
                                                          ) &&
                                                            getIn(
                                                              errors,
                                                              `experienceDetails.${index}.txtStartDate`
                                                            )
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
                                                  openTo="day"
                                                  inputFormat="DD/MM/YYYY"
                                                  value={
                                                    values.experienceDetails[
                                                      index
                                                    ].txtEndDate
                                                  }
                                                  onChange={(newValue) => {
                                                    setFieldValue(
                                                      `experienceDetails.${index}.txtEndDate`,
                                                      newValue
                                                    );
                                                  }}
                                                  renderInput={(params) => (
                                                    <CustomField
                                                      name={`experienceDetails.${index}.txtEndDate`}
                                                      label="End Date"
                                                      error={Boolean(
                                                        getIn(
                                                          touched,
                                                          `experienceDetails.${index}.txtEndDate`
                                                        ) &&
                                                          getIn(
                                                            errors,
                                                            `experienceDetails.${index}.txtEndDate`
                                                          )
                                                      )}
                                                      helperText={
                                                        getIn(
                                                          touched,
                                                          `experienceDetails.${index}.txtEndDate`
                                                        ) &&
                                                        getIn(
                                                          errors,
                                                          `experienceDetails.${index}.txtEndDate`
                                                        )
                                                      }
                                                    >
                                                      <TextField
                                                        {...params}
                                                        fullWidth
                                                        size="medium"
                                                        name={`experienceDetails.${index}.txtEndDate`}
                                                        value={
                                                          values
                                                            .experienceDetails[
                                                            index
                                                          ].txtEndDate
                                                        }
                                                        error={Boolean(
                                                          getIn(
                                                            touched,
                                                            `experienceDetails.${index}.txtEndDate`
                                                          ) &&
                                                            getIn(
                                                              errors,
                                                              `experienceDetails.${index}.txtEndDate`
                                                            )
                                                        )}
                                                      />
                                                    </CustomField>
                                                  )}
                                                />
                                              </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <SelectInput
                                                label="Select Country"
                                                name={`experienceDetails.${index}.ddlCountry`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].ddlCountry
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
                                                    `experienceDetails.${index}.ddlCountry`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.ddlCountry`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.ddlCountry`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.ddlCountry`
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
                                              <TextInput
                                                fullWidth
                                                label="City"
                                                name={`experienceDetails.${index}.txtCity`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].txtCity
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtCity`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.txtCity`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtCity`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.txtCity`
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <SelectInput
                                                label="Select State"
                                                name={`experienceDetails.${index}.ddlState`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].ddlState
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.ddlState`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.ddlState`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.ddlState`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.ddlState`
                                                  )
                                                }
                                              >
                                                <MenuItem key="-1" value="">
                                                  - None -
                                                </MenuItem>
                                                {states.map((option, i) => (
                                                  <MenuItem
                                                    key={i}
                                                    value={option}
                                                  >
                                                    {option}
                                                  </MenuItem>
                                                ))}
                                              </SelectInput>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <SelectInput
                                                label="Employment Type"
                                                name={`experienceDetails.${index}.ddlEmploymentType`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].ddlEmploymentType
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.ddlEmploymentType`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.ddlEmploymentType`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.ddlEmploymentType`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.ddlEmploymentType`
                                                  )
                                                }
                                              >
                                                <MenuItem key="-1" value="">
                                                  - None -
                                                </MenuItem>
                                                {employeeProfessionalDetails.employmentType.map(
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
                                                label="Supervisor Name"
                                                name={`experienceDetails.${index}.txtSupervisorName`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].txtSupervisorName
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtSupervisorName`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.txtSupervisorName`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtSupervisorName`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.txtSupervisorName`
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <TextInput
                                                fullWidth
                                                label="Supervisor Phone No"
                                                type="number"
                                                name={`experienceDetails.${index}.txtSupervisorPhone`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].txtSupervisorPhone
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtSupervisorPhone`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.txtSupervisorPhone`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtSupervisorPhone`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.txtSupervisorPhone`
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
                          )}
                          {activeStep === 8 && (
                            <DocumentUploadStep
                              values={values}
                              setFieldValue={setFieldValue}
                              documentTypes={documentTypes}
                              userId={userId}
                              errors={errors}
                              touched={touched}
                            />
                          )}

                          <CardActions>
                            <Button
                              color="secondary"
                              variant="contained"
                              onClick={handleBack}
                              sx={{ mr: 1 }}
                            >
                              {activeStep === 0 ? 'Back' : 'Previous Step'}
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {isLastStep ? (
                              <Button
                                color="primary"
                                variant="contained"
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleEmployeeSubmit}
                              >
                                Submit
                              </Button>
                            ) : (
                              <Button
                                color="primary"
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                              >
                                Next Step
                              </Button>
                            )}
                          </CardActions>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </>
            </AdminFormLayout>
          ) : (
            <Loader />
          )}
        </AdminDashboardPage>
      </>
    </Box>
  );
};

export default EditEmployee;
