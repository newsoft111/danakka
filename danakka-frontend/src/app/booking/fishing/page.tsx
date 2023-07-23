'use client'
import React, { useState, useEffect, useCallback } from "react";
import NextLink from 'next/link'
import {
  Box,
  Image,
  Badge,
  SimpleGrid,
  Select,
  Button,
  Checkbox,
  Flex,
  Link,
} from '@chakra-ui/react';
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import {getData} from '../../../util/Api'
import {DateToStr} from '../../../util/DateFormat'
import {DateToStrYM} from '../../../util/DateFormat'
import { ScrollRestoration } from '../../../util/ScrollRestoration'

const getYesterday = (): Date => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
};
const yesterday: Date = getYesterday();


interface Fishing {
	display_business_name: string;
	fishing_type_id: number;
	id: number;
	site_url: string | null;
	fishing_crawler_id: number;
	thumbnail: string;
	is_deleted: boolean;
	introduce: string | null;
	reason_for_deletion: null;
	maximum_seat: number;
	needs_check: boolean;
	price: null;
	business_address: string;
	created_at: string;
	harbor_id: number;
	updated_at: string;
	harbor: {
	  address: null;
	  name: string;
	  id: number;
	  sea: null;
	};
}
  
interface FishingMonth {
	month: string;
	fishing_id: number;
	id: number;
	maximum_seat: number;
	fishing: Fishing;
	fishing_species: []
}
  
interface Booking {
	fishing_month: FishingMonth;
	available_seats: number;
	species_items: [string];
}
  
interface BookingObj {
	booking_objs: Booking[];
	last_page: number;
}
  

