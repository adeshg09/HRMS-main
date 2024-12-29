// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------
export const insertEmployeeExperienceDetailRequest = (
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .post(
      'admin/company/employeeExperienceDetail/InsertAllEmployeeExperienceDetails',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const updateEmployeeExperienceDetailRequest = (
  userId: number | null,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `admin/company/employeeExperienceDetail/UpdateEmployeeExperienceDetail/${userId}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
