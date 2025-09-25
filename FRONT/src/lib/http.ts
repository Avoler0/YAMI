import axios from 'axios';

// 1. axios 인스턴스 생성
const http = axios.create({
    // 기본 URL 설정
    baseURL: import.meta.env.VITE_API_BASE ?? "/v1",

    // 기본 타임아웃 설정 (10초)
    timeout: 10000,

    // 기본 헤더 설정
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. (선택) 요청/응답 인터셉터 추가
//    모든 요청 전에 특정 작업을 하거나(예: 인증 토큰 추가),
//    모든 응답을 받은 후 특정 작업을 할 때 유용합니다.
http.interceptors.request.use(config => {
    console.log('API 요청 보냄:', config);
    return config;
});

export default http;