// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const insertEmployeePersonalDetailRequest = (
  reqData: FormData
): Promise<any> => {
  console.log('reqData is', reqData);
  return axiosInstance
    .post(
      'admin/company/employeePersonalDetail/InsertEmployeePersonalDetail',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data)
    .catch((e) => console.log('error is', e));
};

export const updateEmployeePersonalDetailRequest = (
  userId: number | null,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `admin/company/employeePersonalDetail/UpdateEmployeePersonalDetail/${userId}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const getEmployeePersonalDetailsByUserIdRequest = (
  userId: number | null
): Promise<any> => {
  return axiosInstance
    .get(
      `admin/company/employeePersonalDetail/GetEmployeePersonalDetailByUserId/${userId}`
    )
    .then((response) => response.data);
};
