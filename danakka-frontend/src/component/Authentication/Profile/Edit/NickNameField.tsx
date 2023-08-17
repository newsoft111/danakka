import {
	useToast
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ProfileEditFormInputField from './FormInputField';
import {postData} from '../../../../util/Api'
import {updateUserInformation} from '../../../../util/UpdateUserInformation'

interface ProfileEditNickNameFieldProps {
	user_nickname: string; // 이메일은 문자열로 가정합니다. 실제 타입에 맞게 변경해주세요.
}

interface User {
	email: string;
	nickname: string;
	phone_number: string;
  }
  
interface UserData {
	user: User;
}

interface ProfileEditNickNamePostProps {
	status_code: number;
	detail: string;
}

const ProfileEditNickNameField: React.FC<ProfileEditNickNameFieldProps> = ({ user_nickname }) => {
	const toast = useToast();

	const [nickName, setNickname] = useState<string>('');

	useEffect(() => {
		setNickname(user_nickname);
	}, [user_nickname]);

	const handleSave = async () => {
		const headers = {
			'Authorization': localStorage.getItem('accessToken')
		};

		try {

			const data = await postData<ProfileEditNickNamePostProps>('/api/auth/change/nickname/', {
				nickname: nickName,
			}, headers);

			if (data) {
				updateUserInformation("nickname", nickName);
				

				toast({
					title: `닉네임을 변경했습니다.`,
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
		setNickname(e.target.value);
	}

	return (
		<>
			<ProfileEditFormInputField label="닉네임" value={nickName} handleOnClick={handleSave} handleonChange={handleChange}/>
		</>
	);
};

export default ProfileEditNickNameField;
