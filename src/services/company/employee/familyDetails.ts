// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';
import { AddEmployeeFamilyDetailsFormValues } from 'models/company/employee';

// ----------------------------------------------------------------------
export const insertEmployeeFamilyDetailRequest = (
  reqData: any
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
  userId: number | null,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `admin/company/employeeFamilyDetail/UpdateEmployeeFamilyDetail/${userId}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
