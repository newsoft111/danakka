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
				
				<Button onClick={openLoginModal} mr={3}>돌아가기</Button>
				<Button colorScheme='blue'>완료</Button>
			</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default JoinModal;
