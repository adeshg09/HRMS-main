/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage employee Page to handle the users.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  Switch,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

/* Relative Imports */
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
import MyAvatar from 'components/MyAvatar';
import { ConfirmDialog } from 'components/Dialog';
import useSnackbarClose from 'hooks/useSnackbarClose';
import {
  removeItemFromArray,
  updateItemFromArray,
  updateNestedItemFromArray
} from 'utility/formatArray';
import { toastMessages } from 'constants/appConstant';
import { apiBaseUrl } from 'config/config';
import {
  ShortDesignationModel,
  ShortRoleModel,
  UserProfileModel
} from 'models/company';
import { getDesignationsRequest } from 'services/company/designation';
import { getRolesRequest } from 'services/company/role';

/* Local Imports */
import {
  deleteUserRequest,
  getUsersRequest,
  updateUserActivityStatusRequest,
  updateUserStatusRequest
} from 'services/company/employee/accountSetup';
import { ProfessionalDetailsValues } from 'models/company/employee';
import adminStyle from '../../company.style';

// ----------------------------------------------------------------------

/* constants */
const addEmployeePath = PAGE_COMPANY_DASHBOARD.employees.create.relativePath;
const editEmployeePath = PAGE_COMPANY_DASHBOARD.employees.edit.relativePath;

const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this employee?</>,
  userId: 0
};

const initialStateStatusDialog = {
  open: false,
  title: <>Update</>,
  description: <>Are you sure you want to update this employee's status?</>,
  userId: 0,
  isActive: 0
};

const initialStateShowActivityDialog = {
  open: false,
  title: <>Update</>,
  description: <>Are you sure you want to show activity to this employee?</>,
  userId: 0,
  showActivity: 0
};

// ----------------------------------------------------------------------

