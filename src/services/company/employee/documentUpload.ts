/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const uploadEmployeeDocument = async (
  formData: FormData
): Promise<any> => {
  return axiosInstance.post(
    '/admin/company/employeeDocument/InsertEmployeeDocument',
    formData
  );
};
