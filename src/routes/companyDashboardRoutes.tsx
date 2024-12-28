/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the company routes.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 17/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/* Relative Imports */
import AdminDashboardLayout from 'layout/AdminDashboardLayout';

/* Local Imports */
import { PAGE_COMPANY_DASHBOARD } from './paths';
import AuthGuard from './guards/AuthGuard';

// ----------------------------------------------------------------------

/* Company Dashboard Module Imports */
const ManageRolePage = lazy(
  () => import('views/company-dashboard/dashboard/roles/ManageRole')
);

const ManageDesignationPage = lazy(
  () =>
    import('views/company-dashboard/dashboard/designations/ManageDesignation')
);

const CreateDesignationPage = lazy(
  () =>
    import('views/company-dashboard/dashboard/designations/CreateDesignation')
);

const ManageUserPage = lazy(
  () => import('views/company-dashboard/dashboard/users/ManageUser')
);

const CreateUserPage = lazy(
  () => import('views/company-dashboard/dashboard/users/CreateUser')
);

const ManageEmployeePage = lazy(
  () => import('views/company-dashboard/dashboard/employees/ManageEmployee')
);

const CreateEmployeePage = lazy(
  () => import('views/company-dashboard/dashboard/employees/CreateEmployee')
);

const EditEmployeePage = lazy(
  () => import('views/company-dashboard/dashboard/employees/EditEmployee')
);

const ManageClientPage = lazy(
  () => import('views/company-dashboard/dashboard/clients/ManageClient')
);

const CreateClientPage = lazy(
  () => import('views/company-dashboard/dashboard/clients/CreateClient')
);

const ManageProjectPage = lazy(
  () => import('views/company-dashboard/dashboard/projects/ManageProjects')
);

const CreateProjectPage = lazy(
  () => import('views/company-dashboard/dashboard/projects/CreateProjects')
);

const ReportingModulePage = lazy(
  () => import('views/company-dashboard/dashboard/reporting-module')
);

const ManageMyProjectPage = lazy(
  () => import('views/company-dashboard/dashboard/my-projects/MyProjects')
);

const ManageMyTrackerPage = lazy(
  () => import('views/company-dashboard/dashboard/my-tracker')
);

// const ManageEmployeeTrackerPage = lazy(
//   () =>
//     import('views/company-dashboard/dashboard/employee-tracker/EmployeeTracker')
// );

const NotAllowedPage = lazy(() => import('views/page-not-allowed'));

// ----------------------------------------------------------------------

/* Functions */
/**
 * function to fetch routes
 * @param {string} primaryAccessRole - primary access role to get routes
 * @param {boolean} isProjectLeader - is project leader to get routes
 * @returns {void}
 */
const getCompanyDashboardRoutes = (
  primaryAccessRole: string,
  isProjectLeader: boolean
): Array<object> => {
  let dashboardRoutes: Array<object> = [
    {
      path: PAGE_COMPANY_DASHBOARD.root.relativePath,
      element: (
        <AuthGuard>
          <AdminDashboardLayout>
            <></>
          </AdminDashboardLayout>
        </AuthGuard>
      )
    }
  ];
  if (primaryAccessRole) {
    let rootRedirect = PAGE_COMPANY_DASHBOARD.myTracker.absolutePath;
    if (primaryAccessRole === 'admin') {
      rootRedirect = PAGE_COMPANY_DASHBOARD.roles.absolutePath;
    } else if (primaryAccessRole === 'contentManager') {
      rootRedirect = PAGE_COMPANY_DASHBOARD.designations.absolutePath;
    }

    dashboardRoutes = [
      {
        path: PAGE_COMPANY_DASHBOARD.root.relativePath,
        element: (
          <AuthGuard>
            <AdminDashboardLayout>
              <Outlet />
            </AdminDashboardLayout>
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={rootRedirect} />
          },
          {
            path: PAGE_COMPANY_DASHBOARD.roles.relativePath,
            element:
              primaryAccessRole === 'admin' ? (
                <ManageRolePage />
              ) : (
                <NotAllowedPage />
              )
          },
          {
            path: PAGE_COMPANY_DASHBOARD.designations.relativePath,
            children:
              primaryAccessRole === 'admin' ||
              primaryAccessRole === 'contentManager'
                ? [
                    {
                      index: true,
                      element: <ManageDesignationPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.designations.create
                        .relativePath,
                      element: <CreateDesignationPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.designations.edit
                        .relativePath,
                      element: <CreateDesignationPage />
                    }
                  ]
                : [
                    {
                      index: true,
                      element: <NotAllowedPage />
                    }
                  ]
          },
          {
            path: PAGE_COMPANY_DASHBOARD.users.relativePath,
            children:
              primaryAccessRole === 'admin'
                ? [
                    {
                      index: true,
                      element: <ManageUserPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.users.create.relativePath,
                      element: <CreateUserPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.users.edit.relativePath,
                      element: <CreateUserPage />
                    }
                  ]
                : [
                    {
                      index: true,
                      element: <NotAllowedPage />
                    }
                  ]
          },
          {
            path: PAGE_COMPANY_DASHBOARD.employees.relativePath,
            children:
              primaryAccessRole === 'admin'
                ? [
                    {
                      index: true,
                      element: <ManageEmployeePage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.employees.create
                        .relativePath,
                      element: <CreateEmployeePage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.employees.edit.relativePath,
                      element: <EditEmployeePage />
                    }
                  ]
                : [
                    {
                      index: true,
                      element: <NotAllowedPage />
                    }
                  ]
          },
          {
            path: PAGE_COMPANY_DASHBOARD.clients.relativePath,
            children:
              primaryAccessRole === 'admin' ||
              primaryAccessRole === 'contentManager'
                ? [
                    {
                      index: true,
                      element: <ManageClientPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.clients.create.relativePath,
                      element: <CreateClientPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.clients.edit.relativePath,
                      element: <CreateClientPage />
                    }
                  ]
                : [
                    {
                      index: true,
                      element: <NotAllowedPage />
                    }
                  ]
          },
          {
            path: PAGE_COMPANY_DASHBOARD.projects.relativePath,
            children:
              primaryAccessRole === 'admin' ||
              primaryAccessRole === 'contentManager'
                ? [
                    {
                      index: true,
                      element: <ManageProjectPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.projects.create.relativePath,
                      element: <CreateProjectPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.projects.edit.relativePath,
                      element: <CreateProjectPage />
                    }
                  ]
                : [
                    {
                      index: true,
                      element: <NotAllowedPage />
                    }
                  ]
          },
          {
            path: PAGE_COMPANY_DASHBOARD.reporting.relativePath,
            element:
              primaryAccessRole === 'admin' ? (
                <ReportingModulePage />
              ) : (
                <NotAllowedPage />
              )
          },
          {
            path: PAGE_COMPANY_DASHBOARD.myTracker.relativePath,
            element: <ManageMyTrackerPage />
          },
          {
            path: PAGE_COMPANY_DASHBOARD.myProjects.relativePath,
            element: <ManageMyProjectPage />
          }
          // {
          //   path: PAGE_COMPANY_DASHBOARD.employeeTracker.relativePath,
          //   element: isProjectLeader ? (
          //     <ManageEmployeeTrackerPage />
          //   ) : (
          //     <NotAllowedPage />
          //   )
          // }
        ]
      }
    ];
  }

  return dashboardRoutes;
};

export default getCompanyDashboardRoutes;
