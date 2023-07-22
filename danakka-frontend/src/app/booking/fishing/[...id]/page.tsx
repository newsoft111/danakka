"use client"
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Text,
  Image,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  Center,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import {getData} from '../../../../util/Api'


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

const BookingFishingDetail = () => {
	const [fishingData, setFishingData] = useState<FishingData>();

	const { id }  = useParams();
	const searchParams = useSearchParams();
	const dateYM = searchParams.get('dateYM');

	const [SelectedDateYM, setDateYM] = useState(dateYM);
	const [DisplayName, setDisplayName] = useState<string>('');


	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;

	const months = [];

	for (let i = 0; i < 12; i++) {
        let month = "" + String((currentMonth + i) % 12 || 12);
        const year = currentYear + Math.floor((currentMonth + i - 1) / 12);
        const label = `${month}월`;

		if (month.length < 2) {
			month = '0' + month;
		}

        months.push({ month, year, label });
	}


    useEffect(() => {
        const fetchData = async () => {
          const data = await getData<FishingData>(`/api/fishing/${id}/?dateYM=${SelectedDateYM}`, {});
          if (data) {
			const displayName = `[${data.fishing_objs.harbor.name}] ${data.fishing_objs.display_business_name}`
			setDisplayName(displayName);
            setFishingData(data);
          } else {
			setFishingData(undefined);
		  }
        };
      
        fetchData();
    }, [SelectedDateYM]);

	const getReservationDateYM = (event: React.MouseEvent<HTMLButtonElement>): void => {
		const value = event.currentTarget.value;
		const current = new URLSearchParams(Array.from(searchParams.entries()));
		current.set('dateYM', value);
		setDateYM(value);
		window.history.replaceState({}, '', `${window.location.pathname}?${current.toString()}`);
	  }
	  
	  



    return (
        <React.Fragment>
		
			<Box>
				<Center>
					<Text align="center" fontSize={["2xl", "3xl", "4xl"]}>
						{DisplayName}
					</Text>
				</Center>

				<Center>
					<ButtonGroup spacing={2} my={4}>
						<Wrap spacing='10px' align='center'>
									
						{months.map((m) => (
							<WrapItem>
							<Button key={m.month} colorScheme="teal" value={`${m.year}${m.month}`} onClick={getReservationDateYM}>
								{m.label}
							</Button>

							</WrapItem>
						))}
						</Wrap>
					</ButtonGroup>
				</Center>
			</Box>

			

			{fishingData && fishingData.booking_objs.map((booking, index) => (
				<Table variant="simple" mb={4} key={index}>
					<Thead>
						<Tr>
							<Th colSpan={3}>
								<Text fontSize='md'>
									{booking.date}
								</Text>
								
							</Th>
						</Tr>
						<Tr>
							<Th textAlign="center">선박명</Th>
							<Th textAlign="center" w={"50%"}>예약현황</Th>
							<Th textAlign="center" w={"20%"}>남은자리</Th>
						</Tr>
					</Thead>
					<Tbody>
						<Tr>
							<Td textAlign="center">
								<Box>
									{fishingData && fishingData.fishing_objs.display_business_name}
								</Box>
								
								<Box>
									<Button colorScheme="teal" size='sm'>
										{booking.available_seats > 0 ? ( "예약하기" ) : ("알림받기")}
									</Button>
								</Box>

							</Td>
							<Td>
								대상어종 :<br />
								{fishingData && fishingData.fishing_objs.species_item_name}
							</Td>
							<Td textAlign="center">
								<Badge colorScheme='green'>
									{booking.available_seats}명
								</Badge>
							</Td>
						</Tr>
					</Tbody>
				</Table>
			))}
		</React.Fragment>
    );
};

export default BookingFishingDetail;
