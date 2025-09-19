import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import {DEFAULT_POSITION } from "@/composables/useGeoPosition.js";

export type BBox = { sw:{lat:number; lng:number}, ne:{lat:number; lng:number} }

export const useMapStore = defineStore('map',() => {
    const position = ref({lat: DEFAULT_POSITION.lat, lng: DEFAULT_POSITION.lng});

    function setGpsPosition(pos){
        position.value = pos;
    }

    return { position, setGpsPosition };
})