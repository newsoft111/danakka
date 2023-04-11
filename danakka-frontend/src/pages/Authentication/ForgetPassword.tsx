import React from "react";
import { Row, Col, Alert, Container, Form, Input } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// withRouter
import withRouter from "src/components/Common/withRouter";


// action
import { userForgetPassword } from "../../slices/thunks";

//import images
import logolight from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logo-dark.png";

interface ForgetPasswordProps {
  history: object;
}

const ForgetPasswordPage = ({ history }: ForgetPasswordProps) => {
  document.title = "Forget Password | Dashonic - React Admin & Dashboard Template";
  const dispatch = useDispatch();

  const { forgetError, forgetSuccessMsg } = useSelector((state: any) => ({
    forgetError: state.forgetPassword.forgetError,
    forgetSuccessMsg: state.forgetPassword.forgetSuccessMsg,
  }));

  function handleValidSubmit(event: any, values: any) {
    dispatch(userForgetPassword(values, history));
  }
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
                      <img src={logoDark} alt="" height="22" className="auth-logo-dark" />
                      <img src={logolight} alt="" height="22" className="auth-logo-light" />
                    </Link>
                  </div>
                  <div className="text-muted mb-4">
                    <h5 className="">Forgot Password</h5>
                    <p>Forgot Your Password?</p>
                  </div>

                  {forgetError && forgetError ? (
                    <Alert color="danger" style={{ marginTop: "13px" }}>
                      {forgetError}
                    </Alert>
                  ) : null}
                  {forgetSuccessMsg ? (
                    <Alert color="success" style={{ marginTop: "13px" }}>
                      {forgetSuccessMsg}
                    </Alert>
                  ) : null}

                  <Form
                    className="custom-form mt-4"
                    onValidSubmit={(e: any, v: any) =>
                      handleValidSubmit(e, v)
                    }
                  >
                    <div className="form-floating form-floating-custom mb-3">
                      <Input
                        name="email"
                        label="Email"
                        className="form-control"
                        placeholder="Enter email"
                        type="email"
                        required
                      />
                    </div>
                    <div className="mt-3">
                      <button
                        className="btn btn-info w-100"
                        type="submit"
                      >
                        Reset
                      </button>
                    </div>
                  </Form>

                  <div className="mt-5 text-center text-muted">
                    <p>Remember It ? <Link to="login" className="fw-medium text-decoration-underline"> Sign In </Link></p>
                  </div>

                </div>
              </Col>
            </Row>

            <Row>
              <Col lg="12">
                <div className="text-center text-muted p-4">
                  <p className="mb-0">&copy; {" "}{new Date().getFullYear()} Dashonic. Crafted with <i className="mdi mdi-heart text-danger"></i> by Pichforest</p>
                </div>
              </Col>
            </Row>

          </div>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ForgetPasswordPage);