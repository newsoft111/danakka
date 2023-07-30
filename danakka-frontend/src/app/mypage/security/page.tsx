"use client"
import { useState, useEffect, useRef } from "react";
import { 
	Divider, 
	Heading, 
	FormControl, 
	FormLabel, 
	Switch, 
	Avatar, 
	Flex,
	InputGroup,
	Input, 
	Text, 
	Card, 
	CardBody,
	AvatarBadge
} from "@chakra-ui/react";


import MyPageNavBar from "../../../components/Layout/MyPage/NavBar";


const MyPageSecurity = () => {
	const [nowPasswd, setNowPasswd] = useState<string>('');
	const [newPasswd, setNewPasswd] = useState<string>('');
	const [newPasswdCheck, setNewPasswdCheck] = useState<string>('');
	
	return (
		<>
			<MyPageNavBar>
				<Card>
					<CardBody>
						<Heading size="md" mb={7}>비밀번호 변경</Heading>
						

						<FormControl mt={5}>
							<Flex alignItems={{ base: "flex-start", lg: "center" }} direction={{ base: "column", lg: "row" }}>
								<FormLabel flexShrink="0" m={0} width={{ base: "100%", lg: "150px" }}>현재 비밀번호</FormLabel>
								<Input
									pr='4.5rem'
								/>
							</Flex>
						</FormControl>

						<FormControl mt={5}>
							<Flex alignItems={{ base: "flex-start", lg: "center" }} direction={{ base: "column", lg: "row" }}>
								<FormLabel flexShrink="0" m={0} width={{ base: "100%", lg: "150px" }}>변경할 비밀번호</FormLabel>
								<Input
									pr='4.5rem'
								/>
							</Flex>
						</FormControl>

						<FormControl mt={5}>
							<Flex alignItems={{ base: "flex-start", lg: "center" }} direction={{ base: "column", lg: "row" }}>
								<FormLabel flexShrink="0" m={0} width={{ base: "100%", lg: "150px" }}>비밀번호 확인</FormLabel>
								<Input
									pr='4.5rem'
								/>
							</Flex>
						</FormControl>
							
					</CardBody>
				</Card>
			</MyPageNavBar>
		</>
	)
}

export default MyPageSecurity;