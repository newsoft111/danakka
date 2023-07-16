import React from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl,
	FormLabel,
	Input,
	Button,
} from '@chakra-ui/react';


interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  openLoginModal: () => void;
}

const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, openLoginModal }) => {
	const initialRef = React.useRef(null)

	return (
		<Modal
			initialFocusRef={initialRef}
			isOpen={isOpen}
			onClose={onClose}
			
		>
		<ModalOverlay />
			<ModalContent>
			<ModalHeader>회원가입</ModalHeader>
			<ModalCloseButton />
			<ModalBody pb={6}>
				<FormControl>
				<FormLabel>이메일</FormLabel>
				<Input ref={initialRef} placeholder='이메일' />
				</FormControl>

				<FormControl mt={4}>
				<FormLabel>전화번호</FormLabel>
				<Input ref={initialRef} placeholder='전화번호' />
				</FormControl>

				<FormControl mt={4}>
				<FormLabel>비밀번호</FormLabel>
				<Input placeholder='비밀번호' />
				</FormControl>

				<FormControl mt={4}>
				<FormLabel>비밀번호 확인</FormLabel>
				<Input placeholder='비밀번호 확인' />
				</FormControl>
			</ModalBody>

			<ModalFooter>
				
				<Button onClick={openLoginModal} mr={3}>돌아가기</Button>
				<Button colorScheme='blue'>완료</Button>
			</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default JoinModal;
