"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Image,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
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

	useEffect(() => {
	const fetchData = async () => {
		const data = await getData<FishingData>(`/api/fishing/${id}/`, {});
		if (data) {
		setFishingData(data);
		}
	};

	fetchData();
	}, [id]);

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;

	const months = [];

	for (let i = 0; i < 12; i++) {
	const month = (currentMonth + i) % 12 || 12;
	const year = currentYear + Math.floor((currentMonth + i - 1) / 12);
	const label = `${month}월`;

	months.push({ month, year, label });
	}


    return (
        <Box>
            <Container maxW="container.xl">
                <Flex>
                    <Box w="50%">
                        <Image src="/media/media/images/202304120956/39fb944004eb5909aa3be2d748cdc07d_mini.jpg" alt="싹쓰리호" />
                    </Box>
                    <Box w="50%" pl={4}>
                        <Heading as="h2" size="xl">
                            [{fishingData && fishingData.fishing_objs.harbor.name}] {fishingData && fishingData.fishing_objs.display_business_name}
                        </Heading>
                        <Button colorScheme="blue" w="100%" mb={1} >
                            홈페이지 예약
                        </Button>
                        <Button colorScheme="gray" w="100%" mb={1} >
                            문의하기
                        </Button>
                    </Box>
                </Flex>

                <ButtonGroup spacing={2} my={4}>
                    {months.map((m) => (
                        <Button key={m.month} colorScheme="blue" >
                            {m.label}
                        </Button>
                    ))}
                </ButtonGroup>

                {fishingData && fishingData.booking_objs.map((booking, index) => (
                    <Table variant="simple" mb={4} key={index}>
                        <Thead>
                            <Tr>
                                <Th colSpan={3}>{booking.date}</Th>
                            </Tr>
                            <Tr>
                                <Th>선박명</Th>
                                <Th>예약현황</Th>
                                <Th>남은자리</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td textAlign="center">
                                    {fishingData && fishingData.fishing_objs.display_business_name}
                                    <br />
                                    <Button colorScheme="teal">
                                        예약하기
                                    </Button>
                                </Td>
                                <Td>
                                    대상어종 :<br />
                                    {fishingData && fishingData.fishing_objs.species_item_name}
                                </Td>
                                <Td textAlign="center">{booking.available_seats}명</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                ))}
            </Container>
        </Box>
    );
};

export default BookingFishingDetail;
