// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------
export const insertEmployeeProfessionalDetailRequest = (
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .post(
      'admin/company/employeeProfessionalDetail/InsertEmployeeProfessionalDetail',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const updateEmployeeProfessionalDetailRequest = (
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      'admin/company/employeeProfessionalDetail/UpdateEmployeeProfessionalDetail',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
