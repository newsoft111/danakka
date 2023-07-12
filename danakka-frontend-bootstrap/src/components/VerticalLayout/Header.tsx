import React, { useState } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";

//import drawer

//import component
import RightSidebar from "../CommonForBoth/RightSidebar";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col, Offcanvas } from "reactstrap";

//import images
import logoSm from "../../assets/images/logo-sm.png";
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";
import illustrator from "../../assets/images/illustrator/1.png";

import slack from "../../assets/images/brands/slack.png";
import behance from "../../assets/images/brands/behance.png";
import dribbble from "../../assets/images/brands/dribbble.png";
import dropbox from "../../assets/images/brands/dropbox.png";
import mail_chimp from "../../assets/images/brands/mail_chimp.png";
import github from "../../assets/images/brands/github.png";

//Import Icons
import Icon from "@ailibs/feather-react-ts";

const Header = (props: any) => {

  const [isSearch, setSearch] = useState<boolean>(false);
  const [socialDrp, setsocialDrp] = useState<boolean>(false);
  const [position, setPosition] = useState<string>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [megaMenu, setmegaMenu] = useState(false);
  const [categoryMenu, setcategoryMenu] = useState(false);
  /**
   * Rightsidebar drawer
   */

  const toggleTopDrawer = () => {
    setPosition("right");
    setOpenDrawer(!openDrawer);
  };

  const onDrawerClose = () => {

    setOpenDrawer(false);
  };

  /*** Sidebar menu icon and default menu set */
  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    }
    document.body.setAttribute("data-sidebar-size", "lg");
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">

            <div className="navbar-brand-box">
              <Link to="/sales" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logoSm} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="" height="22" />
                </span>
              </Link>

              <Link to="/sales" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoSm} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="22" />
                </span>
              </Link>
            </div>

            <button
              onClick={() => {
                tToggle();
              }}
              type="button"
              className="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars"></i>
            </button>

            <Dropdown
              className="d-none d-lg-block ms-2"
              isOpen={megaMenu}
              toggle={() => {
                setmegaMenu(!megaMenu);
              }}
            >
              <DropdownToggle
                className="btn header-item "
                caret
                tag="button"
              >
                {" "}
                <span>Components</span>
                <i className="mdi mdi-chevron-down"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-xl p-2">
                <Row>
                  <Col md={6}>
                    <Link className="dropdown-item" to="#!">{props.t("Alerts")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Buttons")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Cards")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Dropdowns")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Lightbox")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Modals")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Range Slider")} </Link>
                  </Col>
                  <Col md={6}>
                    <Link className="dropdown-item" to="#!">{props.t("Progress Bars")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Sweet Alert")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Tabs & Accordions")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Typography")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("General")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Rating")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Notifications")}</Link>
                  </Col>
                </Row>
              </DropdownMenu>
            </Dropdown>

            <Dropdown
              className="dropdown dropdown-mega d-none d-lg-block"
              isOpen={categoryMenu}
              toggle={() => {
                setcategoryMenu(!categoryMenu);
              }}
            >
              <DropdownToggle
                className="btn header-item"
                caret
                tag="button"
              >
                {" "}
                <span>{props.t("Categories")}</span>
                <i className="mdi mdi-chevron-down"></i>
              </DropdownToggle>
              <DropdownMenu className="p-2 dropdown-megamenu">
                <Row>
                  <Col>
                    <h5 className="font-size-14 mx-4 mt-2">{props.t("Computers Accessories")}</h5>
                    <Link className="dropdown-item" to="#!">{props.t("Laptops Tablets")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Desktop Computers")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Networking Products")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Monitors")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Bags, Cases & Sleeves")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Batteries")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Charges Adapters")}</Link>
                  </Col>
                  <Col>
                    <h5 className="font-size-14 ms-4 mt-2">{props.t("Smartphones & Tablets")}</h5>
                    <Link className="dropdown-item" to="#!">{props.t("Apple iPhone")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Android Smartphones")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Phablets")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Apple iPad")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Android Tablets")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Tablets with Keyboard")}</Link>
                  </Col>
                  <Col>
                    <h5 className="font-size-14 ms-4 mt-2">{props.t("Television & Video")}</h5>
                    <Link className="dropdown-item" to="#!">{props.t("TV Sets")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Home Theater Systems")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("DVD Players & Recorders")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("DVD-VCR Combos")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Projectors")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Projection Screens")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Satelite Television")}</Link>
                  </Col>
                  <Col>
                    <h5 className="font-size-14 ms-4 mt-2">{props.t("Cameras, Photo & Video")}</h5>
                    <Link className="dropdown-item" to="#!">{props.t("Point & Shoot Digital Cameras")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("DSLR Cameras")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Mirrorless Cameras")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Body Mounted Cameras")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Camera Lenses")}</Link>
                    <Link className="dropdown-item" to="#!">{props.t("Video Studio")}</Link>
                  </Col>
                  <Col>
                    <div className="py-lg-2 pr-lg-2">
                      <img src={illustrator} alt="" className="img-fluid mx-auto" />
                    </div>
                  </Col>
                </Row>
              </DropdownMenu>
            </Dropdown>

          </div>

          <div className="d-flex">
            <div className="dropdown d-inline-block">

              <button
                type="button"
                className="btn header-item"
                id="page-header-search-dropdown"
                onClick={() => setSearch(!isSearch)}
              >
                <Icon name="search" className="icon-sm" />
              </button>
              <div
                className={
                  isSearch
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-2">
                  <div className="search-box">
                    <div className="position-relative">
                      <input type="text" className="form-control rounded bg-light border-0" placeholder="Search" />
                      <i className="mdi mdi-magnify search-icon"></i>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <LanguageDropdown />

            <Dropdown
              className="d-none d-lg-inline-block"
              isOpen={socialDrp}
              toggle={() => {
                setsocialDrp(!socialDrp);
              }}
            >
              <DropdownToggle
                className="btn header-item noti-icon "
                tag="button"
              >
                <Icon name="grid" className="icon-sm" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                <div className="p-3 border-bottom">
                  <div className="row align-items-center">
                    <div className="col">
                      <h5 className="m-0 font-size-15"> Web Apps </h5>
                    </div>
                    <div className="col-auto">
                      <Link to="#!" className="small fw-semibold text-decoration-underline"> View All</Link>
                    </div>
                  </div>
                </div>
                <SimpleBar style={{ height: "270px" }}>
                  <Link className="notification-item text-reset" to="#!">
                    <div className="d-flex border-bottom align-items-center">
                      <div className="flex-shrink-0">
                        <img src={slack} alt="slack" />
                      </div>
                      <div className="flex-grow-1 ms-4">
                        <h6 className="mb-0">Slack</h6>
                        <p className="font-size-12 text-muted mb-0">This is your moment. Let’s reinvent work.</p>
                      </div>
                    </div>
                  </Link>
                  <Link className="notification-item text-reset" to="#!">
                    <div className="d-flex border-bottom align-items-center">
                      <div className="flex-shrink-0">
                        <img src={behance} alt="behance" />
                      </div>
                      <div className="flex-grow-1 ms-4">
                        <h6 className="mb-0">Behance <span className="badge bg-warning badge-pill ml-1">Free</span></h6>
                        <p className="font-size-12 text-muted mb-0">Showcase your work.</p>
                      </div>
                    </div>
                  </Link>
                  <Link className="notification-item text-reset" to="#!">
                    <div className="d-flex border-bottom align-items-center">
                      <div className="flex-shrink-0">
                        <img src={dribbble} alt="dribbble" />
                      </div>
                      <div className="flex-grow-1 ms-4">
                        <h6 className="mb-0">Dribbble</h6>
                        <p className="font-size-12 text-muted mb-0">Dribbble is the world’s leading community for creatives to share, grow, and get hired.</p>
                      </div>
                    </div>
                  </Link>
                  <Link className="notification-item text-reset" to="#!">
                    <div className="d-flex border-bottom align-items-center">
                      <div className="flex-shrink-0">
                        <img src={dropbox} alt="dropbox" />
                      </div>
                      <div className="flex-grow-1 ms-4">
                        <h6 className="mb-0">Dropbox</h6>
                        <p className="font-size-12 text-muted mb-0">Keep life organized and work moving—all in one place</p>
                      </div>
                    </div>
                  </Link>
                  <Link className="notification-item text-reset" to="#!">
                    <div className="d-flex border-bottom align-items-center">
                      <div className="flex-shrink-0">
                        <img src={mail_chimp} alt="mail_chimp" />
                      </div>
                      <div className="flex-grow-1 ms-4">
                        <h6 className="mb-0">Mail Chimp <span className="badge bg-danger badge-pill ml-1">Premium</span></h6>
                        <p className="font-size-12 text-muted mb-0">The best value for your digital marketing budget</p>
                      </div>
                    </div>
                  </Link>
                  <Link className="notification-item text-reset" to="#!">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <img src={github} alt="github" />
                      </div>
                      <div className="flex-grow-1 ms-4">
                        <h6 className="mb-0">Github</h6>
                        <p className="font-size-12 text-muted mb-0">Where the world builds software</p>
                      </div>
                    </div>
                  </Link>
                </SimpleBar>

              </DropdownMenu>
            </Dropdown>

            <NotificationDropdown />

            <div
              onClick={() => {
                toggleTopDrawer();
              }}
              className="dropdown d-inline-block"
            >
              <button
                type="button"
                className="btn header-item noti-icon right-bar-toggle "
              >
                <Icon
                  name="settings"
                  className="icon-sm"
                />
              </button>
            </div>

            <ProfileMenu />

          </div>
        </div>
      </header>

      <Offcanvas isOpen={openDrawer} onClosed={onDrawerClose} direction={"end"}>
        <RightSidebar
          onClosed={onDrawerClose}
        />
      </Offcanvas>

    </React.Fragment>
  );
};

export default withTranslation()(Header);