import React, { useCallback, useEffect, useRef } from "react";

//Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";

//WithRouter
import  withRouter from "../Common/withRouter";

import { menuItems } from "./Menu";

//i18n
import { withTranslation } from "react-i18next";
import classNames from "classnames";

//Import Icons
import Icon from "@ailibs/feather-react-ts";

interface HeaderMenuItemProps {
    item: any;
  }
  const HeaderMenuItem = ({ item }: HeaderMenuItemProps) => {
    return (
        <li className="menu-title" data-key="t-layouts">{item.label}</li>
    );
  };

const MenuItem = ({ item, props }: any) => {
    const hasChildren = item["subItems"] && item["subItems"].length;
    const url = item["link"] ? item["link"] : "#";
    const hasExtra = item["novidade"];
    const arrowclass = (item['label'] == 'Authentication') ? true : false;
    return (
      <li>
        <Link to={url} className={classNames({ "has-arrow": hasChildren && !hasExtra && !arrowclass}, { "waves-effect": hasChildren })}>
          {
              item["icon"] && <Icon name={item["icon"]} className="icon nav-icon" />
          }
          <span className="menu-item">{props.t(item["label"])}</span>
          {item.badge &&
              <span className={"badge rounded-pill " + item.badgecolor}>{item.badge}</span>
          }
        </Link>
          {
            hasChildren &&
            <Menu item={item} props={props} />
          }
      </li>
    );
};

const Menu = ({ item, props }: any) => {
    const menuItems = item["subItems"] && item["subItems"];
    return (
        <ul className="sub-menu">
            {
                (menuItems || []).map((item: any, key: number) =>
                    <MenuItem item={item} key={key} props={props} />
                )
            }
        </ul>
    );
};

const SidebarContent = (props: any) => {

  const ref = useRef<any>();

    const activateParentDropdown = useCallback((item) => {
        item.classList.add("active");
        const parent = item.parentElement;
        const parent2El = parent.childNodes[1];
        if (parent2El && parent2El.id !== "side-menu") {
            parent2El.classList.add("mm-show");
        }
          if (parent) {
            parent.classList.add("mm-active");
            const parent2 = parent.parentElement.closest("ul");
            if (parent2 && parent2.id !== "side-menu") {
                parent2.classList.add("mm-show");
                const parent3 = parent2.parentElement;
                  if (parent3) {
                    parent3.classList.add("mm-active");
                    var childAnchor = parent3.querySelector(".has-arrow");
                    var childDropdown = parent3.querySelector(".has-dropdown");
                    if (childAnchor) childAnchor.classList.add("mm-active");
                    if (childDropdown) childDropdown.classList.add("mm-active");

                    const parent4 = parent3.parentElement;
                    if (parent4 && parent4.id !== "side-menu") {
                        parent4.classList.add("mm-show");
                        const parent5 = parent4.parentElement;
                        if (parent5 && parent5.id !== "side-menu") {
                            parent5.classList.add("mm-active");
                            const childanchor = parent5.querySelector(".is-parent");
                            if (childanchor && parent5.id !== "side-menu") {
                                childanchor.classList.add("mm-active");
                            }
                        }
                    }
                  }
              }
            scrollElement(item);
            return false;
          }
        scrollElement(item);
        return false;
    }, []);

      const removeActivation = (items : any) => {
        for (var i = 0; i < items.length; ++i) {
          var item = items[i];
          const parent = items[i].parentElement;

          if (item && item.classList.contains("active")) {
            item.classList.remove("active");
          }
          if (parent) {
            const parent2El =
              parent.childNodes &&
              parent.childNodes.lenght &&
              parent.childNodes[1]
                ? parent.childNodes[1]
                : null;
            if (parent2El && parent2El.id !== "side-menu") {
              parent2El.classList.remove("mm-show");
            }

            parent.classList.remove("mm-active");
            const parent2 = parent.parentElement;

            if (parent2) {
              parent2.classList.remove("mm-show");

              const parent3 = parent2.parentElement;
              if (parent3) {
                parent3.classList.remove("mm-active"); // li
                parent3.childNodes[0].classList.remove("mm-active");

                const parent4 = parent3.parentElement; // ul
                if (parent4) {
                  parent4.classList.remove("mm-show"); // ul
                  const parent5 = parent4.parentElement;
                  if (parent5) {
                    parent5.classList.remove("mm-show"); // li
                    parent5.childNodes[0].classList.remove("mm-active"); // a tag
                  }
                }
              }
            }
          }
        }
      };
    
      const path = useLocation();
      const activeMenu = useCallback(() => {
        const pathName = path.pathname;
        let matchingMenuItem = null;
        const ul:any = document.getElementById("side-menu");
        const items = ul.getElementsByTagName("a");
        removeActivation(items);

        for (let i = 0; i < items.length; ++i) {
          if (pathName === items[i].pathname) {
            matchingMenuItem = items[i];
            break;
          }
        }
        if (matchingMenuItem) {
          activateParentDropdown(matchingMenuItem);
        }
      }, [path.pathname, activateParentDropdown]);

    useEffect(() => {
        ref.current.recalculate();
    },[]);

    const scrollElement = useCallback(
        (item: any) => {
            if (item && ref && ref.current) {
                const currentPosition = item.offsetTop;
                if (currentPosition > window.innerHeight) {
                    ref.current.getScrollElement().scrollTop = currentPosition - 300;
                    window.scrollTo(0, currentPosition - 300);
                }
            }
        },
        [ref],
    );

      useEffect(() => {
        new MetisMenu("#side-menu");
        activeMenu();
      }, []);

      useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        activeMenu();
      }, [activeMenu]);

    return (
        <React.Fragment>
            <SimpleBar ref={ref} className="sidebar-menu-scroll" id="nav-scroll">
                <div id="sidebar-menu">
                    <ul className="metismenu list-unstyled" id="side-menu">
                        {
                            (menuItems || []).map((item, key) => {
                                return (
                                    <React.Fragment key={key}>
                                        {/* Menu Item render */}
                                        {item["isHeader"] ? (
                                            <HeaderMenuItem item={item} />
                                        ) : (
                                            <MenuItem item={item} props={props} />
                                        )}
                                    </React.Fragment>
                                );
                            })
                        }
                    </ul>
                </div>
            </SimpleBar>
        </React.Fragment>
    );
};

export default withTranslation()(withRouter(SidebarContent));