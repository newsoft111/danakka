import {
	Button,
	FormControl,
	FormLabel,
	Input,
	FormHelperText
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ProfileEditModal from "./Modal";

interface ProfileEditPhoneNumberFieldProps {
	user_phone_number: string; // 이메일은 문자열로 가정합니다. 실제 타입에 맞게 변경해주세요.
}

const ProfileEditPhoneNumberField: React.FC<ProfileEditPhoneNumberFieldProps> = ({ user_phone_number }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState<string>(user_phone_number);
	const [modalPhoneNumber, setModalPhoneNumber] = useState<string>(user_phone_number);

	const handleOpenModal = () => {
		setIsOpen(true);
	};

	const handleSave = () => {
		console.log("새로운 이메일:", modalPhoneNumber);
		setPhoneNumber(modalPhoneNumber);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9\b -]{0,13}$/;
		if (regex.test(e.target.value)) {
			setModalPhoneNumber(e.target.value);
		}
	}

	useEffect(() => {
		if (modalPhoneNumber.length === 10) {
			setModalPhoneNumber(modalPhoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
		}
		if (modalPhoneNumber.length === 13) {
			setModalPhoneNumber(modalPhoneNumber.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
		}
	}, [modalPhoneNumber]);

	return (
		<>
			<div>{phoneNumber}</div>
			<Button onClick={handleOpenModal}>수정</Button>
			{isOpen && (
				<ProfileEditModal field="닉네임 수정" onClose={() => setIsOpen(false)} onSave={handleSave}>
				{/* 이메일 필드에서 수정할 내용을 입력하는 폼 요소를 추가합니다. */}
					<FormControl>
						<FormLabel>닉네임</FormLabel>
						<Input
							value={modalPhoneNumber}
							onChange={handleChange}
						/>
					</FormControl>
				</ProfileEditModal>
			)}
		</>
	);
};

export default ProfileEditPhoneNumberField;
