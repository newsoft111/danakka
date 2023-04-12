import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
	Card,
	CardBody,
	Col,
	Container,
	Row,
	Pagination,
	PaginationItem,
	PaginationLink,
} from "reactstrap";

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
	harbor: {
		sea: string | null;
		id: number;
		name: string;
		address: string | null;    
	};
};

const Booking = () => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [bookings, setBookings] = useState<BookingObj[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
  
	useEffect(() => {
	  const fetchData = async () => {
		setIsLoading(true);
  
		try {
		  const response = await fetch(`/api/booking/?page=${currentPage}`, {
			headers: {
			  Accept: "application/json",
			  "Content-Type": "application/json",
			},
		  });
  
		  const data = await response.json();
		  setBookings((prevBookings) => [...prevBookings, ...data.fishing_objs]);
		  setIsLoading(false);
		} catch (error) {
		  console.error(error);
		}
	  };
  
	  fetchData();
	}, [currentPage]);
  
	const observer = useRef<IntersectionObserver | null>(null);
	const lastBookingRef = useCallback(
      (node: HTMLDivElement | null) => {
		if (isLoading) return;
		if (observer.current) observer.current.disconnect();
  
		observer.current = new IntersectionObserver(([entry]) => {
		  if (entry.isIntersecting) {
			setCurrentPage((prevPage) => prevPage + 1);
		  }
		});
  
		if (node) observer.current.observe(node);
	  },
	  [isLoading]
	);
  
	return (
	  <React.Fragment>
		<div className="page-content">
		  <Container fluid>
			{/* Render Breadcrumbs */}
			<Row>
			  {bookings.map((booking, index) => (
				<Col md={6} lg={4} xl={3} key={booking.id}>
				  {bookings.length === index + 1 ? (
					<div ref={lastBookingRef}>
					  <Link to="#">
						<Card>
						  <img
							className="card-img-top img-fluid"
							src={booking.thumbnail}
							alt=""
						  />
						  <CardBody>
							<h4 className="card-title mb-0">
							  [{booking.harbor.name}] {booking.display_business_name}
							</h4>
						  </CardBody>
						  <ul className="list-group list-group-flush">
							<li className="list-group-item">남은자리 : 20명</li>
						  </ul>
						</Card>
					  </Link>
					</div>
				  ) : (
					<Link to="#">
					  <Card>
						<img
						  className="card-img-top img-fluid"
						  src={booking.thumbnail}
						  alt=""
						/>
						<CardBody>
						  <h4 className="card-title mb-0">
							[{booking.harbor.name}] {booking.display_business_name}
						  </h4>
						</CardBody>
						<ul className="list-group list-group-flush">
						  <li className="list-group-item">남은자리 : 20명</li>
						</ul>
					  </Card>
					</Link>
				  )}
				</Col>
			  ))}
			</Row>
		  </Container>
		</div>
	  </React.Fragment>
	);
  };
  
  export default Booking;
  

