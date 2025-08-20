

import {defineStore} from "pinia";
import { ref } from "vue";
import type {Place} from "../types/places.ts";


export const usePlacesStore = defineStore('places',() => {
    const placeIndex = reactive(new Map<string, Place>());

    function addPlaces(places: Place[]){
        for (const place ofr places){
            placeIndex.set(place.id, place);
        }
    }

    return { placeIndex, addPlaces }
})