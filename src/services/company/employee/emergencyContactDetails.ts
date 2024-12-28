// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------
export const insertEmployeeEmergencyContactDetailRequest = (
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .post(
      'admin/company/employeeEmergencyContact/InsertAllEmployeeEmergencyContacts',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const updateEmployeeEmergencyContactDetailRequest = (
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      'admin/company/employeeEmergencyContact/UpdateEmployeeEmergencyContact',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
