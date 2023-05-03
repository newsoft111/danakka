import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

import {
	Card,
	CardBody,
	Col,
	Container,
	Row,
	ButtonGroup, 
	Button,
	Table
} from "reactstrap";

interface FishingObj {
	id: number;
	harbor_id: number;
	fishing_type_id: number;
	fishing_crawler_id: number;
	display_business_name: string;
	site_url: string | null;
	introduce: string;
	thumbnail: string;
	maximum_seat: number;
	price: number | null;
	business_address: string;
	is_deleted: boolean;
	needs_check: boolean;
	reason_for_deletion: string | null;
	created_at: string;
	updated_at: string;
	harbor: {
		sea: any | null;
		id: number;
		address: string | null;
		name: string;
	};
	species_item_name: string;
}
  
interface Availability {
	  total_person: number;
	  maximum_seat: number;
	  available_seats: number;
	  date: string;
}
  
interface FishingData {
	fishing_objs: FishingObj;
	booking_objs: Availability[];
}

const BookingFishingView = () => {
	
	const [fishingData, setFishingData] = useState<FishingData | null>(null);

	const { no }: { no: number } = useParams();

	useEffect(() => {
		async function fetchData() {
			const response = await fetch(`/fishing/${no}/`);
			const data = await response.json();
			setFishingData(data);
		}
	
		fetchData();
	}, []);
		
	const months = [
		{ month: 1, year: 2024, label: '1월' },
		{ month: 2, year: 2024, label: '2월' },
		{ month: 3, year: 2024, label: '3월' },
		{ month: 4, year: 2023, label: '4월' },
		{ month: 5, year: 2023, label: '5월' },
		{ month: 6, year: 2023, label: '6월' },
		{ month: 7, year: 2023, label: '7월' },
		{ month: 8, year: 2023, label: '8월' },
		{ month: 9, year: 2023, label: '9월' },
		{ month: 10, year: 2023, label: '10월' },
		{ month: 11, year: 2023, label: '11월' },
		{ month: 12, year: 2023, label: '12월' },
	];

	return (
	  <React.Fragment>
		<div className="page-content">
		  <Container fluid>
			{/* Render Breadcrumbs */}

			<Row>
				<Col>
					<Card>
						<CardBody>
							<Row>
							<Col lg="6">
								<img className="img-fluid rounded-3" src="/media/media/images/202304120956/39fb944004eb5909aa3be2d748cdc07d_mini.jpg" alt="싹쓰리호" />
							</Col>
							<Col lg="6" className="mt-3 mt-lg-0">
								<h2 className="m-0 text-break">[{fishingData && fishingData.fishing_objs.harbor.name}] {fishingData && fishingData.fishing_objs.display_business_name}</h2>
								<Button type="button" color="primary" className="w-100 mb-1" href="None/ship/schedule_fleet/202304">홈페이지 예약</Button>
								<Button type="button" color="light" className="w-100 mb-1" href="None/ship/schedule_fleet/202304" data-bs-toggle="modal" data-bs-target="#sendMessageModal">문의하기</Button>
							</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<CardBody>
							<ButtonGroup className="text-center d-flex flex-wrap justify-content-start justify-content-md-between mb-3">
							{months.map((m) => (
								<Button
								key={m.month}
								href={`/fishing/575/?month=${m.month}&year=${m.year}`}
								className="btn btn-soft-primary"
								>
								{m.label}
								</Button>
							))}
							</ButtonGroup>
							
							{fishingData && fishingData.booking_objs.map((booking, index) => (
							<Table bordered className="mb-4" id="fishing-reserve-table" key={index}>
								<tbody>
									<tr className="fw-bold">
									<td colSpan={3}>{booking.date}</td>
									</tr>
									<tr className="text-center fw-bold">
									<td>선박명</td>
									<td style={{ width: '70%' }}>예약현황</td>
									<td style={{ width: '10%' }}>남은자리</td>
									</tr>

									<tr>
									<td className="text-center fw-bold align-middle">
										<dt>{fishingData && fishingData.fishing_objs.display_business_name}</dt>
										<dd>
										<a href="None/ship/schedule_fleet/202304" className="btn btn-info">
											예약하기
										</a>
										</dd>
									</td>
									<td>
										<dt>대상어종 :</dt>
										<dd>{fishingData && fishingData.fishing_objs.species_item_name}</dd>
									</td>
									<td className="text-center fw-bold align-middle">
										<h3 className="mb-0">
										<span className="badge bg-primary">{booking.available_seats}명</span>
										</h3>
									</td>
									</tr>
								</tbody>
							</Table>
							))}
						</CardBody>
						
					</Card>
				</Col>
			</Row>

			
		  </Container>
		</div>
	  </React.Fragment>
	);
  };
  
  export default BookingFishingView;