/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Landing page.
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

// ----------------------------------------------------------------------

/**
 * Component to create the Landing page and it's outer design.
 *
 * @component
 * @returns {JSX.Element}
 */
const LandingPage = (): JSX.Element => {
  /* Hooks */
  // const context = useContext(SessionContext);

  /* Functions */

  /* Output */
  return (
    <>
      <section
        className="home-section home-fade home-full-height bg-dark-60 landing-header"
        id="home"
        data-background="assets/images/landing/landing_bg.jpg"
      >
        <div className="titan-caption">
          <div className="caption-content">
            <div className="container">
              <div className="font-alt mb-30 titan-title-size-4">
                Landing Page
              </div>
              <div className="font-alt">
                Create a stylish App Landing Page
                <br />
                And highlight all the great things of your product!
              </div>
              <div className="font-alt mt-30">
                <a className="btn btn-border-w btn-circle" href="#">
                  <i className="icon-download" /> Download App
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <img
              alt=""
              className="img-responsive banner-img"
              src="assets/images/landing/banner_img.png"
            />
          </div>
        </div>
      </div>
      <div className="main">
        <section className="module-medium" id="about">
          <div className="container">
            <div className="row">
              <div className="col-sm-8 col-sm-offset-2">
                <h2 className="module-title font-alt">Welcome to Titan</h2>
                <div className="module-subtitle font-serif large-text">
                  We’re an award winning London based digital agency, lovingly
                  curating pixels for maximum impact. We don’t have a style — we
                  have standards.
                  <div className="text-center">
                    <div className="btn-group mt-30">
                      <a className="btn btn-border-d btn-circle" href="#">
                        <i className="fa fa-android" /> Play Store
                      </a>
                      <a className="btn btn-border-d btn-circle" href="#">
                        <i className="fa fa-apple" /> App Store
                      </a>
                      <a className="btn btn-border-d btn-circle" href="#">
                        <i className="fa fa-windows" /> Windows
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="module pb-0 bg-dark landing-reason parallax-bg"
          data-background="assets/images/landing/why_choose_bg.png"
        >
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <img src="assets/images/landing/why_choose.png" alt="" />
              </div>
              <div className="col-sm-6">
                <h2 className="module-title font-alt align-left">
                  Why Titan is best
                </h2>
                <p className="module-subtitle font-serif align-left">
                  A wonderful serenity has taken possession of my entire soul,
                  like these sweet mornings of spring which I enjoy with my
                  whole heart.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <a
                  className="btn btn-border-w btn-round video-pop-up"
                  href="https://www.youtube.com/watch?v=TTxZj3DZiIM"
                >
                  <i className="icon-video" /> Watch our video
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="module" id="alt-features">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-sm-offset-3">
                <h2 className="module-title font-alt">Our features</h2>
                <div className="module-subtitle font-serif">
                  A wonderful serenity has taken possession of my entire soul,
                  like these sweet mornings of spring which I enjoy with my
                  whole heart.
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-md-3 col-lg-3">
                <div className="alt-features-item">
                  <div className="alt-features-icon">
                    <span className="icon-strategy" />
                  </div>
                  <h3 className="alt-features-title font-alt">Branding</h3>A
                  wonderful serenity has taken possession of my entire soul like
                  these sweet mornings.
                </div>
                <div className="alt-features-item">
                  <div className="alt-features-icon">
                    <span className="icon-tools-2" />
                  </div>
                  <h3 className="alt-features-title font-alt">Development</h3>A
                  wonderful serenity has taken possession of my entire soul like
                  these sweet mornings.
                </div>
                <div className="alt-features-item">
                  <div className="alt-features-icon">
                    <span className="icon-target" />
                  </div>
                  <h3 className="alt-features-title font-alt">Marketing</h3>A
                  wonderful serenity has taken possession of my entire soul like
                  these sweet mornings.
                </div>
                <div className="alt-features-item">
                  <div className="alt-features-icon">
                    <span className="icon-tools" />
                  </div>
                  <h3 className="alt-features-title font-alt">Design</h3>A
                  wonderful serenity has taken possession of my entire soul like
                  these sweet mornings.
                </div>
              </div>
              <div className="col-md-6 col-lg-6 hidden-xs hidden-sm">
                <div className="alt-services-image align-center">
                  <img src="assets/images/landing/feature.png" alt="Feature" />
                </div>
              </div>
              <div className="col-sm-6 col-md-3 col-lg-3">
                <div className="alt-features-item">
                  <div className="alt-features-icon">
                    <span className="icon-camera" />
                  </div>
                  <h3 className="alt-features-title font-alt">Photography</h3>A
                  wonderful serenity has taken possession of my entire soul like
                  these sweet mornings.
                </div>
                <div className="alt-features-item">
                  <div className="alt-features-icon">
                    <span className="icon-mobile" />
                  </div>
                  <h3 className="alt-features-title font-alt">Mobile</h3>A
                  wonderful serenity has taken possession of my entire soul like
                  these sweet mornings.
                </div>
                <div className="alt-features-item">
                  <div className="alt-features-icon">
                    <span className="icon-linegraph" />
                  </div>
                  <h3 className="alt-features-title font-alt">Music</h3>A
                  wonderful serenity has taken possession of my entire soul like
                  these sweet mornings.
                </div>
                <div className="alt-features-item">
                  <div className="alt-features-icon">
                    <span className="icon-basket" />
                  </div>
                  <h3 className="alt-features-title font-alt">Shop</h3>A
                  wonderful serenity has taken possession of my entire soul like
                  these sweet mornings.
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="module-small free-trial">
          <div className="container text-center">
            <div className="row">
              <div className="col-sm-8 col-sm-offset-2">
                <h2 className="font-alt">
                  Start your &nbsp;
                  <span className="color-golden">free 30 days trial</span>
                  now
                </h2>
                <p className="color-light font-15">
                  Aliquam mattis efficitur massa vel commodo. Nam non euismod
                  ante. Proin consequat sem quis massa rhoncus, vel convallis
                  eros tincidunt. Ut consequat eget nulla eu ultrices.
                </p>
              </div>
            </div>
            <div>
              <a className="btn btn-warning btn-circle" href="#">
                Try For Free
              </a>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row landing-image-text">
              <div className="col-sm-6 col-sm-push-6">
                <img
                  className="center-block"
                  src="assets/images/landing/ipad.png"
                  alt=""
                />
              </div>
              <div className="col-sm-6 col-sm-pull-6">
                <h2 className="font-alt">Keep the conversation going</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
                <a className="btn btn-border-d btn-circle" href="#">
                  Try free version
                </a>
              </div>
            </div>
            <div className="row landing-image-text">
              <div className="col-sm-6">
                <img
                  className="center-block"
                  src="assets/images/landing/iphone-mockup.png"
                  alt=""
                />
              </div>
              <div className="col-sm-6">
                <h2 className="font-alt">How it works</h2>
                <p className="font-serif">
                  Lorem ipsum dolor sitamet consectetur adipisicing elit ullamut
                  consequatur repellendus amet nemo dignissimos possimus eius
                  fugiat
                </p>
                <ul>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod
                  </li>
                  <li>
                    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                    ea commodo consequat.
                  </li>
                  <li>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse
                  </li>
                  <li>
                    Proident, sunt in culpa qui officia deserunt mollit anim id
                    est laborum.
                  </li>
                </ul>
                <a className="btn btn-border-d btn-circle" href="#">
                  Download App
                </a>
              </div>
            </div>
          </div>
        </section>
        <section
          className="module bg-dark parallax-bg landing-screenshot"
          data-background="assets/images/landing/screenshot_bg.png"
        >
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-sm-offset-3">
                <h2 className="module-title font-alt">ScreenShots</h2>
                <div className="module-subtitle font-serif">
                  A wonderful serenity has taken possession of my entire soul,
                  like these sweet mornings of spring which I enjoy with my
                  whole heart.
                </div>
              </div>
            </div>
            <div className="row client">
              <div
                className="owl-carousel text-center"
                data-items="4"
                data-pagination="true"
                data-navigation="false"
              >
                <div className="owl-item">
                  <div className="col-sm-12">
                    <img
                      src="assets/images/landing/screenshot1.jpg"
                      alt="App Screenshot"
                    />
                  </div>
                </div>
                <div className="owl-item">
                  <div className="col-sm-12">
                    <img
                      src="assets/images/landing/screenshot2.jpg"
                      alt="App Screenshot"
                    />
                  </div>
                </div>
                <div className="owl-item">
                  <div className="col-sm-12">
                    <img
                      src="assets/images/landing/screenshot3.jpg"
                      alt="App Screenshot"
                    />
                  </div>
                </div>
                <div className="owl-item">
                  <div className="col-sm-12">
                    <img
                      src="assets/images/landing/screenshot4.jpg"
                      alt="App Screenshot"
                    />
                  </div>
                </div>
                <div className="owl-item">
                  <div className="col-sm-12">
                    <img
                      src="assets/images/landing/screenshot5.jpg"
                      alt="App Screenshot"
                    />
                  </div>
                </div>
                <div className="owl-item">
                  <div className="col-sm-12">
                    <img
                      src="assets/images/landing/screenshot6.jpg"
                      alt="App Screenshot"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="module download pb-0">
          <div className="container text-center">
            <h2 className="module-title font-alt">Why are you waiting for?</h2>
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <p className="module-subtitle">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodoconsequat.
                </p>
                <a href="#">
                  <img
                    alt=""
                    className="image-button"
                    src="assets/images/landing/apple-store-icon.png"
                  />
                </a>
                <a href="#">
                  <img
                    alt=""
                    className="image-button"
                    src="assets/images/landing/playstore-icon.png"
                  />
                </a>
                <a href="#">
                  <img
                    alt=""
                    className="image-button"
                    src="assets/images/landing/windows-store-icon.png"
                  />
                </a>
              </div>
            </div>
            <img alt="" src="assets/images/landing/landscap-mockup.jpg" />
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
