import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Image,
  Badge,
  SimpleGrid,
  Select,
  Button,
  Checkbox,
  Stack,
} from '@chakra-ui/react';
import { SingleDatepicker } from "chakra-dayzed-datepicker";

const getYesterday = (): Date => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
};
const yesterday: Date = getYesterday();


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
	const [selectedFishingType, setSelectedFishingType] = useState<string>('');
	const [selectedSpeciesItem, setselectedSpeciesItem] = useState<string>('');
	const [SelectedHarbor, setSelectedHarbor] = useState<string>('');
	const [SelectedDate, setSelectedDate] = useState(new Date());


	const configs = {
		dateFormat: 'yyyy-MM-dd',
		dayNames: '월화수목금토일'.split(''),
		monthNames: '1월 2월 3월 4월 5월 6월 7월 8월 9월 10월 11월 12월'.split(' '),
	};
  
	useEffect(() => {
		const fetchData = async () => {
		  setIsLoading(true);
	  
		  try {
			const response = await fetch(`/api/fishing/list/?page=${currentPage}&fishing_type=${selectedFishingType}&species_item=${selectedSpeciesItem}&harbor=${SelectedHarbor}`, {
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
	}, [currentPage, selectedFishingType, selectedSpeciesItem, SelectedHarbor, SelectedDate]);

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
  
	const handleScroll = () => {
		if (
		  window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight &&
		  currentPage < lastPage &&
		  !isLoading
		) {
		  setCurrentPage((prevPage) => prevPage + 1);
		}
	  };
	  
	  useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
		  window.removeEventListener("scroll", handleScroll);
		};
	}, [currentPage, lastPage, isLoading]);
	  
  
	return (
		<React.Fragment>
			<Box mb={4}>
				<Stack direction={['column', 'row']} spacing='14px'>

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
						name="date-input"
						date={SelectedDate}
						onDateChange={handleDateChange}
					/>

					<Select placeholder='인원'>
						<option value='option1'>1명</option>
						<option value='option2'>Option 2</option>
						<option value='option3'>Option 3</option>
					</Select>

					<Checkbox defaultChecked flexShrink={0}>예약가능</Checkbox>
					
					<Button colorScheme='teal' flexShrink={0} size='md'>
						초기화
					</Button>
					
				</Stack >
			</Box>
			<SimpleGrid columns={[2, 3, 4, 5]} spacing={10}>
			{bookings.map((booking, index) => (
				<Box
					maxW='sm'
					borderWidth='1px'
					borderRadius='lg'
					overflow='hidden'
					key={index}
				>
					<Image 
					w="100%"
					src={booking.fishing_month.fishing.thumbnail}
					/>
			
					<Box p='6'>
						<Box display='flex' alignItems='baseline'>
							<Badge borderRadius='full' px='2' colorScheme='teal'>
							New
							</Badge>
							<Box
							color='gray.500'
							fontWeight='semibold'
							letterSpacing='wide'
							fontSize='xs'
							textTransform='uppercase'
							ml='2'
							>
							3 beds &bull; 2 baths
							</Box>
						</Box>
				
						<Box
							mt='1'
							fontWeight='semibold'
							as='h4'
							lineHeight='tight'
						>
							[{booking.fishing_month.fishing.harbor.name}] {booking.fishing_month.fishing.display_business_name}
						</Box>
				
						<Box>
							123123
							<Box as='span' color='gray.600' fontSize='sm'>
							/ wk
							</Box>
						</Box>
				
						
					</Box>
					

				</Box>
				
			))}
			</SimpleGrid>
		</React.Fragment>
	)
}

export default BookingFishingList;