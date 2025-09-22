import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import {DEFAULT_POSITION} from "@/contants/map.ts";

export type BBox = { sw:{lat:number; lng:number}, ne:{lat:number; lng:number} }


export const useMapStore = defineStore('map',() => {
    const currentPosition = ref({lat: DEFAULT_POSITION.lat, lng: DEFAULT_POSITION.lng});

    function setCurrentPosition(loc) {
        currentPosition.value = loc;
    }

    return { currentPosition, setCurrentPosition };
})