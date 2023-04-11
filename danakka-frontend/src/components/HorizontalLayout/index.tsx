import React, { useEffect, useState } from "react";

//actions
import {
  changeLayout,
  changeTopbarTheme,
  changeLayoutWidth,
  changelayoutMode,
} from "../../slices/thunks";

//constants
import { layoutTypes } from "../../constants/layout";

//redux
import { useSelector, useDispatch } from "react-redux";

//components
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: any;
}

const Layout = (props: LayoutProps) => {
  const dispatch = useDispatch();

  const { topbarTheme, layoutWidth, layoutMode, layoutType } = useSelector(
    (state: any) => ({
      layoutMode: state.Layout.layoutMode,
      topbarTheme: state.Layout.topbarTheme,
      layoutWidth: state.Layout.layoutWidth,
      isPreloader: state.Layout.isPreloader,
      layoutType: state.Layout.layoutType,
    })
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /*
  layout settings
  */
  useEffect(() => {
    dispatch(changeLayout(layoutTypes.HORIZONTAL));
  }, [dispatch]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [dispatch, topbarTheme]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [dispatch, layoutWidth]);

  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  useEffect(() => {
    if (layoutMode) {
      dispatch(changelayoutMode(layoutMode, layoutType));
    }
  }, [layoutMode, dispatch]);

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <header id="page-topbar">
          <Header />
          <Navbar menuOpen={isMenuOpened} />
        </header>
        <div className="main-content">{props.children}</div>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Layout;
