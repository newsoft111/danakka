'use client'
import React, { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import NextLink from 'next/link'
import { Box, Image, Badge, SimpleGrid, Select, Button, Checkbox, Flex, Link } from '@chakra-ui/react';
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { getData } from '../../../util/Api'
import { DateToStr, DateToStrYM } from '../../../util/DateFormat'
import { useScrollRestoration } from '../../../hook/useScrollRestoration'

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
	current_page: number;
}
  

const BookingFishingList = () => {
	const [selectedFishingType, setSelectedFishingType] = useState<string>('');
	const [selectedSpeciesItem, setselectedSpeciesItem] = useState<string>('');
	const [SelectedHarbor, setSelectedHarbor] = useState<string>('');
	const [SelectedDate, setSelectedDate] = useState(new Date());
	const [selectedAvailableSeats, setAvailableSeats] = useState<string>("1");
	const [canBooking, setCanBooking] = useState<boolean>(true);
	const scrollRestoration = new useScrollRestoration();
	
	useEffect( () => {
		scrollRestoration.getPosition();
	})

	
	const saveFilterDataToLocalStorage = () => {
		const expirationDate = new Date();
		expirationDate.setHours(23, 59, 59); // 시간을 23시 59분 59초로 설정

		const filterData = {
		  selectedFishingType,
		  selectedSpeciesItem,
		  SelectedHarbor,
		  SelectedDate: SelectedDate.toISOString(), // Convert date to string for storage
		  selectedAvailableSeats,
		  canBooking,
		  expirationDate: expirationDate.toISOString(),
		};
		localStorage.setItem("filterData", JSON.stringify(filterData));
	};
	
	const loadFilterDataFromLocalStorage = () => {
		const storedFilterData = localStorage.getItem("filterData");

		if (storedFilterData) {
		  const filterData = JSON.parse(storedFilterData);

		  const expirationDate = new Date(filterData.expirationDate);
			const now = new Date();
			if (now <= expirationDate) {
				setSelectedFishingType(filterData.selectedFishingType);
				setselectedSpeciesItem(filterData.selectedSpeciesItem);
				setSelectedHarbor(filterData.SelectedHarbor);
				setSelectedDate(new Date(filterData.SelectedDate));
				setAvailableSeats(filterData.selectedAvailableSeats);
				setCanBooking(filterData.canBooking);
			} else {
				// 데이터가 만료된 경우, 해당 데이터를 삭제하고 null 반환
				localStorage.removeItem("filterData");
				return null;
			}
			
		}
		return null;
	};
	
	  // Load filter data from local storage when the component mounts
	useEffect(() => {
		loadFilterDataFromLocalStorage();
	}, []);
	
	  // Save filter data to local storage whenever the filters change
	useEffect(() => {
		saveFilterDataToLocalStorage();
	}, [
		selectedFishingType,
		selectedSpeciesItem,
		SelectedHarbor,
		SelectedDate,
		selectedAvailableSeats,
		canBooking,
	]);


	const configs = {
		dateFormat: 'yyyy-MM-dd',
		dayNames: '월화수목금토일'.split(''),
		monthNames: '1월 2월 3월 4월 5월 6월 7월 8월 9월 10월 11월 12월'.split(' '),
	};

	const fetchFishingData = async ({ pageParam = 1 }) => {
		const date = DateToStr(SelectedDate);
		const data = await getData<BookingObj>('/api/fishing/list/', {
		  page: pageParam,
		  fishing_type: selectedFishingType,
		  species_item: selectedSpeciesItem,
		  harbor: SelectedHarbor,
		  date,
		  available_seats_number: selectedAvailableSeats,
		  can_booking: canBooking,
		});
		return data;
	};

	// React Query hook for infinite scroll
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery(
		["bookingFishingList", selectedFishingType, selectedSpeciesItem, SelectedHarbor, SelectedDate, selectedAvailableSeats, canBooking],
		fetchFishingData, {
			getNextPageParam: (lastPage, allPages) => {
				const current_page = lastPage?.current_page ?? 1;
				if (lastPage?.last_page !== current_page) return current_page + 1;

				return false;
			},
		}
	);
	

	const bookings = data?.pages.flatMap((page) => page?.booking_objs) || [];

	const queryClient = useQueryClient();

	const handleClearData = () => {
		queryClient.clear();
	};

	const handleFishingTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedFishingType(event.target.value);
		handleClearData();
	};

	const handleSpeciesItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setselectedSpeciesItem(event.target.value);
		handleClearData();
	};

	const handleHarborChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedHarbor(event.target.value);
		handleClearData();
	};

	const handleDateChange = (selectedDate: Date) => {
		setSelectedDate(selectedDate);
		handleClearData();
	};


	const handleAvailableSeatsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setAvailableSeats(event.target.value);
		setCanBooking(true);
		handleClearData();
	};

	const handleCanBookingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		setCanBooking(target.checked);
		setAvailableSeats(target.checked && selectedAvailableSeats === '' ? '1' : '');
		handleClearData();
	};

	const handleResetFilter = () => {
		setselectedSpeciesItem('');
		setSelectedHarbor('');
		setSelectedDate(new Date());
		setAvailableSeats("");
		setCanBooking(true);
		handleClearData();
		window.scrollTo({top: 0});
	};

  
	const handleScroll = useCallback(() => {
	if (hasNextPage && !isFetchingNextPage) {
		// Check if there is more data to fetch and no fetch process is ongoing
		if (
			window.innerHeight + document.documentElement.scrollTop ===
			document.documentElement.offsetHeight
		) {
			fetchNextPage();
		}
	}
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);
	  

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
			{bookings.map((booking, index) => {
				if (booking) {
					return (

						<Link
						onClick={scrollRestoration.setPosition}
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
					)
				}
			})}
			</SimpleGrid>
		</React.Fragment>
	)
}

export default BookingFishingList;