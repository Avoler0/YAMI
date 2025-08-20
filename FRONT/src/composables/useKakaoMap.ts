import {createApp, ref} from "vue";
import { useMapStore } from "@/stores/map.store.ts"
import {loadKakaoMap} from "@/utils/loadKakaoMap.ts";
import type {Coords} from "@/types/places.ts";
import { DEFAULT_POSITION } from "@/contants/map.ts";
import type {Place} from "../types/places.ts";

import MapMarker from "../components/map/MapMarker.vue";
import {DEFAULT_ZOOM_LEVEL, MAX_ZOOM_LEVEL} from "../contants/map.ts";
import {boundsFromKakao} from "../utils/cell.utils.ts";

let imgMe: any, imgPlace: any, imgPlaceSelected: any;
const position = ref<Coords | null> (null);
const bounds = ref<kakao.maps.LatLngBounds | null>(null);
const map = ref<any>(null);
const maps = ref<any>(null);
let centerMarker: any = null;
const markers:any[] = [];




export function useKakaoMap(){
    const mapStore = useMapStore();

    async function init(containerEl: HTMLElement, opts?: { level?: number; defaultCenter?: {lat:number; lng:number} })  {
        const kakao = await loadKakaoMap();
        const level = opts?.level ?? opts?.level >= MAX_ZOOM_LEVEL ? DEFAULT_ZOOM_LEVEL : opts?.level;
        const defaultCenter = opts?.defaultCenter ?? { lat: DEFAULT_POSITION.lat, lng: DEFAULT_POSITION.lng };

        maps.value = kakao.maps;

        map.value = new maps.value.Map(
            containerEl,
            { center: new maps.value.LatLng(defaultCenter.lat, defaultCenter.lng), level, maxLevel: MAX_ZOOM_LEVEL }
        )

        const coords = await getPosition();
        await setPosition(coords.lat, coords.lng, { move: true, smooth: true });

        if(coords.lat == DEFAULT_POSITION.lat && coords.lng == DEFAULT_POSITION.lng){
            console.log("GPS 값을 찾지 못했습니다.")
        }



        maps.value.event.addListener(map.value, 'zoom_changed', () => { mapStore.setZoom(map.value.getLevel()); })



        const bounds = boundsFromKakao(map.value.getBounds())

        console.log('바운즈',bounds,transKakaoLatLng(bounds.sw))
    }




    function updateBounds(){
        bounds.value = map.value.getBounds();

        console.log('바운즈',bounds)
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

    function setMarker(className:string,position:any,data?: Place) {
        return new maps.value.CustomOverlay({
            position: position,
            map: map.value,
            clickable: true,
            content: makeMarkerEl(className,data),
            yAnchor:1,
            zIndex: 5
        });
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

        setMarker('me',transKakaoLatLng());
    }

    function clearMarkers() {
        markers.forEach(m => m.setMap(null));
        markers.length = 0;
    }

    async function renderMarker(places: Place[]) {
        console.log('렌더 마커',map.value, maps.value)
        if(!map.value || !maps.value) return;

        clearMarkers();

        places.forEach((place) => {
            const pos = transKakaoLatLng(place.y, place.x);

            setMarker('place',pos,place)
        })
    }

    function transKakaoLatLng(lat?: number, lng?: number) {
        const c = lat != null && lng != null ? { lat, lng } : (position.value ?? DEFAULT_POSITION);
        return new maps.value.LatLng(c.lat, c.lng);
    }

    return { map, maps, init,position,renderMarker,updateBounds, bounds }
}
