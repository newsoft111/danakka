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



const Booking = () => {
	return (
	  <React.Fragment>
		<div className="page-content">
		  <Container fluid>
			{/* Render Breadcrumbs */}
			<Row>
				<Col>
					<Link to="#">
					<Card>
						<img
						className="card-img-top img-fluid"
						src='#'
						alt=""
						/>
						<CardBody>
						<h4 className="card-title mb-0">
							123123
						</h4>
						</CardBody>
						<ul className="list-group list-group-flush">
						<li className="list-group-item">남11은자리 : 100명</li>
						</ul>
					</Card>
					</Link>
				</Col>
			</Row>

			<Row>
				<Col>
					<Link to="#">
					<Card>
						<img
						className="card-img-top img-fluid"
						src='#'
						alt=""
						/>
						<CardBody>
						<h4 className="card-title mb-0">
							123123
						</h4>
						</CardBody>
						<ul className="list-group list-group-flush">
						<li className="list-group-item">남11은자리 : 100명</li>
						</ul>
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