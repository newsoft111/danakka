"use client"
import { useState } from "react";
import { 
	Button, 
	Input, 
	Modal, 
	ModalBody, 
	ModalCloseButton, 
	ModalContent, 
	ModalHeader,
	ModalOverlay,
	Stack, 
	Text, 
	Card, 
	CardBody 
} from "@chakra-ui/react";

import MyPageNavBar from "../../../components/Layout/MyPage/NavBar";
import ProfileEditEmailField from "../../../components/Profile/Edit/EmailField"
import ProfileEditNickNameField from "../../../components/Profile/Edit/NickNameField"
import ProfileEditPhoneNumberField from "../../../components/Profile/Edit/PhoneNumberField"



const MyPageMyprofile = () => {
	const email = "user@example.com";
	const nickname = "사용자";
	const phoneNumber = "010-1234-5678";
	
	return (
		<>
			<MyPageNavBar>			
				<Card>
					<CardBody>
							<ProfileEditEmailField user_email={email}/>
							<ProfileEditNickNameField user_nickname={nickname} />
							<ProfileEditPhoneNumberField user_phone_number={phoneNumber}/>
					</CardBody>
				</Card>
			</MyPageNavBar>
		</>
	)
}

export default MyPageMyprofile;