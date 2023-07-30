import React, { useState } from 'react';
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
	useToast,
} from '@chakra-ui/react';
import {postData} from '../../util/Api'

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  openJoinModal: () => void;
  onLoginSuccess: () => void; // 로그인 성공시 호출되는 핸들러 타입 추가
}

interface Login {
	access_token: string;
  }

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  openJoinModal,
  onLoginSuccess, // onLoginSuccess 핸들러 추가
}) => {
	const toast = useToast();
	const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () => {
		try {
			const data = await postData<Login>('/api/auth/login/', {
				email_or_phone_number: emailOrPhoneNumber,
				password: password,
			});

			if (data) {
				const accessToken = data.access_token;
				localStorage.setItem('accessToken', accessToken);

				onLoginSuccess(); // 로그인 성공시 onLoginSuccess 핸들러 호출

				toast({
					title: `로그인 성공!`,
					position: 'top',
					status: 'success',
					isClosable: true,
				})

				onClose();
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
			<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>로그인</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
				<FormControl>
					<FormLabel>이메일/전화번호</FormLabel>
					<Input
					placeholder="이메일/전화번호"
					value={emailOrPhoneNumber}
					onChange={(e) => setEmailOrPhoneNumber(e.target.value)}
					/>
				</FormControl>

				<FormControl mt={4}>
					<FormLabel>비밀번호</FormLabel>
					<Input
					type="password"
					placeholder="비밀번호"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					/>
				</FormControl>
				</ModalBody>

				<ModalFooter>
				<Button onClick={openJoinModal} mr={3}>
					회원가입
				</Button>
				<Button colorScheme="blue" onClick={handleLogin}>
					완료
				</Button>
				</ModalFooter>
			</ModalContent>
			</Modal>
		</>
  	);
};

export default LoginModal;
