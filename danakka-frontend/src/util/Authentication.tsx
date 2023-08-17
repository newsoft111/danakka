import { useContext } from "react";
import {postData, getData} from '../util/Api'


class AuthManager {
	async verifyToken() {
		const headers = {
			'Authorization': localStorage.getItem('accessToken')
		};

		try {
			const data = await postData('/api/auth/verify_token/', {}, headers);
	
			if (data) {
				localStorage.setItem('user', JSON.stringify(data));
				return data;
			} else {
				return null;
			}
		} catch (error) {
			console.log('토큰이 유효하지 않습니다.');
			return null;
		}
	}
	
	
	async getUserInfo<T>(needs_data: string[]) {
		const headers = {
			'Authorization': localStorage.getItem('accessToken')
		};

		try {
			const data = await postData<T>('/api/auth/get/user/info/', { 
				needs_data: needs_data
			},headers);
	
			if (data) {
				return data;
			} else {
				return null;
			}
		} catch (error) {
			console.log('토큰이 유효하지 않습니다.');
			return null;
		}
	}

	logout() {
		localStorage.removeItem('accessToken');
		window.location.href = '/';
	}
}
  
export default new AuthManager();

