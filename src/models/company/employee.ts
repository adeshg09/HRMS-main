import { ShortRoleModel } from './Role';

/* Create Employee Form interfaces */
export interface AddUserFormValues {
  txtFirstName: string;
  txtLastName: string;
  txtEmail: string;
  txtPassword: string;
  txtPhone?: string;
  ddlRoles: Array<number>;
  chkIsActive: boolean;
  chkShowActivity?: boolean;
}
export interface UserValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  roles: Array<ShortRoleModel>;
  is_active: boolean;
  show_activity?: boolean;
}

export interface AddEmployeePersonalDetailsFormValues {
  txtBirthDate: string;
  txtAge: number;
  ddlBirthCountry: string;
  ddlBirthState: string;
  txtBirthLocation: string;
  ddlGender: string;
  ddlMaritalStatus: string;
  txtMarriageDate?: string;
  ddlBloodGroup: string;
  txtPanNumber: string;
  txtCaste: string;
  txtReligion: string;
  txtResidence?: string;
}

export interface PersonalDetailsValues {
  birth_date: string;
  age: number;
  birth_country: string;
  birth_state: string;
  birth_location: string;
  gender: string;
  marital_status: string;
  marriage_date?: string;
  blood_group: string;
  pan_number: string;
  caste: string;
  religion: string;
  residence?: string;
}

export interface AddEmployeeProfessionalDetailsFormValues {
  txtEmployeeCode: string;
  ddlDesignation: number | '';
  txtJoinDate: string;
  ddlEmploymentType: string;
  ddlWorkingType: string;
}
export interface ProfessionalDetailsValues {
  employee_code: string;
  designation_id: number | '';
  join_date: string;
  employment_type: string;
  working_type: string;
}

export interface AddEmployeeFamilyDetailsFormValues {
  txtId?: number | null;
  ddlRelationType: string;
  txtName: string;
  txtAge: string;
  txtBirthDate: string;
  txtCurrentAddress: string;
  ddlBirthCountry: string;
  ddlBirthState: string;
  txtBirthLocation: string;
  txtOccupation: string;
  txtPhone: string;
}

export interface AddEmployeeEmergencyContactDetailsFormValues {
  txtId?: number | null,
  txtContactName: string;
  txtContactAddress: string;
  ddlContactRelation: string;
  txtPhone: string;
}

export interface AddEmployeeAddressDetailsFormValues {
  txtId?: number | null;
  ddlAddressType: string;
  txtBuildingName: string;
  txtFlatNumber: string;
  txtStreetName: string;
  txtLandmark: string;
  txtCity: string;
  ddlCountry: string;
  ddlState: string;
  txtPincode: string;
  txtTelephoneNumber: string;
  txtPhone: string;
}

export interface AddEmployeeEducationDetailsFormValues {
  txtId?: number | null;
  ddlCourse: string;
  txtDegreeSpecialization: string;
  txtInstituteName: string;
  txtFromDate: string;
  txtToDate: string;
  ddlStatus: string;
  ddlStudyMode: string;
  txtPercentage: string;
}

export interface AddEmployeeExperienceDetailsFormValues {
  txtId: number | null;
  txtCompanyName: string;
  txtEmployeeId: string;
  txtJobTitle: string;
  txtStartDate: string;
  txtEndDate: string;
  ddlCountry: string;
  txtCity: string;
  ddlState: string;
  ddlEmploymentType: string;
  txtSupervisorName: string;
  txtSupervisorPhone: string;
}

export interface AddEmployeeDocumentsFormValues {
  documentTypeId: number;
  employeeDocument: File | string | null;
}

export interface AddEmployeeDetailsFormValues {
  txtFirstName: string;
  txtLastName: string;
  txtEmail: string;
  txtPassword: string;
  txtPhone?: string;
  ddlRoles: Array<number>;
  chkIsActive: boolean;
  chkShowActivity?: boolean;

  txtBirthDate: string;
  txtAge: number;
  ddlBirthCountry: string;
  ddlBirthState: string;
  txtBirthLocation: string;
  ddlGender: string;
  ddlMaritalStatus: string;
  txtMarriageDate?: string;
  ddlBloodGroup: string;
  txtPanNumber: string;
  txtCaste: string;
  txtReligion: string;
  txtResidence?: string;

  txtEmployeeCode: string;
  ddlDesignation: number | '';
  txtJoinDate: string;
  ddlEmploymentType: string;
  ddlWorkingType: string;

