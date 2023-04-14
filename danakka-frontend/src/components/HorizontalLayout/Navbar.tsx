import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { Link, useLocation } from "react-router-dom";

//Import Icons
import Icon from "@ailibs/feather-react-ts";

//import withRouter
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";

const Navbar = (props: any) => {
  const path = useLocation();

  const [pricing, setpricing] = useState<boolean>(false);
  const [app, setapp] = useState<boolean>(false);
  const [email, setemail] = useState<boolean>(false);
  const [contact, setcontact] = useState<boolean>(false);
  const [component, setcomponent] = useState<boolean>(false);
  const [form, setform] = useState<boolean>(false);
  const [table, settable] = useState<boolean>(false);
  const [chart, setchart] = useState<boolean>(false);
  const [icon, seticon] = useState<boolean>(false);
  const [map, setmap] = useState<boolean>(false);
  const [extra, setextra] = useState<boolean>(false);
  const [invoice, setinvoice] = useState<boolean>(false);
  const [timeline, settimeline] = useState<boolean>(false);
  const [auth, setauth] = useState<boolean>(false);
  const [authbasic, setauthbasic] = useState<boolean>(false);
  const [authcover, setauthcover] = useState<boolean>(false);
  const [error, seterror] = useState<boolean>(false);
  const [error1, seterror1] = useState<boolean>(false);
  const [error2, seterror2] = useState<boolean>(false);
  const [utility, setutility] = useState<boolean>(false);
  const [project, setproject] = useState<boolean>(false);
  const [dashoboard, setdashoboard] = useState<boolean>(false);
  const [booking, setbooking] = useState<boolean>(false);
  const [elements, setelements] = useState<boolean>(false);

  const pathName = path.pathname;
  useEffect(() => {
    var matchingMenuItem = null;
    var ul: any = document.getElementById("navigation");
    var items: any = ul.getElementsByTagName("a");

    for (var i = 0; i < items.length; ++i) {
		const item = items[i];
		const parent = item.parentElement;
		const isActive = pathName === items[i].pathname;

		item.classList.toggle("active", isActive);
		if (parent) {
			parent.classList.toggle("active", isActive);
		}
    //   if (pathName === items[i].pathname) {
    //     matchingMenuItem = items[i];
    //     break;
    //   }
    }
    // if (matchingMenuItem) {
    //   activateParentDropdown(matchingMenuItem);
    // }
  });

  function activateParentDropdown(item: any) {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link"
                    to="/booking/live/"
                  >
                    <Icon name="monitor" />
                    <span>{props.t("LiveBooking")}</span>
                    <div className="arrow-none"></div>
                  </Link>
                </li>

				<li className="nav-item dropdown">
                  <Link
                    className="nav-link"
                    to="/booking/fishing/boat/"
                  >
                    <Icon name="package" />
                    <span>{props.t("BoatFishing")}</span>
                    <div className="arrow-none"></div>
                  </Link>
                </li>

				<li className="nav-item dropdown">
                  <Link
                    className="nav-link"
                    to="/booking/fishing/hosue/"
                  >
                    <Icon name="file" />
                    <span>{props.t("HouseFishing")}</span>
                    <div className="arrow-none"></div>
                  </Link>
                </li>

				<li className="nav-item dropdown">
                  <Link
                    className="nav-link"
                    to="/booking/fishing/experience/"
                  >
                    <Icon name="grid" />
                    <span>{props.t("ExperienceFishing")}</span>
                    <div className="arrow-none"></div>
                  </Link>
                </li>

				<li className="nav-item dropdown">
                  <Link
                    className="nav-link"
                    to="/booking/"
                  >
                    <Icon name="layers" />
                    <span>{props.t("출조버스")}</span>
                    <div className="arrow-none"></div>
                  </Link>
                </li>
                
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(withRouter(Navbar));