import React from "react";
import { Link } from "react-router-dom";

//import components
import SidebarContent from "./SidebarContent";
import SimpleBar from "simplebar-react";

//import images
import logoSm from "../../assets/images/logo-sm.png";
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";

const Sidebar = (props: any) => {

  function tToggle() {
    document.body.setAttribute("data-sidebar-size", "sm");
  }

  return (
    <React.Fragment>
      <div className="vertical-menu">

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
          type="button" className="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn" id="vertical-menu-btn">
          <i className="fa fa-fw fa-bars" />
        </button>

        <div className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;