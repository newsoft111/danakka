import {
	Button,
	FormControl,
	FormLabel,
	Input,
	FormHelperText
} from "@chakra-ui/react";
import { useState } from "react";
import ProfileEditModal from "./Modal";

interface ProfileEditNickNameFieldProps {
	user_nickname: string; // 이메일은 문자열로 가정합니다. 실제 타입에 맞게 변경해주세요.
}

const ProfileEditNickNameField: React.FC<ProfileEditNickNameFieldProps> = ({ user_nickname }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [nickName, setNickname] = useState<string>(user_nickname);
	const [modalNickName, setModalNickName] = useState<string>(user_nickname);

	const handleOpenModal = () => {
		setIsOpen(true);
	};

	const handleSave = () => {
		console.log("새로운 이메일:", modalNickName);
		setNickname(modalNickName);
	};

	return (
		<>
			<div>{nickName}</div>
			<Button onClick={handleOpenModal}>수정</Button>
			{isOpen && (
				<ProfileEditModal field="닉네임" onClose={() => setIsOpen(false)} onSave={handleSave}>
				{/* 이메일 필드에서 수정할 내용을 입력하는 폼 요소를 추가합니다. */}
					<FormControl>
						<FormLabel>닉네임</FormLabel>
						<Input
							value={modalNickName}
							onChange={(e) => setModalNickName(e.target.value)}
						/>
					</FormControl>
				</ProfileEditModal>
			)}
		</>
	);
};

export default ProfileEditNickNameField;
