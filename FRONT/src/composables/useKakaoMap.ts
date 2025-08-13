import {createApp, ref} from "vue";
import { useLoadingStore } from "@/stores/loading"
import {loadKakaoMap} from "@/utils/loadKakaoMap.ts";
import type {Coords} from "@/types/places.ts";
import { DEFAULT_POSITION } from "@/contants/map.ts";
import type {Place} from "../types/places.ts";

import MapMarker from "../components/map/MapMarker.vue";

let imgMe: any, imgPlace: any, imgPlaceSelected: any;
const position = ref<Coords | null> (null);
const map = ref<any>(null);
const maps = ref<any>(null);
let centerMarker = null;
const markers = [];


export function useKakaoMap(){

    async function init(containerEl: HTMLElement, opts?: { level?: number; defaultCenter?: {lat:number; lng:number} })  {
        const kakao = await loadKakaoMap();

        maps.value = kakao.maps;

        const level = opts?.level ?? 3;
        const dc = opts?.defaultCenter ?? { lat: DEFAULT_POSITION.lat, lng: DEFAULT_POSITION.lng };

        map.value = new maps.value.Map(
            containerEl,
            { center: new maps.value.LatLng(dc.lat, dc.lng), level }
        )

        const coords = await getPosition();
        await setPosition(coords.lat, coords.lng, { move: true, smooth: true });

        if(coords.lat == DEFAULT_POSITION.lat && coords.lng == DEFAULT_POSITION.lng){
            console.log("GPS 값을 찾지 못했습니다.")
        }


    }

    function makeMarkerEl(type: string, data: Place) {
        const markerEl = document.createElement("div");
        markerEl.setAttribute("data-title", name);

        const comp = createApp(MapMarker,{
            type: type,
            place: data
        });
        comp.mount(markerEl);

        return markerEl.firstChild as HTMLElement;
    }

    async function getPosition() {
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

    async function setPosition(
        lat: number, lng: number, opts: { move?: boolean, smooth?:boolean } = {}
    ): Promise<void>{
        position.value = { lat, lng };
        if (opts?.move) {
            const ll = transKakaoLatLng(lat, lng);
            (opts.smooth ?? true) ? map.value.panTo(ll) : map.value.setCenter(ll);
        }

        if (!centerMarker) { // 이후에 useKakaoMap으로 마커 이동 함수 분할
            centerMarker = new maps.value.CustomOverlay({
                position: transKakaoLatLng(),
                map: map.value,
                clickable: true,
                content: makeMarkerEl("me"),
                yAnchor:1,
                zIndex: 1000
            });
        } else {
            centerMarker.setPosition(transKakaoLatLng());
            if (!centerMarker.getMap()) centerMarker.setMap(map.value);
        }
    }

    function clearMarkers() {
        markers.forEach(m => m.setMap(null));
        markers.length = 0;
    }

    async function renderMarker(places: Place[]) {
        console.log('렌더 마커',map.value, maps.value)
        if(!map.value || !maps.value) return;

        clearMarkers();

        console.log('마커!',maps.value.Marker)

        places.forEach((place) => {
            const pos = transKakaoLatLng(place.y, place.x);

            const m = new maps.value.CustomOverlay({
                position: pos,
                map: map.value,
                clickable: true,
                content: makeMarkerEl("place",place),
                yAnchor:1,
                title: place.name,
                zIndex: 10
            });

            markers.push(m);
        })

        // clusterer.addMarkers(markers);
        console.log('마커스',markers)
    }

    function transKakaoLatLng(lat?: number, lng?: number) {
        const c = lat != null && lng != null ? { lat, lng } : (position.value ?? DEFAULT_POSITION);
        return new maps.value.LatLng(c.lat, c.lng);
    }

    return { map, maps, init,position,renderMarker }
}
