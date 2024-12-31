// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------
export const insertEmployeeAddressDetailRequest = (
  reqData: any
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
  userId: number | null,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `admin/company/employeeAddress/InsertAllEmployeeAddresses/${userId}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const getEmployeeAddressDetailsByUserIdRequest = (
  userId: number | null
): Promise<any> => {
  return axiosInstance
    .get(`admin/company/employeeAddress/GetEmployeeAddressesByUserId/${userId}`)
    .then((response) => response.data);
};
