// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------
export const insertEmployeeFamilyDetailRequest = (
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .post(
      'admin/company/employeeFamilyDetail/InsertAllEmployeeFamilyDetails',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const updateEmployeeFamilyDetailRequest = (
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      'admin/company/employeeFamilyDetail/UpdateEmployeeFamilyDetail',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
