import {createApp, ref} from "vue";
import { useMapStore } from "@/stores/map.store.ts"
import {loadKakaoMap} from "@/utils/loadKakaoMap.ts";
import type {Coords} from "@/types/places.ts";
import { DEFAULT_POSITION } from "@/contants/map.ts";
import type {Place} from "../types/places.ts";

import MapMarker from "../components/map/MapMarker.vue";


const bounds = ref<kakao.maps.LatLngBounds | null>(null);
const map = ref<any>(null);
const maps = ref<any>(null);
const markers = ref<any>([]);




export function useKakaoMap(){
    const mapStore = useMapStore();



    async function createMap(container:HTMLElement, center: { lat: number, lng: number }, level:number) {
        try {
            const kakao = await loadKakaoMap();
            maps.value = kakao.maps;
            map.value = new kakao.maps.Map(container, {
                center: new kakao.maps.LatLng(center.lat, center.lng),
                level: level,
            });

            return map.value;
        } catch (err) {
            console.error('지도 생성 실패:', err);
            return null;
        }
    }

    function moveMap(mapInstance:any,coords: { lat: number, lng: number }){
        const position = new window.kakao.maps.LatLng(coords.lat, coords.lng);

        mapInstance.panTo(position);
    }

    async function createUserMarker(coords: { lat: number, lng: number }){

        return new maps.value.CustomOverlay({
            position: new maps.value.LatLng(coords.lat, coords.lng),
            map: map.value,
            clickable: true,
            content: makeMarkerEl('yami',null),
            yAnchor:1,
            zIndex: 5
        });
    }


    function createPlacesMarker(places:Map<string,Place>){
        if (!maps) {
            console.error('마커 생성 실패: 지도 인스턴스가 없습니다.');
            return [];
        }

        const kakaoMaps = window.kakao.maps; // window.kakao에서 직접 가져옵니다.

        for(const [key,value] of places){
            const overlay = new maps.value.CustomOverlay({
                position: new maps.value.LatLng(value.y, value.x),
                map: map.value,
                clickable: true,
                content: makeMarkerEl('place',key),
                yAnchor:1,
                zIndex: 5
            });

            markers.value.push(overlay)

            overlay.setMap(map.value);
        }
        console.log(`${markers.length}개의 마커 생성 완료`);
        return markers; // 생성된 마커 배열을 반환합니다.
    }


    function makeMarkerEl(type: string, placeId: String) {
        const markerEl = document.createElement("div");
        markerEl.setAttribute("data-title", name);

        const comp = createApp(MapMarker,{
            type: type,
            placeId: placeId
        });
        comp.mount(markerEl);

        return markerEl.firstChild as HTMLElement;
    }

    async function getUserPosition() {
        return await new Promise<Coords>((resolve) => {
            if (!('geolocation' in navigator)) {
                return resolve(fallback);
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => resolve(DEFAULT_POSITION),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    }

    function clearMarkers() {
        markers.value.forEach(m => m.setMap(null));
        markers.value.length = 0;
    }

    function transKakaoLatLng(lat?: number, lng?: number) {
        const c = lat != null && lng != null ? { lat, lng } : (currentPosition ?? DEFAULT_POSITION);
        return new maps.value.LatLng(c.lat, c.lng);
    }



    return { map, maps, createMap,moveMap,createPlacesMarker,createUserMarker, bounds }
}
