/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define tabs for sidebar.
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
import {
  Business as BusinessIcon,
  LocalOffer as LocalOfferIcon,
  LocalPostOffice as LocalPostOfficeIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Percent as PercentIcon,
  Person as PersonIcon,
  Timelapse as TimelapseIcon,
  ViewModule as ViewModuleIcon,
  AccountTree as AccountTreeIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  DataUsage as DataUsageIcon,
  Hail as HailIcon,
  AccountBox as ProfileIcon,
  ContactMail as PersonalDetailsIcon,
  Work as ProfessionalDetailsIcon,
  Home as AddressDetailsIcon,
  People as FamilyDetailsIcon,
  School as EducationDetailsIcon,
  ContactPhone as EmergencyContactIcon,
  WorkHistory as ExperienceDetailsIcon,
  Folder as DocumentsDetailsIcon,
  ArticleOutlined as DocumentIcon
} from '@mui/icons-material';

/* Relative Imports */
import { PAGE_ADMIN_DASHBOARD, PAGE_COMPANY_DASHBOARD } from 'routes/paths';

// ----------------------------------------------------------------------

/* Side bar tabs */
const masterSidebarConfig = [
  {
    title: 'Manage Roles',
    href: PAGE_ADMIN_DASHBOARD.roles.absolutePath,
    icon: SettingsIcon
  },
  {
    title: 'Manage Users',
    href: PAGE_ADMIN_DASHBOARD.users.absolutePath,
    icon: PersonIcon
  },
  {
    title: 'Manage Modules',
    href: PAGE_ADMIN_DASHBOARD.modules.absolutePath,
    icon: ViewModuleIcon
  },
  {
    title: 'Manage Plan Durations',
    href: PAGE_ADMIN_DASHBOARD.planDuration.absolutePath,
    icon: TimelapseIcon
  },
  {
    title: 'Manage Plans',
    href: PAGE_ADMIN_DASHBOARD.plans.absolutePath,
    icon: SettingsIcon
  },
  {
    title: 'Manage Plan Prices',
    href: PAGE_ADMIN_DASHBOARD.planPrice.absolutePath,
    icon: SettingsIcon
  },
  {
    title: 'Manage Coupon Codes',
    href: PAGE_ADMIN_DASHBOARD.couponCodes.absolutePath,
    icon: PercentIcon
  },
  {
    title: 'Manage Companies',
    href: PAGE_ADMIN_DASHBOARD.companies.absolutePath,
    icon: BusinessIcon
  },
  {
    title: 'Manage Orders',
    href: PAGE_ADMIN_DASHBOARD.orders.absolutePath,
    icon: InventoryIcon
  }
];

export const masterContentManagerSidebarConfig = [
  {
    title: 'Manage Modules',
    href: PAGE_ADMIN_DASHBOARD.modules.absolutePath,
    icon: ViewModuleIcon
  },
  {
    title: 'Manage Plan Durations',
    href: PAGE_ADMIN_DASHBOARD.planDuration.absolutePath,
    icon: TimelapseIcon
  },
  {
    title: 'Manage Plans',
    href: PAGE_ADMIN_DASHBOARD.plans.absolutePath,
    icon: LocalPostOfficeIcon
  },
  {
    title: 'Manage Plan Prices',
    href: PAGE_ADMIN_DASHBOARD.planPrice.absolutePath,
    icon: LocalOfferIcon
  },
  {
    title: 'Manage Coupon Codes',
    href: PAGE_ADMIN_DASHBOARD.couponCodes.absolutePath,
    icon: PercentIcon
  }
];

export const companySidebarConfig = [
  {
    title: 'Manage Roles',
    href: PAGE_COMPANY_DASHBOARD.roles.absolutePath,
    icon: SettingsIcon
  },
  {
    title: 'Manage Designations',
    href: PAGE_COMPANY_DASHBOARD.designations.absolutePath,
    icon: AdminPanelSettingsIcon
  },
  // {
  //   title: 'Manage Users',
  //   href: PAGE_COMPANY_DASHBOARD.users.absolutePath,
  //   icon: PersonIcon
  // },
  {
    title: 'Manage Employees',
    href: PAGE_COMPANY_DASHBOARD.employees.absolutePath,
    icon: PersonIcon
  },
  {
    title: 'Manage Document Type',
    href: PAGE_COMPANY_DASHBOARD.manageDocuments.absolutePath,
    icon: DocumentIcon
  },
  {
    title: 'Manage Clients',
    href: PAGE_COMPANY_DASHBOARD.clients.absolutePath,
    icon: HailIcon
  },
  {
    title: 'Manage Projects',
    href: PAGE_COMPANY_DASHBOARD.projects.absolutePath,
    icon: AccountTreeIcon
  },
  {
    title: 'Reporting',
    href: PAGE_COMPANY_DASHBOARD.reporting.absolutePath,
    icon: DataUsageIcon
  }
];

export const companyContentManagerSidebarConfig = [
  {
    title: 'Manage Designations',
    href: PAGE_COMPANY_DASHBOARD.designations.absolutePath,
    icon: AdminPanelSettingsIcon
  },
  {
    title: 'Manage Clients',
    href: PAGE_COMPANY_DASHBOARD.clients.absolutePath,
    icon: HailIcon
  },
  {
    title: 'Manage Projects',
    href: PAGE_COMPANY_DASHBOARD.projects.absolutePath,
    icon: AccountTreeIcon
  }
];

export const companyUserSidebarConfig = [
  {
    title: 'My Profile',
    href: PAGE_COMPANY_DASHBOARD.myProfile.absolutePath,
    icon: ProfileIcon,
    subItems: [
      {
        title: 'Personal Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/personal-details`,
        icon: PersonalDetailsIcon
      },
      {
        title: 'Professional Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/professional-details`,
        icon: ProfessionalDetailsIcon
      },
      {
        title: 'Address Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/address-details`,
        icon: AddressDetailsIcon
      },
      {
        title: 'Family Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/family-details`,
        icon: FamilyDetailsIcon
      },
      {
        title: 'Education Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/education-details`,
        icon: EducationDetailsIcon
      },
      {
        title: 'Emergency Contact Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/emergency-contact-details`,
        icon: EmergencyContactIcon
      },
      {
        title: 'Experience Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/experience-details`,
        icon: ExperienceDetailsIcon
      },
      {
        title: 'Documents Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/documents-details`,
        icon: DocumentsDetailsIcon
      }
    ]
  },
  {
    title: 'My Tracker',
    href: PAGE_COMPANY_DASHBOARD.myTracker.absolutePath,
    icon: DataUsageIcon
  },
  {
    title: 'My Projects',
    href: PAGE_COMPANY_DASHBOARD.myProjects.absolutePath,
    icon: AccountTreeIcon
  }
];

export const companyProjectLeaderSidebarConfig = [
  {
    title: 'Employee Tracker',
    href: PAGE_COMPANY_DASHBOARD.employeeTracker.absolutePath,
    icon: DataUsageIcon
  }
];

export default masterSidebarConfig;
