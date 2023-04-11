import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Row,
} from "reactstrap";

//import images
import img1 from "../../assets/images/small/img-1.jpg";


const Booking = () => {
  document.title = "Cards | Dashonic - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Row>
            <Col md={6} xl={3}>
				<Link to="#">
					<Card>
						<img className="card-img-top img-fluid" src={img1} alt="" />
						<CardBody>
						<h4 className="card-title mb-2">Card title</h4>
						<CardText>
							Some quick example text to build on the card title and make
							up the bulk of the card&apos;s content.
						</CardText>
						

						
						</CardBody>
					</Card>
				</Link>
            </Col>
          </Row>
          
          
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Booking;
