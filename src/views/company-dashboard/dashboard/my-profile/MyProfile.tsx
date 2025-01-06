/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description My profile page to view user profile.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { useContext, useEffect, useState } from 'react';

/* Relative Imports */
import { apiBaseUrl } from 'config/config';
import { toastMessages } from 'constants/appConstant';
import SessionContext from 'context/SessionContext';
import { changeProfilePhotoRequest } from 'services/account';

/* Local Imports */
import { AdminDashboardPage } from 'components/Page';
import {
  AddEmployeeProfessionalDetailsFormValues,
  ProfessionalDetailsValues
} from 'models/company/employee';
import { getEmployeeProfessionalDetailsByUserIdRequest } from 'services/company/employee/professionalDetails';
import { getDesignationByIdRequest } from 'services/company/designation';
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';
import styles from './index.style';

/**
 * Component to display user profile
 *
 * @component
 * @returns {JSX.Element}
 */
const MyProfile = (): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();
  const { user, updateProfilePicture } = useContext(SessionContext);

  /* States */
  const [view, setView] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [
    initialValuesProfessionalDetails,
    setInitialValuesProfessionalDetails
  ] = useState({
    txtEmployeeCode: '',
    ddlDesignation: '',
    txtJoinDate: '',
    ddlEmploymentType: '',
    ddlWorkingType: ''
  } as AddEmployeeProfessionalDetailsFormValues);

  /**
   * function to get all the users with backend action
   *
   * @returns {void}
   */
  const handleGetProfessionalDetails = async (): Promise<void> => {
    // console.log('user is', user);
    setLoading(true);
    const response = await getEmployeeProfessionalDetailsByUserIdRequest(
      Number(user?.id)
    );
    console.log('res is', response);
    const professionalData: ProfessionalDetailsValues =
      response?.employeeProfessionalDetail;
    if (professionalData) {
      const { designation } = await getDesignationByIdRequest(
        Number(professionalData?.designation_id)
      );
      console.log('designation is', designation);
      setInitialValuesProfessionalDetails({
        txtEmployeeCode: professionalData.employee_code,
        ddlDesignation: designation.name,
        txtJoinDate: professionalData.join_date,
        ddlEmploymentType: professionalData.employment_type,
        ddlWorkingType: professionalData.working_type
      });
    }
    setLoading(false);
  };

  const updateViewMode = (newEditMode: boolean): void => {
    setView(newEditMode);
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    try {
      setIsUploading(true);
      const fileList = e.target.files;

      if (fileList && fileList[0]) {
        const selectedFile = fileList[0];
        const maxFileSize: number = 4194304; // 4MB

        if (selectedFile.size > maxFileSize) {
          showSnackbar('Failed!! Max allowed image size is 4 MB', 'error');
          return;
        }

        const allowedExt = ['png', 'jpg', 'jpeg'];
        const ext = selectedFile.name.split('.').pop()?.toLowerCase();

        if (!ext || !allowedExt.includes(ext)) {
          showSnackbar(
            'Failed!! Only PNG, JPG and JPEG files are allowed',
            'error'
          );
          return;
        }

        if (user.id) {
          const reqData = {
            profilePhoto: selectedFile
          };

          // Commented out for now as per the original code
          // const response = await changeProfilePhotoRequest(user.id, reqData);

          // if (
          //   response?.status.response_code === 200 &&
          //   response.profile_photo
          // ) {
          //   updateProfilePicture(response.profile_photo);
          //   showSnackbar('Profile picture updated successfully!', 'success');
          // } else {
          //   showSnackbar(toastMessages.error.common, 'error');
          // }
        }
      } else {
        showSnackbar('Please select an image to update.', 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    handleGetProfessionalDetails();
  }, []);

  return (
    <AdminDashboardPage title="My Profile">
      <Box sx={styles.profileContainer}>
        <Card sx={styles.profileCard}>
          <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={styles.headerContent}>
              <Box sx={styles.avatarWrapper}>
                <Avatar
                  src={`${apiBaseUrl}${user.profile_photo}`}
                  sx={styles.avatar}
                />
                {isUploading && (
                  <Box sx={styles.loaderOverlay}>
                    <img src="/static/images/loader.gif" alt="" width={50} />
                  </Box>
                )}
              </Box>
              <Box sx={styles.userInfo}>
                <Typography variant="h3" gutterBottom>
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {initialValuesProfessionalDetails.ddlDesignation}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                <Button
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={isUploading}
                  size="small"
                >
                  Update Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={isUploading}
                    style={styles.hiddenInput}
                  />
                </Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setView(!view)}
                  // startIcon={<EditIcon/>}
                >
                  {view ? 'View Profile' : 'Edit Profile'}
                </Button> */}
              </Box>
            </Box>

            {view ? (
              <EditProfile handleViewMode={updateViewMode} />
            ) : (
              <ViewProfile handleViewMode={updateViewMode} />
            )}
          </CardContent>
        </Card>
      </Box>
    </AdminDashboardPage>
  );
};

export default MyProfile;