/**
 *Component to create the employee listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageEmployee = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<UserProfileModel>>([]);
  const [originalData, setOriginalData] = useState<Array<UserProfileModel>>([]);
  const [employeeProfessionalDetailsData, setEmployeeProfessionalDetailsData] =
    useState<ProfessionalDetailsValues>();
  const [deleteDialog, setDeleteDialog] = useState(initialStateDeleteDialog);
  const [statusDialog, setStatusDialog] = useState(initialStateStatusDialog);
  const [showActvityDialog, setShowActivityDialog] = useState(
    initialStateShowActivityDialog
  );
  const [loading, setLoading] = useState(false);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [designations, setDesignations] = useState<
    Array<ShortDesignationModel>
  >([]);
  const [roles, setRoles] = useState<Array<ShortRoleModel>>([]);
  const [filters, setFilters] = useState({
    designationId: '',
    roleId: '',
    searchText: ''
  });

  /* Functions */
  /**
   * function to open the delete dialog box
   *
   * @param {number} userId - id of selected user to delete
   * @param {string} name - name of selected user to confirm
   * @returns {void}
   */
  const handleOpenDialog = (userId: number, name: string): void => {
    setDeleteDialog({
      open: true,
      title: (
        <>
          <b>Delete {name}</b>
        </>
      ),
      description: <>Are you sure you want to delete this employee?</>,
      userId
    });
  };

  /**
   * function to close the delete dialog box
   *
   * @returns {void}
   */
  const handleCloseDialog = (): void => {
    setDeleteDialog(initialStateDeleteDialog);
  };

  /**
   * function to open the status dialog box
   *
   * @param {number} userId - id of selected user to update status
   * @param {string} userName - name of selected user to confirm
   * @param {boolean|null|undefined} isActive - active status of selected user to update
   * @returns {void}
   */
  const handleOpenStatusDialog = (
    userId: number,
    userName: string,
    isActive: boolean | null | undefined
  ): void => {
    const popuptext = `${
      isActive === true
        ? 'Are you sure you want to deactivate this employee'
        : 'Are you sure you want to activate this employee'
    }`;
    const popupdesc = (
      <>
        {popuptext} - <b>"{userName}"</b>?
      </>
    );
    setStatusDialog({
      open: true,
      title:
        isActive === true ? <>Deactivate Employee</> : <>Activate Employee</>,
      description: popupdesc,
      userId,
      isActive: isActive === true ? 0 : 1
    });
  };

  /**
   * function to open the show activity dialog box
   *
   * @param {number} userId - id of selected user to update status
   * @param {string} userName - name of selected user to confirm
   * @param {boolean|null|undefined} showActivity - active status of selected user to update
   * @returns {void}
   */

  const handleShowActivityDialog = (
    userId: number,
    userName: string,
    showActivity: boolean | null | undefined
  ): void => {
    const popuptext = `${
      showActivity === true
        ? 'Are you sure you want to hide activity for this employee?'
        : 'Are you sure you want to show activity for this employee?'
    }`;
    const popupdesc = (
      <>
        {popuptext} - <b>"{userName}"</b>?
      </>
    );
    setShowActivityDialog({
      open: true,
      title: showActivity === true ? <>Hide Activity</> : <>Show Activity</>,
      description: popupdesc,
      userId,
      showActivity: showActivity === true ? 0 : 1
    });
  };

  /**
   * function to close the status dialog box
   *
   * @returns {void}
   */
  const handleCloseStatusDialog = (): void => {
    setStatusDialog(initialStateStatusDialog);
  };

  /**
   * function to close the status dialog box
   *
   * @returns {void}
   */
  const handleCloseShowActivityDialog = (): void => {
    setShowActivityDialog(initialStateShowActivityDialog);
  };
  /**
   * function to delete the employee with backend action
   *
   * @param {number} userId - id of selected user to delete
   * @returns {void}
   */
  const handleDeleteEmployee = async (userId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deleteUserRequest(userId, user.id);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.employee.employeeAccountDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', userId));
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setDialogSubmitting(false);
    handleCloseDialog();
  };

  /**
   * function to get all the employees with backend action
   *
   * @returns {void}
   */
  const handleGetEmployees = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getUsersRequest();
      console.log('users are', response);
      if (response?.status.response_code === 200) {
        setRows(response.users || []);
        setOriginalData(response.users || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get all the designations with backend action
   *
   * @returns {void}
   */
  const handleGetDesignations = async (): Promise<void> => {
    try {
      const response = await getDesignationsRequest();
      if (response?.status.response_code === 200) {
        setDesignations(response.designations || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to get all the roles with backend action
   *
   * @returns {void}
   */
  const handleGetRoles = async (): Promise<void> => {
    try {
      const response = await getRolesRequest();
      if (response?.status.response_code === 200) {
        setRoles(response.roles || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to update active state
   *
   * @param {number} userId - id of the current user.
   * @param {any} isUserActive - status of the current user.
   * @returns {void}
   */
  const handleUpdateActiveEmployee = async (
    userId: number,
    isUserActive: any
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const requestData: any = {
        isActive: isUserActive,
        modifiedBy: user.id
      };
      const response = await updateUserStatusRequest(userId, requestData);
      if (response && response.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.employee.employeeStatusUpdated,
          'success'
        );
        setRows(
          updateItemFromArray(rows, 'id', userId, 'is_active', !!isUserActive)
        );
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setDialogSubmitting(false);
    handleCloseStatusDialog();
  };

  /**
   * function to update active state
   *
   * @param {number} userId - id of the current user.
   * @param {any} isUserActive - status of the current user.
   * @returns {void}
   */
  const handleUpdateShowActivityStatus = async (
    userId: number,
    showActivityVar: any
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const requestData: any = {
        showActivity: showActivityVar,
        modifiedBy: user.id
      };
      const response = await updateUserActivityStatusRequest(
        userId,
        requestData
      );
      if (response && response.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.employee
            .employeeActivityStatusUpdated,
          'success'
        );
        setRows(
          updateNestedItemFromArray(
            rows,
            'id',
            userId,
            'profile.show_activity',
            !!showActivityVar
          )
        );
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setDialogSubmitting(false);
    handleCloseShowActivityDialog();
  };

  /**
   * function to handle the filters
   *
   * @returns {void}
   */
  const handleFilterChange = async (): Promise<void> => {
    let updatedRows = originalData;

    if (filters.designationId) {
      updatedRows = updatedRows.filter(
        (item) =>
          String(item.profile.designation_id) === String(filters.designationId)
      );
    }

    if (filters.roleId) {
      updatedRows = updatedRows.filter((item) =>
        item.roles.map((ritem) => String(ritem.id)).includes(filters.roleId)
      );
    }

    if (filters.searchText) {
      updatedRows = updatedRows.filter(
        (item) =>
          item.first_name
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.last_name
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.email.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
            -1 ||
          (item.phone || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.profile.employee_code || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };

  /* Columns */
  const columns = [
    {
      field: 'profile_photo',
      headerName: 'Profile Image',
      width: 120,
      headerAlign: 'center',
      renderCell: (params: UserProfileModel) => (
        <MyAvatar
          src={`${apiBaseUrl}${params.profile_photo}`}
          width="80px"
          height="80px"
          sx={adminStyle.tableProfileAvatar}
        />
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      flex: 1,
      renderCell: (params: UserProfileModel) =>
        `${params.first_name} ${params.last_name}`
    },
    {
      field: 'employee_code',
      headerName: 'Employee Code',
      sortable: true,
      width: 160,
      renderCell: (params: ProfessionalDetailsValues) =>
        params.employee_code || '-'
    },
    {
      field: 'email',
      headerName: 'Email Address',
      sortable: true,
      width: 230
    },
    // {
    //   field: 'phone',
    //   headerName: 'Phone No',
    //   sortable: true,
    //   width: 130
    // },
    {
      field: 'roles',
      headerName: 'Assigned Roles',
      sortable: false,
      width: 170,
      renderCell: (params: UserProfileModel) => (
        <List disablePadding>
          {params.roles.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ChevronRightIcon />
              <span>{item.name}</span>
            </ListItem>
          ))}
        </List>
      )
    },
    {
      field: 'is_active',
      headerName: 'Allow SignIn',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: UserProfileModel) => (
        <>
          <FormControlLabel
            control={
              <Switch
                checked={!!params.is_active}
                onChange={() => {
                  handleOpenStatusDialog(
                    params.id,
                    `${params.first_name} ${params.last_name}`,
                    params.is_active
                  );
                }}
              />
            }
            label=""
          />
        </>
      )
    },
    {
      field: 'show_activity',
      headerName: 'Show Activity',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 130,
      renderCell: (params: UserProfileModel) => (
        <>
          <FormControlLabel
            control={
              <Switch
                checked={!!params.profile.show_activity}
                onChange={() => {
                  handleShowActivityDialog(
                    params.id,
                    `${params.first_name} ${params.last_name}`,
                    params.profile.show_activity
                  );
                }}
              />
            }
            label=""
          />
        </>
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 90,
      renderCell: (params: UserProfileModel) => (
        <>
          {(!params.profile.is_super_admin || params.id === user.id) && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editEmployeePath.replace(':id', `${params.id}`))
                }
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                aria-label="delete"
                onClick={() =>
                  handleOpenDialog(
                    params.id,
                    `${params.first_name} ${params.last_name}`
                  )
                }
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </>
      )
    }
  ];

  /* Side-Effects */
  useEffect(() => {
    handleGetEmployees();
    handleGetDesignations();
    handleGetRoles();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  return (
    <AdminDashboardPage title="Manage Employees">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={3} md={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addEmployeePath)}
          >
            Add Employee
          </Button>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            select
            fullWidth
            label="Select Designation"
            size="small"
            value={filters.designationId}
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            onChange={(e: any) => {
              setFilters({ ...filters, designationId: e.target.value });
            }}
          >
            <option key="-1" value="">
              - None -
            </option>
            {designations.map((option: ShortDesignationModel) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            select
            fullWidth
            label="Select Role"
            size="small"
            value={filters.roleId}
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            onChange={(e: any) => {
              setFilters({ ...filters, roleId: e.target.value });
            }}
          >
            <option key="-1" value="">
              - None -
            </option>
            {roles.map((option: ShortRoleModel) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            fullWidth
            label="Search"
            size="small"
            value={filters.searchText}
            variant="outlined"
            inputProps={{ maxLength: 100 }}
            onChange={(e) => {
              setFilters({ ...filters, searchText: e.target.value });
            }}
          />
        </Grid>
      </Grid>
      <DataTable
        columns={columns}
        rows={rows}
        totalRow={rows.length}
        isLoading={loading}
      />
      <ConfirmDialog
        open={deleteDialog.open}
        title={deleteDialog.title}
        description={deleteDialog.description}
        isSubmitting={dialogSubmitting}
        agreeText="Delete"
        disagreeText="Cancel"
        onAgreeAction={() => handleDeleteEmployee(deleteDialog.userId)}
        onDisAgreeAction={handleCloseDialog}
      />
      <ConfirmDialog
        open={statusDialog.open}
        title={statusDialog.title}
        description={statusDialog.description}
        isSubmitting={dialogSubmitting}
        agreeText="Yes"
        disagreeText="No"
        onAgreeAction={() =>
          handleUpdateActiveEmployee(statusDialog.userId, statusDialog.isActive)
        }
        onDisAgreeAction={handleCloseStatusDialog}
      />
      <ConfirmDialog
        open={showActvityDialog.open}
        title={showActvityDialog.title}
        description={showActvityDialog.description}
        isSubmitting={dialogSubmitting}
        agreeText="Yes"
        disagreeText="No"
        onAgreeAction={() =>
          handleUpdateShowActivityStatus(
            showActvityDialog.userId,
            showActvityDialog.showActivity
          )
        }
        onDisAgreeAction={handleCloseShowActivityDialog}
      />
    </AdminDashboardPage>
  );
};

export default ManageEmployee;
