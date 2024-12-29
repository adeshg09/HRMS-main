// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------
export const insertEmployeeEducationalDetailRequest = (
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .post(
      'admin/company/employeeEducationalDetail/InsertAllEmployeeEducationalDetails',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const updateEmployeeEducationalDetailRequest = (
  userId: number | null,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `admin/company/employeeEducationalDetail/UpdateEmployeeEducationalDetail/${userId}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
