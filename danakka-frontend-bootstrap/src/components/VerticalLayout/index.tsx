import React, { useEffect } from "react";

//import components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

//constants
import {
  layoutTypes
} from "../../constants/layout";

//import actions
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  changelayoutMode,
} from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

interface LayoutProps {
  children: any;
}
const Layout = (props: LayoutProps) => {
  const dispatch = useDispatch();

  const {
    layoutMode,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    layoutType,
    leftSideBarTheme,
  } = useSelector((state: any) => ({
    layoutMode: state.Layout.layoutMode,
    leftSideBarType: state.Layout.leftSideBarType,
    layoutWidth: state.Layout.layoutWidth,
    topbarTheme: state.Layout.topbarTheme,
    layoutType: state.Layout.layoutType,
    leftSideBarTheme: state.Layout.leftSideBarTheme,
  }));

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(changeLayout(layoutTypes.VERTICAL));
  }, [dispatch]);

  useEffect(() => {
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }
  }, [leftSideBarTheme, dispatch]);

  useEffect(() => {
    if (layoutMode) {
      dispatch(changelayoutMode(layoutMode, layoutType));
    }
  }, [layoutMode, dispatch]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [layoutWidth, dispatch]);

  useEffect(() => {
    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType));
    }
  }, [leftSideBarType, dispatch]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [topbarTheme, dispatch]);

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Header />
        <Sidebar
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
        />
        <div className="main-content">
          {props.children}
          <Footer />  
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;