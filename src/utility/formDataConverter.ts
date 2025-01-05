import {
  AddressDetail,
  FamilyDetail,
  EducationDetail,
  ArrayRequestData
} from '../models/company/employee';

export const convertToFormData = (data: ArrayRequestData): FormData => {
  const formData = new FormData();

  if (data.addressDetails) {
    formData.append('addressDetails', JSON.stringify(data.addressDetails));
  }

  if (data.familyDetails) {
    formData.append('familyDetails', JSON.stringify(data.familyDetails));
  }

  if (data.educationalDetails) {
    formData.append(
      'educationalDetails',
      JSON.stringify(data.educationalDetails)
    );
  }

  if (data.emergencyContacts) {
    formData.append(
      'emergencyContacts',
      JSON.stringify(data.emergencyContacts)
    );
  }

  if (data.experienceDetails) {
    formData.append(
      'experienceDetails',
      JSON.stringify(data.experienceDetails)
    );
  }

  return formData;
};