  addressDetails: AddEmployeeAddressDetailsFormValues[];
  familyDetails: AddEmployeeFamilyDetailsFormValues[];
  educationDetails: AddEmployeeEducationDetailsFormValues[];
  emergencyContactDetails: AddEmployeeEmergencyContactDetailsFormValues[];
  experienceDetails: AddEmployeeExperienceDetailsFormValues[];
  documentDetails: AddEmployeeDocumentsFormValues[];
}

/* Edit Employee Form interfaces */
export interface EditUserFormValues {
  txtFirstName: string;
  txtLastName: string;
  txtEmail: string;
  txtPassword: string;
  txtPhone?: string;
  ddlRoles: Array<number>;
  chkIsActive: boolean;
  chkShowActivity?: boolean;
}

export interface EditEmployeePersonalDetailsFormValues {
  txtBirthDate: string;
  txtAge: number;
  ddlBirthCountry: string;
  ddlBirthState: string;
  txtBirthLocation: string;
  ddlGender: string;
  ddlMaritalStatus: string;
  txtMarriageDate?: string;
  ddlBloodGroup: string;
  txtPanNumber: string;
  txtCaste: string;
  txtReligion: string;
  txtResidence?: string;
}

export interface EditEmployeeProfessionalDetailsFormValues {
  txtEmployeeCode: string;
  ddlDesignation: number | '';
  txtJoinDate: string;
  ddlEmploymentType: string;
  ddlWorkingType: string;
}

export interface EditEmployeeFamilyDetailsFormValues {
  ddlRelationType: string;
  txtName: string;
  txtAge: string;
  txtBirthDate: string;
  txtCurrentEditress: string;
  ddlBirthCountry: string;
  ddlBirthState: string;
  txtBirthLocation: string;
  txtOccupation: string;
  txtPhone: string;
}

export interface EditEmployeeEmergencyContactDetailsFormValues {
  txtContactName: string;
  txtContactEditress: string;
  ddlContactRelation: string;
  txtPhone: string;
}

export interface EditEmployeeEditressDetailsFormValues {
  ddlEditressType: string;
  txtBuildingName: string;
  txtFlatNumber: string;
  txtStreetName: string;
  txtLandmark: string;
  txtCity: string;
  ddlState: string;
  txtPincode: string;
  txtTelephoneNumber: string;
  txtPhone: string;
}

export interface EditEmployeeEducationDetailsFormValues {
  ddlCourse: string;
  txtDegreeSpecialization: string;
  txtInstituteName: string;
  txtFromDate: string;
  txtToDate: string;
  ddlStatus: string;
  ddlStudyMode: string;
  txtPercentage: string;
}

export interface EditEmployeeExperienceDetailsFormValues {
  txtCompanyName: string;
  txtEmployeeId: string;
  txtJobTitle: string;
  txtStartDate: string;
  txtEndDate: string;
  ddlCountry: string;
  txtCity: string;
  ddlState: string;
  ddlEmploymentType: string;
  txtSupervisorName: string;
  txtSupervisorPhone: string;
}

export interface AddressDetail {
  addressType: string;
  buildingName: string;
  flatNumber: string;
  streetName: string;
  landmark: string;
  city: string;
  country: string;
  state: string;
  pincode: string;
  telephoneNumber: string;
  phone: string;
  userId?: number;
}

export interface FamilyDetail {
  relationType: string;
  name: string;
  age: string;
  birthDate: string;
  currentAddress: string;
  birthCountry: string;
  birthState: string;
  birthLocation: string;
  occupation: string;
  phone: string;
  userId?: number;
}

export interface EducationDetail {
  course: string;
  degreeSpecialization: string;
  instituteName: string;
  fromDate: string;
  toDate: string;
  status: string;
  studyMode: string;
  percentage: string;
  userId?: number;
}
export interface EmergencyContactDetail {
  contactName: string;
  contactAddress: string;
  contactRelation: string;
  phone: string;
  userId?: number;
}

export interface ExperienceDetail {
  companyName: string;
  employeeId: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  country: string;
  city: string;
  state: string;
  employmentType: string;
  supervisorName: string;
  supervisorPhone: string;
  userId?: number;
}

export interface ArrayRequestData {
  addressDetails?: AddressDetail[];
  familyDetails?: FamilyDetail[];
  educationalDetails?: EducationDetail[];
  emergencyContacts?: EmergencyContactDetail[];
  experienceDetails?: ExperienceDetail[];
}
