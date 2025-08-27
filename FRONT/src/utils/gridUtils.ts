export type GridCell = {
    idxX: number;
    idxY: number;
    // 남서(SW), 북동(NE)
    sw: LatLng;
    ne: LatLng;
    // 픽셀 경계(디버깅/인덱싱용)
    px: { x0: number; y0: number; x1: number; y1: number };
};

export function getMetersPerPixel(map:kakao.maps.map){
    const proj = map.getProjection();
    const center = map.getCenter();
    const pt = proj.containerPointFromCoords(center);

    const right = proj.coordsFromContainerPoint(new kakao.maps.Point(pt.x + 100, pt.y));
    const down  = proj.coordsFromContainerPoint(new kakao.maps.Point(pt.x, pt.y + 100));

    const llC: LatLng = { lat: center.getLat(), lng: center.getLng() };
    const mppX = haversine(llC, { lat: right.getLat(), lng: right.getLng() }) / 100;
    const mppY = haversine(llC, { lat: down.getLat(),  lng: down.getLng()  }) / 100;

    return { mppX, mppY };
}

function makeGridCells(map: kakao.maps.map, cellSizeMeters = 200):GridCell[] {
    const proj = map.getProjection();
    const { mppX, mppY } = getMetersPerPixel(map);

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const ptSw = proj.containerPointFromCoords(sw);
    const ptNe = proj.containerPointFromCoords(ne);

    const minX = Math.min(ptSw.x, ptNe.x);
    const maxX = Math.max(ptSw.x, ptNe.x);
    const minY = Math.min(ptSw.y, ptNe.y);
    const maxY = Math.max(ptSw.y, ptNe.y);

    const cellPxX = cellSizeMeters / mppX;
    const cellPxY = cellSizeMeters / mppY;

    const cols = Math.max(1, Math.floor((maxX - minX) / cellPxX));
    const rows = Math.max(1, Math.floor((maxY - minY) / cellPxY));

    const cells: GridCell[] = [];

    for (let iy = 0; iy < rows; iy++) {
        for (let ix = 0; ix < cols; ix++) {
            const x0 = minX + ix * cellPxX;
            const y0 = minY + iy * cellPxY;
            const x1 = Math.min(x0 + cellPxX, maxX);
            const y1 = Math.min(y0 + cellPxY, maxY);

            // 픽셀 → LatLng
            const lt = proj.coordsFromContainerPoint(new kakao.maps.Point(x0, y0)); // 좌상
            const rb = proj.coordsFromContainerPoint(new kakao.maps.Point(x1, y1)); // 우하

            // SW/NE로 정규화
            const cellSW: LatLng = { lat: rb.getLat(), lng: lt.getLng() };
            const cellNE: LatLng = { lat: lt.getLat(), lng: rb.getLng() };

            cells.push({
                idxX: ix,
                idxY: iy,
                sw: cellSW,
                ne: cellNE,
                px: { x0, y0, x1, y1 },
            });
        }
    }

    return cells;
}

export function haversine(a,b){
    const R = 6371000;
    const toRad = d => (d * Math.PI) / 180;

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