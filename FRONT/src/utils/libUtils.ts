export function debounce(func,delay) {
    let timeoutId = null; // setTimeout의 ID를 저장할 변수

    // 디바운스가 적용된 새로운 함수를 반환
    return (...args) => {
        // 기존에 설정된 timeout이 있다면 취소 (새로운 이벤트가 발생했으므로)
        clearTimeout(timeoutId);

        // delay 이후에 func 함수를 실행하도록 새로운 timeout 설정
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}