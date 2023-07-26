"use client"
import {
	Card,
	CardHeader,
	Heading,
	CardBody, 
	Box,
	Stack,
	StackDivider,
	Text,
} from '@chakra-ui/react';
import MyPageNavBar from "../../../components/Layout/MyPage/NavBar"
import Alert from '../../../components/Common/Alert'

const MyPageMyprofile = () => {
	return (
		<MyPageNavBar>			
			<Card>
				<CardBody>
				<Alert status='success' description='로그인 성공!' />
					ㅁㄴㅇㄹ
				</CardBody>
			</Card>
		</MyPageNavBar>
	)
}

export default MyPageMyprofile;