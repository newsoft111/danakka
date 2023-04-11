import React, { useState, useEffect } from "react";
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

type BookingObj = {
  needs_check: boolean;
  price: number | null;
  business_address: string;
  created_at: string;
  harbor_id: number;
  updated_at: string;
  display_business_name: string;
  fishing_type_id: number;
  id: number;
  site_url: string | null;
  fishing_crawler_id: number;
  thumbnail: string;
  is_deleted: boolean;
  introduce: string;
  reason_for_deletion: string | null;
  maximum_seat: number;
  fishing_crawler: {
    uid: string;
    referrer: string;
    id: number;
  };
};

const Booking = () => {
  document.title = "Cards | Dashonic - React Admin & Dashboard Template";

  const [bookings, setBookings] = useState<BookingObj[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/booking/?page=2`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setBookings(data.fishing_objs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Row>
            {bookings.map((booking) => (
              <Col md={6} lg={4} xl={3} key={booking.id}>
                <Link to="#">
                  <Card>
                    <img className="card-img-top img-fluid" src={booking.thumbnail} alt="" />
                    <CardBody>
                      <h4 className="card-title mb-2">{booking.display_business_name}</h4>
                      <CardText>
                        {booking.introduce}
                      </CardText>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Booking;
