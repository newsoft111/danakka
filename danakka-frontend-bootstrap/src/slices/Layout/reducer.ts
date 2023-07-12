import { createSlice } from "@reduxjs/toolkit";

//constants
import {
  layoutTypes,
  layoutWidthTypes,
  topBarThemeTypes,
  layoutTheme,
  layoutPositions,
  leftSidebarTypes,
  leftSideBarThemeTypes,
} from "../../constants/layout";

interface LayoutStateType {
  layoutType  : string;
  layoutWidth : string;
  leftSideBarTheme : string;
  leftSideBarType : any;
  layoutMode : any;
  topbarTheme : any;
  isPreloader : boolean;
  showRightSidebar : boolean;
  layoutPosition : any;
  isMobile : boolean;
  showSidebar : boolean;
  leftMenu : boolean;
}
export const initialState: LayoutStateType = {
  layoutType: layoutTypes.HORIZONTAL,
  layoutWidth: layoutWidthTypes.FLUID,
  leftSideBarTheme: leftSideBarThemeTypes.LIGHT,
  leftSideBarType: leftSidebarTypes.DEFAULT,
  layoutMode: layoutTheme.LIGHTMODE,
  topbarTheme: topBarThemeTypes.LIGHT,
  isPreloader: true,
  showRightSidebar: false,
  layoutPosition: layoutPositions.SCROLLABLE_FALSE,
  isMobile: false,
  showSidebar: true,
  leftMenu: false,
};


const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    changeLayoutAction(state, action) {
      state.layoutType = action.payload
    },
    changeTopbarThemeAction(state, action) {
      state.topbarTheme = action.payload
    },
    changeSidebarThemeAction(state, action) {
      state.leftSideBarTheme = action.payload
    },
    changeLayoutWidthAction(state, action) {
      state.layoutWidth = action.payload
    },
    changeSidebarTypeAction(state, action) {
      state.leftSideBarType = action.payload
    },
    changeLayoutModeAction(state, action) {
      state.layoutMode = action.payload
    },
    changeLayoutPositionAction(state, action) {
      state.layoutPosition = action.payload
    },
  },
});

export const {
  changeLayoutAction,
  changeTopbarThemeAction,
  changeSidebarThemeAction,
  changeLayoutWidthAction,
  changeSidebarTypeAction,
  changeLayoutModeAction,
  changeLayoutPositionAction
} = layoutSlice.actions

export default layoutSlice.reducer;