import React from "react";
//import withRouter
import withRouter from "./Common/withRouter";

//redux
import { useSelector } from "react-redux";

const NonAuthLayout = ({ children }: any) => {
  const {
    layoutMode,
  } = useSelector((state: any) => ({
    layoutMode: state.Layout.layoutMode
  }));

  if (layoutMode === "dark") {
    document.body.setAttribute("data-layout-mode", "light");
    document.body.removeAttribute("data-sidebar");
  } else {
    document.body.setAttribute("data-layout-mode", "light");
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default withRouter(NonAuthLayout);