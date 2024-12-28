/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create layout for auth pages.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import React, { useContext } from 'react';
import { Box } from '@mui/material';

/* Relative Imports */
import SessionContext from 'context/SessionContext';

/* Local Imports */
// import './assets/lib/bootstrap/dist/css/bootstrap.min.css';
// import './assets/lib/animate.css/animate.css';
// import './assets/lib/components-font-awesome/css/font-awesome.min.css';
// import './assets/lib/et-line-font/et-line-font.css';
// import './assets/lib/flexslider/flexslider.css';
// // import './assets/lib/owl.carousel/dist/assets/owl.carousel.min.css';
// // import './assets/lib/owl.carousel/dist/assets/owl.theme.default.min.css';
// import './assets/lib/magnific-popup/dist/magnific-popup.css';
// import './assets/lib/simple-text-rotator/simpletextrotator.css';
// import './assets/css/style.css';
// import './assets/css/colors/default.css';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create outer design layout for landing page.
 *
 * @interface MainLayoutProps
 * @property {node} children - contains the child components.
 */
export interface MainLayoutProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * Outer design layout for landing page
 *
 * @component
 * @param {node} children - contains the child components
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }): JSX.Element => {
  /* Hooks */
  const { isPageLoaded } = useContext(SessionContext);

  /* Output */
  return isPageLoaded ? (
    <>
      <nav
        className="navbar navbar-custom navbar-fixed-top navbar-transparent"
        role="navigation"
      >
        <div className="container">
          <div className="navbar-header">
            <button
              className="navbar-toggle"
              type="button"
              data-toggle="collapse"
              data-target="#custom-collapse"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <a className="navbar-brand" href="index.html">
              TE TRACKER
            </a>
          </div>
          <div className="collapse navbar-collapse" id="custom-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">Register</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <>{children}</>
      <footer className="footer bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <p className="copyright font-alt">
                &copy; 2017&nbsp;<a href="index.html">TE TRACKER</a>, All Rights
                Reserved
              </p>
            </div>
            <div className="col-sm-6">
              <div className="footer-social-links">
                <a href="#">
                  <i className="fa fa-facebook" />
                </a>
                <a href="#">
                  <i className="fa fa-twitter" />
                </a>
                <a href="#">
                  <i className="fa fa-dribbble" />
                </a>
                <a href="#">
                  <i className="fa fa-skype" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="scroll-up">
        <a href="#totop">
          <i className="fa fa-angle-double-up" />
        </a>
      </div>
      {/* <script src="assets/lib/jquery/dist/jquery.js"></script>
      <script src="assets/lib/bootstrap/dist/js/bootstrap.min.js"></script>
      <script src="assets/lib/wow/dist/wow.js"></script>
      <script src="assets/lib/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.js"></script>
      <script src="assets/lib/isotope/dist/isotope.pkgd.js"></script>
      <script src="assets/lib/imagesloaded/imagesloaded.pkgd.js"></script>
      <script src="assets/lib/flexslider/jquery.flexslider.js"></script>
      <script src="assets/lib/owl.carousel/dist/owl.carousel.min.js"></script>
      <script src="assets/lib/smoothscroll.js"></script>
      <script src="assets/lib/magnific-popup/dist/jquery.magnific-popup.js"></script>
      <script src="assets/lib/simple-text-rotator/jquery.simple-text-rotator.min.js"></script>
      <script src="assets/js/plugins.js"></script>
      <script src="assets/js/main.js"></script> */}
    </>
  ) : (
    <></>
  );
};

export default MainLayout;
