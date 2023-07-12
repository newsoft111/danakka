import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, CardBody, Button, Form, Input, Label, FormFeedback } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

// withRouter
import withRouter from "src/components/Common/withRouter";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile } from "../../slices/thunks";
import { useFormik } from "formik";
import * as Yup from "yup";


const UserProfile = () => {
  document.title = "Profile | Dashonic - React Admin & Dashboard Template";
  const dispatch = useDispatch();

  const { error, success } = useSelector((state: any) => ({
    error: state.profile.error,
    success: state.profile.success,
  }));

  {
    console.log("success", success);
  }

  const [email, setemail] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [idx, setidx] = useState<number>(1);

  useEffect(() => {
    const authUser: any = localStorage.getItem("authUser");

    if (authUser) {
      const obj = JSON.parse(authUser);
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        if(obj.displayName){
          setname(obj.displayName);
        }else{
          setname(obj.fullName);
        }
        setemail(obj.email);
        setidx(obj.uid);
        
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        if(obj.username){
          setname(obj.username);
          setemail(obj.email);
          setidx(obj.uid);
        }else{
          setname(obj.name);
        }
      }
    }

  }, [dispatch, success]);

  function handleValidSubmit(event: any, values: any) {
    dispatch(editProfile(values));
  }

    const validation = useFormik({
      // enableReinitialize : use this flag when initial values needs to be changed
      enableReinitialize: true,

      initialValues: {
        username: name || "",
        idx: idx || "",
      },
      validationSchema: Yup.object({
        username: Yup.string().required("Please Enter Your UserName"),
      }),
      onSubmit: values => {
        dispatch(editProfile(values));
      },
    });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Dashonic" breadcrumbItem="Profile" />

          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center ms-3">
                      <div className="text-muted">
                        <h5>{name}</h5>
                        <p className="mb-1">{email}</p>
                        <p className="mb-0">Id no: #{idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Change User Name</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={e => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="username"
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.username || ""}
                    invalid={
                      validation.touched.username && validation.errors.username
                        ? true
                        : false
                    }
                  />
                  {validation.touched.username && validation.errors.username ? (
                    <FormFeedback type="invalid">
                      {validation.errors.username}
                    </FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </div>

                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update User Name
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);