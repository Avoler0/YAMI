import { ref } from "vue";
import {fetchNearby} from "../api/places.ts";
import {useKakaoMap} from "./useKakaoMap.ts";
import {usePlacesStore} from "../stores/places.store.ts";
import {makeGridCells} from "../utils/gridUtils.ts";
import {debounce} from "../utils/libUtils.ts";


export function usePlaces(){
    const loading = ref(false);
    const error = ref<string|null>(null);
    const places = ref([]);
    const placeDetail = ref(null);
    const reviews = ref([]);


    async function loadPlaces(map){
        const gridCells = makeGridCells(map,100);

        console.log('디바운스')

        await fetchNearbyPlaces(gridCells)
    }


    async function fetchNearbyPlaces(cells){
        loading.value = true;

        try{
            const { addPlaces } = usePlacesStore();
            const { data } = await fetchNearby(cells);

            console.log('플레이쓰',data)
            // addPlaces(data);

            places.value = data;
        }catch(e:any){
            error.value = e.message;
            console.log('에러?',error)
        }finally {
            loading.value = false;
        }
    }

    return { loading, error, places, placeDetail, reviews, loadPlaces };
}