
export function loadKakaoMap() {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return reject(new Error('SSR 환경'));

        if(window.kakao?.maps) return resolve(window.kakao);

        const existing = document.getElementById('kakao-map-sdk') as HTMLScriptElement | null;
        if (existing) {
            existing.addEventListener('load', () => {
                if (!window.kakao?.maps) return reject(new Error('kakao.maps 없음'));
                window.kakao.maps.load(() => resolve(window.kakao)); // ✅ 여기!
            });
            existing.addEventListener('error', (e) => reject(e as any));
            return;
        }

        const script = document.createElement('script');
        script.id = 'kakao-map-sdk'
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js' +
            '?appkey=63f219cef9a1573ff0ef1fc2b19a1d45' +           // ← JavaScript 키
            '&libraries=services,clusterer' +         // 필요시 drawing 추가
            '&autoload=false';
        script.async = true;
        script.defer = true;

        console.log('SDK SRC =', script.src);
        script.onload = () => {
            if (!window.kakao?.maps) return reject(new Error('kakao.maps 없음'));
            window.kakao.maps.load(() => resolve(window.kakao));
        }
        script.onerror = (err) => { reject(err); }
        document.head.appendChild(script);
    })
}