import axios from 'axios';

// 토큰 검증 함수
export async function verifyToken() {
  try {
    const accessToken = localStorage.getItem('accessToken');

    // 토큰을 서버에 전달하여 검증 요청
    const response = await axios.post('/api/auth/verify_token/', { token: accessToken });

    // 검증 결과에 따라 사용자 정보 반환 또는 에러 처리
    return response.data.user;
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