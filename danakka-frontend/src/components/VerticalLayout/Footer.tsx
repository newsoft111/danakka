import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{new Date().getFullYear()} © Dashonic.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                    Crafted with <i className="mdi mdi-heart text-danger"></i> by <Link to="https://Pichforest.com/" target="_blank" rel="noreferrer" className="text-reset">Pichforest</Link>
                </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;