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


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  openJoinModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, openJoinModal }) => {
	const initialRef = React.useRef(null)

	return (
		<Modal
			initialFocusRef={initialRef}
			isOpen={isOpen}
			onClose={onClose}
			
		>
		<ModalOverlay />
			<ModalContent>
			<ModalHeader>로그인</ModalHeader>
			<ModalCloseButton />
			<ModalBody pb={6}>
				<FormControl>
				<FormLabel>이메일/전화번호</FormLabel>
				<Input ref={initialRef} placeholder='이메일/전화번호' />
				</FormControl>

				<FormControl mt={4}>
				<FormLabel>비밀번호</FormLabel>
				<Input placeholder='비밀번호' />
				</FormControl>
			</ModalBody>

			<ModalFooter>
				<Button onClick={openJoinModal} mr={3}>회원가입</Button>
				<Button colorScheme='blue'>완료</Button>
			</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default LoginModal;
