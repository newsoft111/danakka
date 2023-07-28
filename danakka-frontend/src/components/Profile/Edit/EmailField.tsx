import {
	Button,
	FormControl,
	FormLabel,
	Input,
	FormHelperText
} from "@chakra-ui/react";
import { useState } from "react";
import ProfileEditModal from "./Modal";

interface ProfileEditEmailFieldProps {
	user_email: string; // 이메일은 문자열로 가정합니다. 실제 타입에 맞게 변경해주세요.
}

const ProfileEditEmailField: React.FC<ProfileEditEmailFieldProps> = ({ user_email }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState<string>(user_email);
	const [modalEmail, setModalEmail] = useState<string>(user_email);

	const handleOpenModal = () => {
		setIsOpen(true);
	};

	const handleSave = () => {
		console.log("새로운 이메일:", modalEmail);
		setEmail(modalEmail);
	};

	return (
		<>
			<div>{email}</div>
			<Button onClick={handleOpenModal}>수정</Button>
			{isOpen && (
				<ProfileEditModal field="이메일" onClose={() => setIsOpen(false)} onSave={handleSave}>
				{/* 이메일 필드에서 수정할 내용을 입력하는 폼 요소를 추가합니다. */}
					<FormControl>
						<FormLabel>Email address</FormLabel>
						<Input
							type='email'
							value={modalEmail}
							onChange={(e) => setModalEmail(e.target.value)}
						/>
					</FormControl>
				</ProfileEditModal>
			)}
		</>
	);
};

export default ProfileEditEmailField;
