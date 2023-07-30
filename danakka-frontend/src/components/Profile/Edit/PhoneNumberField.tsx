import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Flex,
	Text,
	useToast,
	InputGroup,
	InputRightElement,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ProfileEditModal from "./Modal";
import ProfileEditFormInputField from './FormInputField';
import {postData} from '../../../util/Api'

interface ProfileEditSendSmsPostProps {
	status_code: number;
	detail: string;
}

interface ProfileEditPhoneNumberFieldProps {
	user_phone_number: string; // 이메일은 문자열로 가정합니다. 실제 타입에 맞게 변경해주세요.
}

interface User {
	email: string;
	nickname: string;
	phone_number: string;
  }
  
interface UserData {
	user: User;
}

interface ProfileEditPhoneNumberPostProps {
	status_code: number;
	detail: string;
}

const ProfileEditPhoneNumberField: React.FC<ProfileEditPhoneNumberFieldProps> = ({ user_phone_number }) => {
	const toast = useToast();

	const [isOpen, setIsOpen] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState<string>(user_phone_number);
	const [modalPhoneNumber, setModalPhoneNumber] = useState<string>("");
	const [showVerification, setShowVerification] = useState<boolean>(false);
	const [verificationCode, setVerificationCode] = useState<string>();


	const handleOpenModal = () => {
		setIsOpen(true);
	};

	const handleSave = async () => {
		try {
			const token = localStorage.getItem('accessToken');

			const data = await postData<ProfileEditPhoneNumberPostProps>('/api/auth/change/phone_number/', {
				token: token,
				phone_number: modalPhoneNumber,
				verify_code: verificationCode,
			});

			if (data) {
				const savedUser = localStorage.getItem("user");
				if (savedUser) {
					const userData: UserData = JSON.parse(savedUser);

					userData.user.phone_number = modalPhoneNumber;

					localStorage.setItem('user', JSON.stringify(userData));
				}

				setPhoneNumber(modalPhoneNumber);

				toast({
					title: `전화번호를 변경했습니다.`,
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9\b -]{0,13}$/;
		if (regex.test(e.target.value)) {
			setModalPhoneNumber(e.target.value);
		}
	}

	useEffect(() => {
		setPhoneNumber(user_phone_number);
	}, [user_phone_number]);

	//useEffect(() => {
	//	if (modalPhoneNumber.length === 10) {
	//		setModalPhoneNumber(modalPhoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
	//	}
	//	if (modalPhoneNumber.length === 13) {
	//		setModalPhoneNumber(modalPhoneNumber.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
	//	}
	//}, [modalPhoneNumber]);

	const handleRequestVerification = async () => {
		try {

			const data = await postData<ProfileEditSendSmsPostProps>('/api/auth/send/sms/', {
				phone_number: modalPhoneNumber,
			});

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
		setShowVerification(true);
	  };
	
	  const handleVerificationCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9\b -]{0,13}$/;

		if (regex.test(event.target.value)) {
			setVerificationCode(event.target.value);
		}
		
	  };

	return (
		<>
			<ProfileEditFormInputField label="전화번호" value={phoneNumber} handleOnClick={handleOpenModal} isReadOnly={true}/>
				

			{isOpen && (
				<ProfileEditModal field="전화번호 변경" onClose={() => setIsOpen(false)} onSave={handleSave}>
				{/* 이메일 필드에서 수정할 내용을 입력하는 폼 요소를 추가합니다. */}
					<FormControl>
						<Flex alignItems={{ base: "flex-start", lg: "center" }} direction={{ base: "column", lg: "row" }}>
							<FormLabel flexShrink="0" m={0} width={{ base: "100%", lg: "100px" }}>전화번호</FormLabel>
							<InputGroup size='md' mt={{ base: 2, lg: 0 }}>
							<Input
								value={modalPhoneNumber}
								onChange={handleChange}
							/>
							<InputRightElement width='4.5rem'>
							<Button h='1.75rem' size='sm' onClick={handleRequestVerification}><Text>요청</Text></Button>
							</InputRightElement>
							</InputGroup>
						</Flex>

						{showVerification && (
							<Flex alignItems="center" mt={4}>
							<FormLabel flexShrink="0" m={0} width={{ base: "100%", lg: "100px" }}>인증번호</FormLabel>
							<InputGroup size='md' mt={{ base: 2, lg: 0 }}>
								<Input
								value={verificationCode}
								onChange={handleVerificationCodeChange}
								/>
							</InputGroup>
							</Flex>
						)}
					</FormControl>
				</ProfileEditModal>
			)}
		</>
	);
};

export default ProfileEditPhoneNumberField;
