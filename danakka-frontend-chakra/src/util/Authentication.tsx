import {postData} from '../util/Api'
// 토큰 검증 함수
export async function verifyToken() {
  try {
    const accessToken = localStorage.getItem('accessToken');
	return postData('/api/auth/verify_token/', { token: accessToken });
  } catch (error) {
    // 토큰이 유효하지 않을 경우 에러 처리
    console.log('토큰이 유효하지 않습니다.');
    return null;
  }
}


// 로그아웃 함수
export async function Logout() {
  localStorage.removeItem('accessToken');
  window.location.href = '/';
}