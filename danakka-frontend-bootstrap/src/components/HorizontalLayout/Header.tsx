import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";

//Import Icons
import Icon from "@ailibs/feather-react-ts";

import { Link } from "react-router-dom";

// reactstrap
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, Offcanvas } from "reactstrap";

// Import menuDropdown
import RightSidebar from "../CommonForBoth/RightSidebar";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

// import images
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

const Header = (props: any) => {
  const [isSearch, setSearch] = useState<boolean>(false);
  const [socialDrp, setsocialDrp] = useState<boolean>(false);
  const [position, setPosition] = useState<string>();
  const [rightbarOpen, setrightbarOpen] = useState<boolean>(false);
  const [megaMenu, setmegaMenu] = useState(false);
  const [categoryMenu, setcategoryMenu] = useState(false);

  const toggleTopDrawer = () => {
    setPosition("right");
    setrightbarOpen(!rightbarOpen);
  };

  const onDrawerClose = () => {
    setrightbarOpen(false);
  };

  const toggleLeftmenu = () => {
    var element = document.getElementById("topnav-menu-content");
    if(element){
      element.classList.toggle("show");
    }
  };
  return (
    <React.Fragment>

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

          
        </div>

        <div className="d-flex">
			<NotificationDropdown />

			<li className="dropdown d-inline-block">
				<Link to="/login/" className="btn header-item">
					
						<Icon name="user" className="icon-sm" />
				</Link>
			</li>
				

          

        </div>
      </div>

      <Offcanvas isOpen={rightbarOpen} onClosed={onDrawerClose} direction={"end"}>
        <RightSidebar
          onClosed={onDrawerClose}
        />
      </Offcanvas>
    </React.Fragment>
  );
};

export default withTranslation()(Header);