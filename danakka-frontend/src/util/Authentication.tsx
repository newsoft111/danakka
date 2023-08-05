import { useContext } from "react";
import {postData} from '../util/Api'


class AuthManager {
	async verifyToken() {
	  try {
		const accessToken = localStorage.getItem('accessToken');
		const data = await postData('/api/auth/verify_token/', { token: accessToken });
  
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
	  try {
		const accessToken = localStorage.getItem('accessToken');
		const data = await postData<T>('/api/auth/get/user/info/', { 
			token: accessToken,
			needs_data: needs_data
		});
  
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

