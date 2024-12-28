/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Sign in page to validate the credentials.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 23/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useContext } from 'react';
import { Box, Container, Divider, Typography } from '@mui/material';

/* Relative Imports */

/* Local Imports */
import { CreateCompanyForm } from './components';
import authStyles from './index.style';

// ----------------------------------------------------------------------

/**
 * Component to create the signin form and it's outer design.
 *
 * @component
 * @returns {JSX.Element}
 */
const CompanySignUp = (): JSX.Element => {
  /* Hooks */
  // const context = useContext(SessionContext);

  /* Functions */
  /**
   * function to set token and user details in session context.
   * @param {string} token - auth token to set for api validations
   * @param {object} user - basic details of logged in user
   * @param {boolean} rememberMe - flag to remember user for 30 days
   * @returns {void}
   */
  const handleSignIn = (
    token: string,
    user: object,
    rememberMe: boolean
  ): void => {
    // context.LoginUser(token, user, rememberMe);
  };

  /* Output */
  return (
    // <AuthPage title="Sign In">
    // <Box sx={authStyles.rootStyle}>
    <Container>
      {/* <Typography variant="h3" mb={0}>
          Company Sign Up
        </Typography>
        <Typography variant="body2" mb={3} sx={authStyles.boxSubtitleStyle}>
          Please fill the below details to create new company.
        </Typography>
        <Divider /> */}
      {/* <SignInForm onSubmitSuccess={handleSignIn} /> */}
      <CreateCompanyForm />
    </Container>
    // </Box>
    // </AuthPage>
  );
};

export default CompanySignUp;
