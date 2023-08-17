"use client"
import { useState } from "react";
import { 
	Divider, 
	Heading, 
	Text, 
	Flex,
	NumberInput,
	NumberInputField ,
	NumberInputStepper,
	NumberIncrementStepper ,
	NumberDecrementStepper ,
	Box, 
	Card, 
	CardBody,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	RadioGroup,
	Stack,
	Radio,
	useToast
} from "@chakra-ui/react";
import {postData} from '../../../../util/Api';
import MyPageNavBar from "../../../../component/Layout/Auth/MyPage/NavBar";
import requestPortOnePayment from '../../../../component/Payment/PortOne';

const MyPageTicket = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};


	const [count, setCount] = useState(1);
	const [paymentMethod, setPaymentMethod] = useState("card");
	const [orderName, setOrderName] = useState(`티켓 ${count}개`);
	const [totalAmount, setTotalAmount] = useState<number>(count*100);
	const token = localStorage.getItem('accessToken');
	const toast = useToast();
	const handleInputChange = (valueAsString: string, valueAsNumber: number) => {

		if (valueAsNumber) {
			setCount(valueAsNumber);
			setOrderName(`티켓 ${valueAsNumber}개`);
			setTotalAmount(valueAsNumber*100);
		}
	};

	const { v4: uuidv4 } = require('uuid');  // uuid 라이브러리 사용

	type PayMethod =
	| 'CARD'
	| 'VIRTUAL_ACCOUNT'
	| 'TRANSFER'
	| 'MOBILE'
	| 'GIFT_CERTIFICATE'
	| 'EASY_PAY'
	| 'PAYPAL';

	const requestPayment = async () => {
		const paymentId = uuidv4();  // 새로운 UUID 생성
		let channelKey = "channel-key-87675bb2-53ab-4654-a7a6-4aa4a3c60ae4";
		let payMethod = 'CARD';

		const headers = {
			'Authorization': localStorage.getItem('accessToken')
		};

		if (paymentMethod === "card") {
			channelKey = "channel-key-87675bb2-53ab-4654-a7a6-4aa4a3c60ae4";
			payMethod = "CARD";
		} else if (paymentMethod === "kakao") {
			channelKey = "channel-key-5bcf4605-5a92-4e14-a029-6582e63bc5ab";
			payMethod = "EASY_PAY";
		}
		
		try {
			const data = await postData('/api/payment/create/', {
				merchant_uid: paymentId,
				order_name: orderName,
				total_amount: totalAmount,
				pay_method: payMethod
			}, headers);
			
			if (data) {
				const result = await requestPortOnePayment(
					paymentId,
					orderName,
					totalAmount,
					channelKey,
					payMethod as PayMethod
				);
			} else {
				toast({
					title: '알수없는 오류입니다. 관리자에게 문의해주세요.',
					position: 'top',
					status: 'success',
					isClosable: true,
				})
	
				return;
			}
	
		} catch (error) {
			throw error;
		}
	}
	

	return (
		<>
			<MyPageNavBar>
				<Card>
					<CardBody>
						<Heading size="md" mb={7}>보유중인 티켓</Heading>
						<Flex alignItems="center" justifyContent="space-between">
							<Text>
								보유중인 티켓
							</Text>
							<Flex flexShrink="0" alignItems="center">
								<Box>100개</Box>
								<Box ml={5}>
									<Button colorScheme="teal" size="sm" onClick={handleOpenModal}>
										충전
									</Button>
								</Box>
							</Flex>
						</Flex>

						<Divider my={5}/>

						

						<Heading size="md" mb={7}>티켓 내역</Heading>
							
					</CardBody>
				</Card>
			</MyPageNavBar>


			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>다낚아 티켓충전</ModalHeader>
					<ModalCloseButton />
					<ModalBody>

						<Flex alignItems="center">
							<Text mr={3} minW="100px">개수</Text>

							<NumberInput defaultValue={count} min={1} onChange={handleInputChange}>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</Flex>

						<Flex alignItems="center" mt={5}>
							<Text mr={3} minW="100px">금액</Text>

							<Box>
								<Text>티켓 {count}개 / {count*100} 원</Text>
							</Box>
						</Flex>

						<Flex alignItems="center" mt={5}>
							<Text mr={3} minW="100px">결제수단</Text>
							
							<RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
								<Stack direction='row'>
									<Radio colorScheme='teal' value='card'>카드결제</Radio>
									<Radio colorScheme='teal' value='kakao'>카카오페이</Radio>
								</Stack>
							</RadioGroup>
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button mr={3} onClick={handleCloseModal}>
							닫기
						</Button>
						<Button
							colorScheme='teal'
							onClick={requestPayment}
						>
							결제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
				
		</>
	)
}

export default MyPageTicket;