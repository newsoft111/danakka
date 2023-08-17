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
	useToast, 
	Card, 
	CardBody,
	Button
} from "@chakra-ui/react";
import {postData} from '../../../../util/Api'

import MyPageNavBar from "../../../../component/Layout/Auth/MyPage/NavBar";

interface ChangePasswordProps {
	status_code: number;
	detail: string;
}

const MyPageSecurity = () => {
	const [currentPassword, setCurrentPassword] = useState<string>('');
	const [newPasswd, setNewPasswd] = useState<string>('');
	const [newPasswdCheck, setNewPasswdCheck] = useState<string>('');
	const toast = useToast();

	const handleSave = async () => {
		const headers = {
			'Authorization': localStorage.getItem('accessToken')
		};

		try {

			const data = await postData<ChangePasswordProps>('/api/auth/change/password/', {
				current_password: currentPassword,
				new_password: newPasswd,
				new_password_check: newPasswdCheck
			}, headers);

			if (data) {
				toast({
					title: data.detail,
					position: 'top',
					status: 'success',
					isClosable: true,
				})
			} else {
				toast({
					title: "알수없는 오류입니다. 관리자에게 문의해주세요.",
					position: 'top',
					status: 'error',
					isClosable: true,
				})
			}
		
		} catch (error: any) {
			const data = error.response.data;
			toast({
				title: data.detail,
				position: 'top',
				status: 'error',
				isClosable: true,
			})
		}

		
	};
	
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
									type="password"
									pr='4.5rem'
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
								/>
							</Flex>
						</FormControl>

						<FormControl mt={5}>
							<Flex alignItems={{ base: "flex-start", lg: "center" }} direction={{ base: "column", lg: "row" }}>
								<FormLabel flexShrink="0" m={0} width={{ base: "100%", lg: "150px" }}>변경할 비밀번호</FormLabel>
								<Input
									type="password"
									pr='4.5rem'
									value={newPasswd}
									onChange={(e) => setNewPasswd(e.target.value)}
								/>
							</Flex>
						</FormControl>

						<FormControl mt={5}>
							<Flex alignItems={{ base: "flex-start", lg: "center" }} direction={{ base: "column", lg: "row" }}>
								<FormLabel flexShrink="0" m={0} width={{ base: "100%", lg: "150px" }}>비밀번호 확인</FormLabel>
								<Input
									type="password"
									pr='4.5rem'
									value={newPasswdCheck}
									onChange={(e) => setNewPasswdCheck(e.target.value)}
								/>
							</Flex>
						</FormControl>

						<Flex justifyContent="flex-end" mt={5}>
							<Button colorScheme='teal' onClick={handleSave}>변경하기</Button>
						</Flex>
							
					</CardBody>
				</Card>
			</MyPageNavBar>
		</>
	)
}

export default MyPageSecurity;