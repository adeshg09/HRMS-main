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

export interface AddEmployeeProfessionalDetailsFormValues {
  txtEmployeeCode: string;
  ddlDesignation: number | '';
  txtJoinDate: string;
  ddlEmploymentType: string;
  ddlWorkingType: string;
}

export interface AddEmployeeFamilyDetailsFormValues {
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
  txtContactName: string;
  txtContactAddress: string;
  ddlContactRelation: string;
  txtPhone: string;
}

export interface AddEmployeeAddressDetailsFormValues {
  ddlAddressType: string;
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

export interface AddEmployeeEducationDetailsFormValues {
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
