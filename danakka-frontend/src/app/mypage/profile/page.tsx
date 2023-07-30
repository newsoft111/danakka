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
import { MdModeEditOutline } from 'react-icons/md';

import MyPageNavBar from "../../../components/Layout/MyPage/NavBar";
import ProfileEditEmailField from "../../../components/Profile/Edit/EmailField"
import ProfileEditNickNameField from "../../../components/Profile/Edit/NickNameField"
import ProfileEditPhoneNumberField from "../../../components/Profile/Edit/PhoneNumberField"



const MyPageMyprofile = () => {
	const [email, setEmail] = useState<string>('');
	const [nickname, setNickname] = useState<string>('');
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const savedUser = localStorage.getItem("user");

		if (savedUser) {
			const user = JSON.parse(savedUser).user;
			console.log(nickname)
			setEmail(user.email);
			setNickname(user.nickname);
			setPhoneNumber(user.phone_number);
		}
	}, []);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		console.log(file)
	};
	
	const handleButtonClick = () => {
		if (inputRef.current) {
		  inputRef.current.click();
		}
	};
	
	return (
		<>
			<MyPageNavBar>
				<Card>
					<CardBody>
						<Heading size="md" mb={7}>기본정보</Heading>
						<FormControl role="group">
							<Flex alignItems={{ base: "flex-start", lg: "center" }} direction={{ base: "column", lg: "row" }}>
							<FormLabel flexShrink="0" m={0} width={{ base: "100%", lg: "150px" }}>프로필</FormLabel>
								<InputGroup>									
									<Avatar
										size={'xl'} 
										src={
											'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
										}  
									>
										<AvatarBadge cursor="pointer" borderWidth="3px" p={1} boxSize='0.75em' bg="teal" color="white">
											<MdModeEditOutline onClick={handleButtonClick} />
										</AvatarBadge>
									</Avatar>
								
									<Input
										type="file"
										accept=".png, .jpg, .jpeg, .gif"
										ref={inputRef}
										display="none"
										onChange={handleFileChange}
									/>

								</InputGroup>
							</Flex>
						</FormControl>

						<ProfileEditEmailField user_email={email}/>
						<ProfileEditNickNameField user_nickname={nickname} />
						<ProfileEditPhoneNumberField user_phone_number={phoneNumber}/>
						<Divider my={5}/>

						<Heading size="md" mb={7}>프로모션 정보수신 동의</Heading>
						<FormControl display='flex' alignItems='center' justifyContent="space-between">
							<FormLabel mb='0'>
								휴대전화
							</FormLabel>
							<Switch />
						</FormControl>

						<FormControl display='flex' alignItems='center' justifyContent="space-between" mt={5}>
							<FormLabel mb='0'>
								이메일
							</FormLabel>
							<Switch />
						</FormControl>
							
					</CardBody>
				</Card>
			</MyPageNavBar>
		</>
	)
}

export default MyPageMyprofile;