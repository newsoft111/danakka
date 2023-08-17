import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Flex,
	useToast,
	Text
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ProfileEditModal from "./Modal";
import ProfileEditFormInputField from './FormInputField';
import {postData} from '../../../../util/Api'
import {updateUserInformation} from '../../../../util/UpdateUserInformation'


interface ProfileEditEmailFieldProps {
	user_email: string; // 이메일은 문자열로 가정합니다. 실제 타입에 맞게 변경해주세요.
}

interface ProfileEditSendEmailEditProps {
	status_code: number;
	detail: string;
}

interface User {
	email: string;
	nickname: string;
	phone_number: string;
  }
  
interface UserData {
	user: User;
}

const ProfileEditEmailField: React.FC<ProfileEditEmailFieldProps> = ({ user_email }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState<string>(user_email);
	const [modalEmail, setModalEmail] = useState<string>('');
	const [showVerification, setShowVerification] = useState<boolean>(false);
	const [verificationCode, setVerificationCode] = useState<string>();
	const toast = useToast();

	const handleOpenModal = () => {
		setModalEmail('');
		setShowVerification(false)
		setIsOpen(true);
	};


	const headers = {
		'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
	};

	const handleSave = async () => {
		try {
			
			const data = await postData<ProfileEditSendEmailEditProps>('/api/auth/change/email/', {
				email: modalEmail,
				verify_code: verificationCode,
			},
			headers);

			if (data) {
				updateUserInformation('email', modalEmail);

				setEmail(modalEmail);

				toast({
					title: `이메일을 변경했습니다.`,
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
	
	useEffect(() => {
		setEmail(user_email);
	}, [user_email]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setModalEmail(e.target.value);
	}

	const handleRequestVerification = async () => {
		setVerificationCode('');
		try {

			const data = await postData<ProfileEditSendEmailEditProps>('/api/auth/send/email/', {
				email: modalEmail,
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
			<ProfileEditFormInputField label="이메일" value={email} handleOnClick={handleOpenModal} isReadOnly={true}/>
			{isOpen && (
				<ProfileEditModal field="전화번호 변경" onClose={() => setIsOpen(false)} onSave={handleSave}>
				{/* 이메일 필드에서 수정할 내용을 입력하는 폼 요소를 추가합니다. */}
					<FormControl>
						<Flex alignItems={{ base: "flex-start", lg: "center" }} direction={{ base: "column", lg: "row" }}>
							<FormLabel flexShrink="0" m={0} width={{ base: "100%", lg: "100px" }}>이메일</FormLabel>
							<InputGroup size='md' mt={{ base: 2, lg: 0 }}>
							<Input
								value={modalEmail}
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

export default ProfileEditEmailField;
