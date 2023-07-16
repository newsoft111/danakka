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
	const [date, setDate] = useState(new Date());
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1); // add this line
	const [bookings, setBookings] = useState<BookingObj[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);


	const configs = {
		dateFormat: 'yyyy-MM-dd',
		dayNames: '월화수목금토일'.split(''),
		monthNames: '1월 2월 3월 4월 5월 6월 7월 8월 9월 10월 11월 12월'.split(' '),
	};
  
	useEffect(() => {
		const fetchData = async () => {
		  setIsLoading(true);
	  
		  try {
			const response = await fetch(`/api/fishing/list/?page=${currentPage}`, {
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
			<Box mb={4}>
				<Stack direction={['column', 'row']} spacing='14px'>

					<Select placeholder='낚시종류'>
						<option value='option1'>Option 1</option>
						<option value='option2'>Option 2</option>
						<option value='option3'>Option 3</option>
					</Select>

					<Select placeholder='어종'>
						<option value='option1'>Option 1</option>
						<option value='option2'>Option 2</option>
						<option value='option3'>Option 3</option>
					</Select>

					<Select placeholder='항구'>
						<option value='option1'>Option 1</option>
						<option value='option2'>Option 2</option>
						<option value='option3'>Option 3</option>
					</Select>
					
					<SingleDatepicker
						configs={configs}
						minDate={yesterday}
						name="date-input"
						date={date}
						onDateChange={setDate}
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
					
				{bookings.length === index + 1 && (
					<div ref={lastBookingRef}></div>
				)}
				</Box>
				
			))}
			</SimpleGrid>
		</React.Fragment>
	)
}

export default BookingFishingList;