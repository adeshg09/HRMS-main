/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Company Register page to signup the company.
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
// import { SignInForm, CreateCompanyForm } from './components';
import styles from './index.style';

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

  /* Output */
  return (
    // <AuthPage title="Sign In">
    // <Box sx={styles.rootStyle}>
    <Container>
      {/* <Typography variant="h3" mb={0}>
          Company Sign Up
        </Typography>
        <Typography variant="body2" mb={3} sx={styles.boxSubtitleStyle}>
          Please fill the below details to create new company.
        </Typography>
        <Divider /> */}
      {/* <SignInForm onSubmitSuccess={handleSignIn} /> */}
      {/* <CreateCompanyForm /> */}
    </Container>
    // </Box>
    // </AuthPage>
  );
};

export default CompanySignUp;
