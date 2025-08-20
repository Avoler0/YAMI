import { ref } from "vue";
import {fetchNearby} from "../api/places.ts";
import {useKakaoMap} from "./useKakaoMap.ts";


export function usePlaces(){
    const loading = ref(false);
    const error = ref<string|null>(null);
    const places = ref([]);
    const placeDetail = ref(null);
    const reviews = ref([]);

    async function fetchNearbyPlaces(lat:number, lng:number, radius = 500, limit){
        loading.value = true;

        try{
            const { data } = await fetchNearby(lat, lng, radius, limit);

            console.log('데이터',data)

            data.documents.forEach((item) => {
                if(item.place_name === "문화반점"){
                    console.log('지정 데이터',item)
                }
            })
            places.value = data;
        }catch(e:any){
            error.value = e.message;
        }finally {
            loading.value = false;
        }
    }

    return { loading, error, places, placeDetail, reviews, fetchNearbyPlaces };
}