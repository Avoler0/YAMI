import {ref} from "vue";
import { useLoadingStore } from "@/stores/loading"
import {useGeoPosition, position , DEFAULT_POSITION } from "@/composables/useGeoPosition.ts";
import {loadKakaoMap} from "../utils/loadKakaoMap.ts";

export function useKakaoMap(){
    const map = ref<any>(null);
    const maps = ref<any>(null);
    const geo = useGeoPosition();

    async function init(containerEl: HTMLElement, opts?: { level?: number; defaultCenter?: {lat:number; lng:number} })  {
        const kakao = await loadKakaoMap();

        maps.value = kakao.maps;

        const level = opts?.level ?? 3;
        const dc = opts?.defaultCenter ?? { lat: DEFAULT_POSITION.lat, lng: DEFAULT_POSITION.lng };

        map.value = new maps.value.Map(
            containerEl,
            { center: new maps.value.LatLng(dc.lat, dc.lng), level }
        )

        geo.bind(map.value, maps.value);

        await geo.setFromGeo();

        if(position.value.lat == DEFAULT_POSITION.lat && position.value.lng == DEFAULT_POSITION.lng){
            console.log("GPS 값을 찾지 못했습니다.")
        }


    }

    async function getPlace(){

    }

    return { map, maps, geo, init }
}