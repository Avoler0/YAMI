import { ref } from 'vue';

type Coords = { lat:number; lng: number; }

let mapInstance = null;
let mapsLib = null;
let marker: any = null;
let isDefault = false;
export const position = ref<Coords | null>(null);
export const DEFAULT_POSITION: Coords = { lat: 37.5665, lng: 126.9780 }; // 기본 값: 서울 시청

function ensureBound() {
    if (!mapInstance || !mapsLib) {
        throw new Error("GeoPosition is not bound to a map. Call bind(map, maps) first.");
    }
}

export function useGeoPosition(){

    function bind(map:any, maps:any){
        mapInstance = map;
        mapsLib = maps;
    }

    async function setFromGeo(fallback: Coords = DEFAULT_POSITION) {
        ensureBound();
        const coords = await new Promise<Coords>((resolve) => {
            if (!('geolocation' in navigator)) {
                return resolve(fallback);
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => resolve(fallback),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });

        // set을 재사용해서 지도/마커 동시 처리
        set(coords.lat, coords.lng, { move: true, smooth: true });
        return position.value!;
    }

    function set(lat: number, lng: number, opts: { move?: boolean, smooth?:boolean } = {}){
        ensureBound();
        position.value = { lat, lng };
        if (opts?.move) {
            const ll = transKakaoLatLng(lat, lng);
            (opts.smooth ?? true) ? mapInstance.panTo(ll) : mapInstance.setCenter(ll);
        }

        if (!marker) { // 이후에 useKakaoMap으로 마커 이동 함수 분할
            marker = new mapsLib.Marker({ position: transKakaoLatLng(), map: mapInstance });
        } else {
            marker.setPosition(transKakaoLatLng());
            if (!marker.getMap()) marker.setMap(mapInstance);
        }
    }

    function transKakaoLatLng(lat?: number, lng?: number) {
        const c = lat != null && lng != null ? { lat, lng } : (position.value ?? DEFAULT_POSITION);
        return new mapsLib.LatLng(c.lat, c.lng);
    }

    return { bind, set, transKakaoLatLng, setFromGeo };

}