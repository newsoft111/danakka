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
import JoinModal from '../Authentication/JoinModal';

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
			<ModalHeader>Create your account</ModalHeader>
			<ModalCloseButton />
			<ModalBody pb={6}>
				<FormControl>
				<FormLabel>First name</FormLabel>
				<Input ref={initialRef} placeholder='First name' />
				</FormControl>

				<FormControl mt={4}>
				<FormLabel>Last name</FormLabel>
				<Input placeholder='Last name' />
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
