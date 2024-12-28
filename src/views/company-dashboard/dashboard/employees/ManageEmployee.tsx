import React from 'react';
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';

/* constants */
const addEmployeePath = PAGE_COMPANY_DASHBOARD.employees.create.relativePath;
const editEmployeePath = PAGE_COMPANY_DASHBOARD.employees.edit.relativePath;
/**
 *Component to create the employee listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageEmployee = (): JSX.Element => {
  return <div>ManageEmployee</div>;
};

export default ManageEmployee;
