import React, { useEffect } from "react";
import { Row, Col, Alert, Container, Form, Input, Label, Button } from "reactstrap";

// action
import { registerUser } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// import images
import logoDark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";

const Register = () => {
  document.title = "Register | Dashonic - React Admin & Dashboard Template";
  
  const dispatch = useDispatch();

  const { user, registrationError } = useSelector((state: any) => ({
    user: state.register.user,
    registrationError: state.register.registrationError,
    loading: state.register.loading,
  }));

  // handleValidSubmit
  const handleValidSubmit = (values: any) => {
    dispatch(registerUser(values));
  };

  useEffect(() => {
    // dispatch(apiError(""));
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="authentication-bg min-vh-100">
        <div className="bg-overlay bg-white"></div>
        <Container>
          <div className="d-flex flex-column min-vh-100 px-3 pt-4">
            <Row className="justify-content-center my-auto">
              <Col md={8} lg={6} xl={4}>
                <div className="py-5">
                  <div className="mb-4 mb-md-5">
                    <Link to="/sales" className="d-block auth-logo text-center">
                      <img src={logoDark} alt="" height="22" className="auth-logo-dark" />
                      <img src={logolight} alt="" height="22" className="auth-logo-light" />
                    </Link>
                  </div>
                  <div className="text-center mb-4">
                    <h5 className="">Register Account</h5>
                    <p>Get your free Dashonic account now.</p>
                  </div>
                  <Form
                    className="needs-validation custom-form mt-4 pt-2"
                    onValidSubmit={(e: any, v: any) => {
                      e.handleValidSubmit(v);
                    }}
                  >
                    {user && user ? (
                      <Alert color="success">
                        Register User Successfully
                      </Alert>
                    ) : null}

                    {registrationError && registrationError ? (
                      <Alert color="danger">{registrationError}</Alert>
                    ) : null}

                      <div className="form-group">
                        <Label>Email</Label>
                          <Input
                            name="Email"
                            placeholder="Enter Email"
                            id="Email"
                            type="email"
                            required
                            className="is-untouched is-pristine av-invalid form-control"/>
                      </div>
                      <div className="form-group">
                        <Label>Username</Label>
                          <Input
                            name="username"
                            placeholder="Enter username"
                            id="username"
                            type="text"
                            required
                            className="is-untouched is-pristine av-invalid form-control"/>
                      </div>
                      <div className="form-group">
                        <Label>Password</Label>
                          <Input
                            name="Password"
                            placeholder="Enter Password"
                            id="Password"
                            type="password"
                            required
                            className="is-untouched is-pristine av-invalid form-control"/>
                      </div>

                    <div className="text-start">
                      <p>By registering you agree to the Dashonic <Link to="#" className="text-decoration-underline">Terms of Use</Link></p>
                    </div>

                    <div className="mt-3">
                      <Button className="btn btn-info w-100" onClick={handleValidSubmit} type="submit">Register</Button>
                    </div>
                  </Form>

                  <div className="mt-5 text-center">
                    <p>Already have an account ? <Link to="/login" className="fw-medium text-decoration-underline"> Signin </Link></p>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg="12">
                <div className="text-center text-muted p-4">
                  <p className="mb-0">&copy; {new Date().getFullYear()} Dashonic. Crafted with <i className="mdi mdi-heart text-danger"></i> by Pichforest</p>
                </div>
              </Col>
            </Row>

          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
