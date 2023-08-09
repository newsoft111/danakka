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
} from "@chakra-ui/react";

import MyPageNavBar from "../../../../component/Layout/Auth/MyPage/NavBar";
import * as PortOne from '@portone/browser-sdk/v2';

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

	const handleInputChange = (valueAsString: string, valueAsNumber: number) => {

		if (valueAsNumber) {
			setCount(valueAsNumber);
		}
	};

	type PayMethod = 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER' | 'MOBILE' | 'GIFT_CERTIFICATE' | 'EASY_PAY' | 'PAYPAL';


	const requestPayment = () => {
		let channelKey = "channel-key-87675bb2-53ab-4654-a7a6-4aa4a3c60ae4";
		let payMethod: PayMethod = 'CARD';


		if (paymentMethod === "card") {
			channelKey = "channel-key-87675bb2-53ab-4654-a7a6-4aa4a3c60ae4";
			payMethod = "CARD";
		} else if (paymentMethod === "kakao") {
			channelKey = "channel-key-5bcf4605-5a92-4e14-a029-6582e63bc5ab";
			payMethod = "EASY_PAY";
		}

		PortOne.requestPayment({
			storeId: 'store-0d0fe347-57a0-4059-bbac-4dadd79b9739', // 가맹점 storeId로 변경해주세요.
			paymentId: 'paymentId_{now()}',
			orderName: '나이키 와플 트레이너 2 SD',
			totalAmount: 1000,
			currency: 'CURRENCY_KRW',
			channelKey: channelKey,
    		payMethod: payMethod,
			pgProvider: 'PG_PROVIDER_TOSSPAYMENTS'
		});
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