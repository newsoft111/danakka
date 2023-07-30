import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Flex
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ProfileEditModal from "./Modal";
import ProfileEditFormInputField from './FormInputField';

interface ProfileEditEmailFieldProps {
	user_email: string; // 이메일은 문자열로 가정합니다. 실제 타입에 맞게 변경해주세요.
}

const ProfileEditEmailField: React.FC<ProfileEditEmailFieldProps> = ({ user_email }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState<string>('');
	const [modalEmail, setModalEmail] = useState<string>(user_email);

	const handleOpenModal = () => {
		setIsOpen(true);
	};

	const handleSave = () => {
		console.log("새로운 이메일:", modalEmail);
		setEmail(modalEmail);
	};
	
	useEffect(() => {
		setEmail(user_email);
	}, [user_email]);

	return (
		<>
			<ProfileEditFormInputField label="이메일" value={email} handleOnClick={handleOpenModal} isReadOnly={true}/>
		</>
	);
};

export default ProfileEditEmailField;
