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
	fishing_month: {
	  id: number;
	  maximum_seat: number;
	  month: string;
	  fishing_id: number;
	  fishing: {
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
		needs_check: boolean;
		price: string | null;
		business_address: string;
		created_at: string;
		harbor: {
		  sea: any | null;
		  id: number;
		  address: string | null;
		  name: string;
		};
	  };
	};
	available_seats: number;
};

const BookingFishingList = () => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1); // add this line
	const [bookings, setBookings] = useState<BookingObj[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
  
	useEffect(() => {
		const fetchData = async () => {
		  setIsLoading(true);
	  
		  try {
			const response = await fetch(`/fishing/list/?page=${currentPage}`, {
			  headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			  },
			});
	  
			const data = await response.json();
			setBookings((prevBookings) => [...prevBookings, ...data.booking_objs]);
			setLastPage(data.last_page); // add this line
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
			  if (currentPage < lastPage) { // add this condition
				setCurrentPage((prevPage) => prevPage + 1);
			  }
			}
		  });
	  
		  if (node) observer.current.observe(node);
		},
		[isLoading, currentPage, lastPage]
	);
  
	return (
	  <React.Fragment>
		<div className="page-content">
		  <Container fluid>
			{/* Render Breadcrumbs */}
			<Row>
			{bookings.map((booking, index) => (
				<Col md={6} lg={4} xl={3} key={booking.fishing_month.fishing.id}>
					<Link to={`/booking/${booking.fishing_month.fishing.id}/`}>
						<Card>
						<img
							className="card-img-top img-fluid"
							src={booking.fishing_month.fishing.thumbnail}
							alt=""
						/>
						<CardBody>
							<h4 className="card-title mb-0">
							[{booking.fishing_month.fishing.harbor.name}] {booking.fishing_month.fishing.display_business_name}
							</h4>
						</CardBody>
						<ul className="list-group list-group-flush">
							<li className="list-group-item">남은자리 : {booking.available_seats}명</li>
						</ul>
						</Card>
					</Link>
					{bookings.length === index + 1 && (
						<div ref={lastBookingRef}></div>
					)}

				</Col>
				
				))}
			</Row>
		  </Container>
		</div>
	  </React.Fragment>
	);
  };
  
  export default BookingFishingList;