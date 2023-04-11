import React, { useState } from "react";

import { Row, Col, Alert, Container, Input, Label, Form, FormFeedback } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

// withRouter
import withRouter from "src/components/Common/withRouter";

// actions
import { loginUser, socialLogin } from "../../slices/thunks";

//import images
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";
import { useFormik } from "formik";
import * as Yup from "yup";


interface LoginProps {
  props: any;
}

const Login = ({ props }: LoginProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  document.title = "Login | Dashonic - React Admin & Dashboard Template";

  const { error } = useSelector((state: any) => ({
    error: state.login.error,
  }));

   const validation = useFormik({
     // enableReinitialize : use this flag when initial values needs to be changed
     enableReinitialize: true,

     initialValues: {
       email: "admin@themesbrand.com" || "",
       password: "123456" || "",
     },
     validationSchema: Yup.object({
       email: Yup.string().required("Please Enter Your Email"),
       password: Yup.string().required("Please Enter Your Password"),
     }),
     onSubmit: values => {
       dispatch(loginUser(values, navigate));
     },
   });


  const signIn = (res: any, type: any) => {
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      };
      dispatch(socialLogin(postData, history, type));
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        token: res.accessToken,
      };
      dispatch(socialLogin(postData, history, type));
    }
  };

  //handleGoogleLoginResponse
  const googleResponse = (response: Object) => {
    signIn(response, "google");
  };

  //handleFacebookLoginResponse
  const facebookResponse = (response: Object) => {
    signIn(response, "facebook");
  };

  return (
    <React.Fragment>
      <div className="authentication-bg min-vh-100">
        <div className="bg-overlay bg-white"></div>
        <Container>
          <div className="d-flex flex-column min-vh-100 px-3 pt-4">
            <Row className="justify-content-center my-auto">
              <Col md={8} lg={6} xl={4}>
                <div className="text-center py-5">
                  <div className="mb-4 mb-md-5">
                    <Link to="/sales" className="d-block auth-logo">
                      <img
                        src={logoDark}
                        alt=""
                        height="22"
                        className="auth-logo-dark"
                      />
                      <img
                        src={logoLight}
                        alt=""
                        height="22"
                        className="auth-logo-light"
                      />
                    </Link>
                  </div>
                  <div className="mb-4">
                    <h5>Welcome Back !</h5>
                    <p>Sign in to continue to Dashonic.</p>
                  </div>
                  <Form
                    onSubmit={e => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="form-floating form-floating-custom text-start mb-3">
                      <Input
                        type="text"
                        name="email"
                        className="form-control"
                        id="input-username"
                        placeholder="Enter User Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email
                            ? true
                            : false
                        }
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null}
                      <Label htmlFor="input-username">Username</Label>
                      <div className="form-floating-icon">
                        <i className="uil uil-users-alt"></i>
                      </div>
                    </div>
                    <div className="form-floating form-floating-custom text-start mb-3">
                      <Input
                        name="password"
                        type="password"
                        className="form-control"
                        id="input-password"
                        placeholder="Enter Password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.password || ""}
                        invalid={
                          validation.touched.password &&
                          validation.errors.password
                            ? true
                            : false
                        }
                      />
                      {validation.touched.password &&
                      validation.errors.password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.password}
                        </FormFeedback>
                      ) : null}
                      <Label htmlFor="input-password">Password</Label>
                      <div className="form-floating-icon">
                        <i className="uil uil-padlock"></i>
                      </div>
                    </div>

                    <div className="form-check form-check-info font-size-16">
                      <Input
                        className="form-check-input"
                        type="checkbox"
                        id="remember-check"
                      />
                      <Label
                        className="form-check-label font-size-14"
                        htmlFor="remember-check"
                      >
                        Remember me
                      </Label>
                    </div>

                    <div className="mt-3">
                      <button className="btn btn-info w-100" type="submit">
                        Log In
                      </button>
                    </div>

                    <div className="mt-4">
                      <Link
                        to="/auth-resetpassword-basic"
                        className="text-muted text-decoration-underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </Form>

                  <div className="mt-5 text-center text-muted">
                    <p>
                      Don&apos;t have an account ?{" "}
                      <Link
                        to="/register"
                        className="fw-medium text-decoration-underline"
                      >
                        {" "}
                        Signup{" "}
                      </Link>
                    </p>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col xl={12}>
                <div className="text-center text-muted p-4">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} Dashonic. Crafted with{" "}
                    <i className="mdi mdi-heart text-danger"></i> by Pichforest
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};