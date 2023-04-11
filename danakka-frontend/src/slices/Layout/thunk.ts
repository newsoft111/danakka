import { changeBodyAttribute, manageBodyClass } from "./utils";

//constants
import {
  layoutTypes,
  layoutWidthTypes,
  layoutTheme,
  leftSidebarTypes,
} from "../../constants/layout";

// action
import {
  changeLayoutAction,
  changeTopbarThemeAction,
  changeSidebarThemeAction,
  changeLayoutWidthAction,
  changeSidebarTypeAction,
  changeLayoutModeAction,
  changeLayoutPositionAction
} from "./reducer";

export const changeLayout =
  (layoutType: any) => async (dispatch: any) => {
    if (layoutType === layoutTypes.HORIZONTAL) {
      dispatch(changeLayoutAction(layoutTypes.HORIZONTAL));
      document.body.removeAttribute("data-sidebar");
      changeBodyAttribute("data-sidebar-size", leftSidebarTypes.DEFAULT);
    } else {
      dispatch(changeLayoutAction(layoutTypes.VERTICAL));
    }
    changeBodyAttribute("data-layout", layoutType);
  };

export const changelayoutMode =
  (layoutMode: any, layoutType: layoutTypes) =>
  async (dispatch: any) => {
    try {
      dispatch(changeLayoutModeAction(layoutMode));
      if (layoutMode === layoutTheme.LIGHTMODE) {
        changeBodyAttribute("data-layout-mode", layoutMode);
        dispatch(changeTopbarThemeAction(layoutTheme.LIGHTMODE));
      } else if (layoutMode === "dark") {
        changeBodyAttribute("data-layout-mode", layoutMode);
        dispatch(changeTopbarThemeAction(layoutTheme.DARKMODE));
        changeBodyAttribute("data-sidebar", layoutTheme.DARKMODE);
      }
    } catch (error) {}
  };

export const changeTopbarTheme =
  (topbarTheme: any) => async (dispatch: any) => {
    changeBodyAttribute("data-topbar", topbarTheme);
    dispatch(changeTopbarThemeAction(topbarTheme));
  };

export const changeSidebarTheme =
  (sidebarTheme: any) => async (dispatch: any) => {
    changeBodyAttribute("data-sidebar", sidebarTheme);
    dispatch(changeSidebarThemeAction(sidebarTheme));
  };

export const changeLayoutWidth =
  (width: any) => async (dispatch: any) => {
    dispatch(changeLayoutWidthAction(width));
    if (width === layoutWidthTypes.BOXED) {
      dispatch(changeSidebarTypeAction(leftSidebarTypes.COMPACT));
      changeBodyAttribute("data-layout-size", width);
    } else {
      dispatch(changeSidebarTypeAction(leftSidebarTypes.DEFAULT));
      changeBodyAttribute("data-layout-size", width);
    }
  };

export const changeLayoutPosition =
  (layoutPosition: any) => async (dispatch: any) => {
    dispatch(changeLayoutPositionAction(layoutPosition));
    try {
      changeBodyAttribute("data-layout-scrollable", layoutPosition);
    } catch (error) {}
  };

export const changeLeftSidebarTheme =
  (theme: layoutTheme) => async (dispatch: any) => {
    try {
      dispatch(changeBodyAttribute, "data-sidebar", theme);

    } catch (error) {}
  };

export const changeSidebarType =
  (sidebarType: any, isMobile?: boolean) =>
  async (dispatch: any) => {
  
    switch (sidebarType) {
      case leftSidebarTypes.COMPACT:
        manageBodyClass("sidebar-enable", "remove");
        changeBodyAttribute("data-sidebar-size", "md");
        break;
      case leftSidebarTypes.ICON:
        manageBodyClass("sidebar-enable", "remove");
        changeBodyAttribute("data-sidebar-size", "sm");
        break;
      case leftSidebarTypes.DEFAULT:
        if (window.screen.width < 992) {
          manageBodyClass("sidebar-enable", "remove");
          changeBodyAttribute("data-sidebar-size", "lg");
        } else {
          changeBodyAttribute("data-sidebar-size", "lg");
          manageBodyClass("sidebar-enable", "add");
        }
        break;
      default:
        changeBodyAttribute("data-sidebar-size", "lg");
        manageBodyClass("sidebar-enable", "remove");
        break;
    }

    dispatch(changeSidebarTypeAction(sidebarType));
  };
