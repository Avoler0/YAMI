
export type Bounds = {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
}

export type Cell = {
    id: string;
    bounds: Bounds;
}

const METERS_PER_DEG_LAT = 111320;

export function metersToDegLat(meter: number): number {
    return meter / METERS_PER_DEG_LAT;
}

export function metetsToDegLng(meter: number, atLatDeg:number): number {
    const rad = (atLatDeg * Math.PI) / 180;
    const metetsPerDegLng = ME
}

export function cellFromBounds(bounds: Bounds, stepMeters = 300): Cell[] {
    const cells:Cell[] = [];

    const dLat = stepMeters / METERS_PER_DEG_LAT;

    const centerLat = (bounds.sw.lat + bounds.sw.lng) / 2;
    const dLng = stepMeters / ( METERS_PER_DEG_LAT * Math.cos((centerLat * Math.PI) / 180));

    const startIx = Math.floor(bounds.sw)
}

export function boundsFromKakao(bounds): Bounds {

    return {
        sw: { lat: bounds.qa, lng: bounds.ha },
        ne: { lat: bounds.pa, lng: bounds.oa },
    }
}