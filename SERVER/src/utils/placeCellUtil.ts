interface LatLng {
    lat: number;
    lng: number;
}

interface Cell {
    sw: LatLng;
    ne: LatLng;
}

/**
 * Haversine 공식을 사용해 두 지점 간의 거리를 미터(m) 단위로 계산합니다.
 * @param a - 시작점 { lat, lng }
 * @param b - 끝점 { lat, lng }
 * @returns 두 지점 사이의 거리 (미터)
 */
export function haversine(a: LatLng, b: LatLng): number {
    const R = 6371000; // 지구의 반경 (미터)
    const toRad = (d: number) => (d * Math.PI) / 180;

    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);

    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * Cell(사각형 영역)의 중심점과 그 중심점에서 꼭짓점까지의 반경을 계산합니다.
 * @param cell - { sw, ne } 좌표를 가진 셀 객체
 * @returns { center: LatLng, radius: number }
 */
export function getCenterAndRadius(cell: Cell): { center: LatLng; radius: number } {
    const center: LatLng = {
        lat: (cell.sw.lat + cell.ne.lat) / 2,
        lng: (cell.sw.lng + cell.ne.lng) / 2,
    };

    // 중심점에서 북동쪽(ne) 꼭짓점까지의 거리를 반경으로 사용
    const radius = haversine(center, cell.ne);

    return { center, radius };
}