// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------
export const insertEmployeeAddressDetailRequest = (
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .post('admin/company/employeeAddress/InsertAllEmployeeAddresses', reqData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.data);
};

export const updateEmployeeAddressDetailRequest = (
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put('admin/company/employeeAddress/InsertAllEmployeeAddresses', reqData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.data);
};