const BookingFishingList = () => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1); // add this line
	const [bookings, setBookings] = useState<BookingObj[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedFishingType, setSelectedFishingType] = useState<string>('');
	const [selectedSpeciesItem, setselectedSpeciesItem] = useState<string>('');
	const [SelectedHarbor, setSelectedHarbor] = useState<string>('');
	const [SelectedDate, setSelectedDate] = useState(new Date());
	const [selectedAvailableSeats, setAvailableSeats] = useState<string>("1");
	const [canBooking, setCanBooking] = useState<boolean>(true);
	
	useEffect( () => {
		// 페이지 이동 후 저장되어 있던 위치로 스크롤 복원
		const _scroll = sessionStorage.getItem(`__next_scroll_${window.history.state.idx}`);
		if (_scroll) {
			// 스크롤 복원 후 저장된 위치 제거
			const { x, y } = JSON.parse(_scroll);
			const currentX = window.scrollX;
			const currentY = window.scrollY;
			
			if (currentY < y) {
				window.scrollTo(0, document.body.scrollHeight);				
			} else {
				window.scrollTo(x, y);
			}

			if (currentX === x && currentY === y) sessionStorage.removeItem(`__next_scroll_${window.history.state.idx}`);

			
		}
	})


	const configs = {
		dateFormat: 'yyyy-MM-dd',
		dayNames: '월화수목금토일'.split(''),
		monthNames: '1월 2월 3월 4월 5월 6월 7월 8월 9월 10월 11월 12월'.split(' '),
	};
  
	useEffect(() => {
		const fetchData = async () => {
		  setIsLoading(true);
	  
		  try {
			const date = DateToStr(SelectedDate);

			const data = await getData<BookingObj>(`/api/fishing/list/`,
			{
				"page": currentPage,
				"fishing_type": selectedFishingType,
				'species_item': selectedSpeciesItem,
				'harbor': SelectedHarbor,
				'date': date,
				'available_seats_number': selectedAvailableSeats,
				'can_booking': canBooking

			});
			

			if (data) {
				setBookings((prevBookings) => [
					...prevBookings,
					{ booking_objs: [...data.booking_objs], last_page: data.last_page },
				]);
				  
				setLastPage(data.last_page);	
			}
			setIsLoading(false);
		  } catch (error) {
			console.error(error);
		  }
		};
	  
		fetchData();
	}, [currentPage, selectedFishingType, selectedSpeciesItem, SelectedHarbor, SelectedDate, selectedAvailableSeats, canBooking]);

	const handleFishingTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedFishingType(event.target.value);
		setCurrentPage(1); // selectedFishingType이 변경되면 currentPage를 1로 설정
		setBookings([]); // bookings 배열 초기화
	};

	const handleSpeciesItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setselectedSpeciesItem(event.target.value);
		setCurrentPage(1); // selectedFishingType이 변경되면 currentPage를 1로 설정
		setBookings([]); // bookings 배열 초기화
	};

	const handleHarborChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedHarbor(event.target.value);
		setCurrentPage(1); // selectedFishingType이 변경되면 currentPage를 1로 설정
		setBookings([]); // bookings 배열 초기화
	};

	const handleDateChange = (selectedDate: Date) => {
		setSelectedDate(selectedDate);
		setCurrentPage(1); // selectedFishingType이 변경되면 currentPage를 1로 설정
		setBookings([]); // bookings 배열 초기화
	};


	const handleAvailableSeatsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setAvailableSeats(event.target.value);
		setCanBooking(true);
		setCurrentPage(1);
		setBookings([]);
	};

	const handleCanBookingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		setCanBooking(target.checked);
		setAvailableSeats(target.checked && selectedAvailableSeats === '' ? '1' : '');
		
		setCurrentPage(1);
		setBookings([]);
	};

	const handleResetFilter = () => {
		setselectedSpeciesItem('');
		setSelectedHarbor('');
		setSelectedDate(new Date());
		setAvailableSeats("");
		setCanBooking(true);
		setCurrentPage(1);
		setBookings([]);
	};
  
	const handleScroll = useCallback(() => {
		if (
		  window.innerHeight + document.documentElement.scrollTop ===
			document.documentElement.offsetHeight &&
		  currentPage < lastPage &&
		  !isLoading
		) {
		  setCurrentPage((prevPage) => prevPage + 1);
		}
	}, [currentPage, lastPage, isLoading]);
	  
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
		  window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	
  
	return (
		<React.Fragment>
			<Flex mb={4} direction={{ base: "column", md: "row" }} gap={4}>
					<Select 
					placeholder='낚시종류' 
					value={selectedFishingType}
					onChange={handleFishingTypeChange}
					>
						<option value='선상'>선상</option>
						<option value='선외기'>선외기</option>
						<option value='좌대'>좌대</option>
					</Select>

					<Select
					placeholder='어종'
					value={selectedSpeciesItem}
					onChange={handleSpeciesItemChange}
					>
						<option value='광어'>광어</option>
						<option value='우럭'>우럭</option>
						<option value='부시리'>부시리</option>
						<option value='한치'>한치</option>
					</Select>

					<Select
					placeholder='항구'
					value={SelectedHarbor}
					onChange={handleHarborChange}
					>
						<option value='대천항'>대천항</option>
					</Select>
					
					<SingleDatepicker
						configs={configs}
						minDate={yesterday}
						date={SelectedDate}
						onDateChange={handleDateChange}
					/>

					<Select
						placeholder='인원'
						onChange={handleAvailableSeatsChange}
						value={selectedAvailableSeats}
					>
						<option value='1'>1명</option>
						<option value='2'>2명</option>
						<option value='3'>3명</option>
					</Select>

					<Checkbox
						isChecked={canBooking}
						flexShrink={0}
						onChange={handleCanBookingChange}
					>
						예약가능
					</Checkbox>
					
					<Button
						colorScheme='teal'
						flexShrink={0}
						size='md'
						onClick={handleResetFilter}
					>
						초기화
					</Button>

			</Flex>
			<SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={10}>
			{bookings.map((bookingObj) =>
				bookingObj.booking_objs.map((booking, index) => (
				<Link
				onClick={ScrollRestoration}
				as={NextLink}
				href={`/booking/fishing/${booking.fishing_month.fishing.id}?dateYM=${DateToStrYM(SelectedDate)}`} key={index}

				>
					<Box
						maxW='sm'
						borderWidth='1px'
						borderRadius='lg'
						overflow='hidden'
					>
						<Image 
						w="100%"
						src={`http://newsoft.kr:8500${booking.fishing_month.fishing.thumbnail}`}
						alt=''
						/>
				
						<Box p='6'>
							<Box display={{ base: 'block', xl: 'flex' }} alignItems='baseline'>
								{booking.available_seats > 0 ? (
									<Badge borderRadius='full' px="2" colorScheme='teal'>
										예약가능
									</Badge>
								) : (
									<Badge borderRadius='full' px="2" colorScheme='red'>
										예약불가능
									</Badge>
								)}
								<Box
								color='gray.500'
								fontWeight='semibold'
								letterSpacing='wide'
								fontSize='xs'
								textTransform='uppercase'
								ml={{ base: '0', xl: '2' }}
								>
								남은자리 : {booking.available_seats}명
								</Box>
							</Box>
					
							<Box
								mt='1'
								fontWeight='semibold'
								as='h4'
								lineHeight='tight'
							>
								[{booking.fishing_month.fishing.harbor.name}]
							</Box>
							<Box
								fontWeight='semibold'
								as='h4'
								lineHeight='tight'
							>
								{booking.fishing_month.fishing.display_business_name}
							</Box>

					
							<Box mt='1'>
								어종 : {booking.species_items.join(",")}
							</Box>
					
							
						</Box>
						

					</Box>
				</Link>
				
				))
  			)}
			</SimpleGrid>
		</React.Fragment>
	)
}

export default BookingFishingList;