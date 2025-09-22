import {defineStore} from "pinia";
import type {Place} from "../types/places.ts";
import {reactive, ref} from "vue";


export const usePlacesStore = defineStore('places',() => {
    const places = reactive(new Map<string, Place>());
    const placeCount = ref(0);

    function addPlaces(data: { count: number; documents: Place[] }) {
        const placesData:Place[] = data.documents;
        placeCount.value = data.count;

        for (const place of placesData){
            places.set(place.id, place);
        }

    }

    function getPlace(id:number){
        return places.get(id);
    }

    return { places, addPlaces, getPlace }
})