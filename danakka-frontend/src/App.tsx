import React from "react";

import { Route, Routes } from "react-router-dom";

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes";

//redux
import { useSelector } from "react-redux";

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/index";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";

import fakeBackend from "./helpers/AuthType/fakeBackend";

//api config
// import config from "./config";

// Activating fake backend
fakeBackend();

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// }

//init firebase backend
//initFirebaseBackend(config["firebase"]);

function getLayout(layoutType : string) {
  let layoutCls: Object = VerticalLayout;
  switch (layoutType) {
    case "horizontal":
      layoutCls = HorizontalLayout;
      break;
    default:
      layoutCls = VerticalLayout;
      break;
  }
  return layoutCls;
}
const App = () => {
  const { layoutType } = useSelector((state: any) => ({
    layoutType: state.Layout.layoutType,
  }));


  const Layout : any = getLayout(layoutType);
  return (
    <React.Fragment>
        <Routes>
          <Route>
              {authRoutes.map((route, idx) => (
                  <Route
                      path={route.path}
                      element={
                          <NonAuthLayout>
                              {route.component}
                          </NonAuthLayout>
                      }
                      key={idx}
                      exact={true}
                  />
              ))}
          </Route>

          <Route>
              {userRoutes.map((route, idx) => (
                  <Route
                      path={route.path}
                      element={
                          //<Authmiddleware>
                              <Layout>{route.component}</Layout>
                          //</Authmiddleware>
                        }
                      key={idx}
                      exact={true}
                  />
              ))}
          </Route>
        </Routes>
    </React.Fragment>
  );
};

export default App;