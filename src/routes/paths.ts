/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define all the paths.
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

/* Constants */
const ROOT_PATH = '/';
const ROOT_ADMIN_DASHBOARD = 'admin-dashboard';
const ROOT_COMPANY_DASHBOARD = 'company-dashboard';

/* Home Page */
export { ROOT_PATH };

/* Root Pages */
export const PAGE_ROOT = {
  signIn: {
    relativePath: 'signin',
    absolutePath: '/signin'
  },
  forgotPassword: {
    relativePath: 'forgot-password',
    absolutePath: '/forgot-password'
  },
  resetPassword: {
    relativePath: 'reset-password/:token',
    absolutePath: '/reset-password/:token'
  },
  account: {
    relativePath: 'my-account',
    absolutePath: '/my-account'
  },
  notFound: {
    relativePath: 'not-found',
    absolutePath: '/not-found'
  },
  notAllowed: {
    relativePath: 'not-allowed',
    absolutePath: '/not-allowed'
  }
};

/* Admin Dashboard Pages */
export const PAGE_ADMIN_DASHBOARD = {
  root: {
    relativePath: ROOT_ADMIN_DASHBOARD,
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}`
  },
  roles: {
    relativePath: 'roles',
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}/roles`
  },
  users: {
    relativePath: 'users',
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}/users`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/users/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/users/edit/:id`
    }
  },
  modules: {
    relativePath: 'modules',
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}/modules`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/modules/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/modules/edit/:id`
    }
  },
  couponCodes: {
    relativePath: 'coupon-codes',
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}/coupon-codes`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/coupon-codes/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/coupon-codes/edit/:id`
    }
  },
  planDuration: {
    relativePath: 'plan-duration',
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}/plan-duration`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/plan-duration/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/plan-duration/edit/:id`
    }
  },
  plans: {
    relativePath: 'plans',
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}/plans`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/plans/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/plans/edit/:id`
    }
  },
  planPrice: {
    relativePath: 'plan-price',
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}/plan-price`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/plan-price/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/plan-price/edit/:id`
    }
  },
  companies: {
    relativePath: 'companies',
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}/companies`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/companies/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_ADMIN_DASHBOARD}/companies/edit/:id`
    }
  },
  orders: {
    relativePath: 'orders',
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}/orders`
  }
};

/* Company Dashboard Pages */
export const PAGE_COMPANY_DASHBOARD = {
  root: {
    relativePath: ROOT_COMPANY_DASHBOARD,
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}`
  },
  roles: {
    relativePath: 'roles',
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}/roles`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_COMPANY_DASHBOARD}/roles/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_COMPANY_DASHBOARD}/roles/edit/:id`
    }
  },
  designations: {
    relativePath: 'designations',
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}/designations`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_COMPANY_DASHBOARD}/designations/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_COMPANY_DASHBOARD}/designations/edit/:id`
    }
  },
  users: {
    relativePath: 'users',
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}/users`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_COMPANY_DASHBOARD}/users/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_COMPANY_DASHBOARD}/users/edit/:id`
    }
  },
  clients: {
    relativePath: 'clients',
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}/clients`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_COMPANY_DASHBOARD}/clients/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_COMPANY_DASHBOARD}/clients/edit/:id`
    }
  },
  projects: {
    relativePath: 'projects',
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}/projects`,
    create: {
      relativePath: 'create',
      absolutePath: `/${ROOT_COMPANY_DASHBOARD}/projects/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `/${ROOT_COMPANY_DASHBOARD}/projects/edit/:id`
    }
  },
  reporting: {
    relativePath: 'reporting',
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}/reporting`
  },
  myTracker: {
    relativePath: 'my-tracker',
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}/my-tracker`
  },
  myProjects: {
    relativePath: 'my-projects',
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}/my-projects`
  },
  employeeTracker: {
    relativePath: 'employee-tracker',
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}/employee-tracker`
  },
  manageDocuments: {
    relativePath: 'manage-documents',
    absolutePath: `/${ROOT_COMPANY_DASHBOARD}/manage-documents`,
    create: {
      relativePath: 'create',
      absolutPath: `${ROOT_COMPANY_DASHBOARD}/manage-documents/create`
    },
    edit: {
      relativePath: 'edit/:id',
      absolutePath: `${ROOT_COMPANY_DASHBOARD}/manage-documents/edit/:id`
    }
  }
};
