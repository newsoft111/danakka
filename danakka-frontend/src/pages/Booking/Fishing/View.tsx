import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
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



const BookingFishingView = () => {
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
								<h2 className="m-0 text-break">[흥환1리방파제] 싹쓰리호</h2>
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
							

							<Table bordered className="mb-4" id="fishing-reserve-table">
								<tbody>
									<tr className="fw-bold">
									<td colSpan={3}>2023년 04월 17일 월요일, 3물</td>
									</tr>
									<tr className="text-center fw-bold">
									<td>선박명</td>
									<td style={{ width: '70%' }}>예약현황</td>
									<td style={{ width: '10%' }}>남은자리</td>
									</tr>

									<tr>
									<td className="text-center fw-bold align-middle">
										<dt>싹쓰리호</dt>
										<dd>
										<a href="None/ship/schedule_fleet/202304" className="btn btn-info">
											예약하기
										</a>
										</dd>
									</td>
									<td>
										<dt>공지사항 :</dt>
										<dd>
										<span
											style={{
											color: 'rgb(34, 34, 34)',
											fontFamily:
												'-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Segoe UI Symbol", "Android Emoji", EmojiSymbols',
											fontSize: '14px',
											whiteSpace: 'pre-wrap',
											backgroundColor: 'rgb(255, 255, 255)',
											}}
										>
											오후 갑오징어{' '}
										</span>
										<br
											style={{
											boxSizing: 'border-box',
											color: 'rgb(34, 34, 34)',
											fontFamily:
												'-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Segoe UI Symbol", "Android Emoji", EmojiSymbols',
											fontSize: '14px',
											whiteSpace: 'pre-wrap',
											backgroundColor: 'rgb(255, 255, 255)',
											}}
										/>
										<br
											style={{
											boxSizing: 'border-box',
											color: 'rgb(34, 34, 34)',
											fontFamily:
												'-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Segoe UI Symbol", "Android Emoji", EmojiSymbols',
											fontSize: '14px',
											whiteSpace: 'pre-wrap',
											backgroundColor: 'rgb(255, 255, 255)',
											}}
										/>
										<br />
										</dd>

										<dt>운항시간 :</dt>
										<dd>14:00:00~19:00:00</dd>

										<dt>대상어종 :</dt>
										<dd>갑오징어</dd>
									</td>
									<td className="text-center fw-bold align-middle">
										<h3 className="mb-0">
										<span className="badge bg-primary">20명</span>
										</h3>
									</td>
									</tr>
								</tbody>
							</Table>
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