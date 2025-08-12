import { ref } from "vue";
import {fetchNearby} from "../api/places.ts";


export function usePlaces(){
    const loading = ref(false);
    const error = ref<string|null>(null);
    const places = ref([]);
    const placeDetail = ref(null);
    const reviews = ref([]);

    async function fetchNearbyPlaces(lat:number, lng:number, radius = 500){
        loading.value = true;

        try{
            const { data } = await fetchNearby(lat, lng, radius);

            places.value = data;
        }catch(e:any){
            error.value = e.message;
        }finally {
            loading.value = false;
        }
    }

    return { loading, error, places, placeDetail, reviews, fetchNearbyPlaces };
}