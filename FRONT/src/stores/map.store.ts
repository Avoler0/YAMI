import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import {DEFAULT_ZOOM_LEVEL} from "../contants/map.ts";

export type BBox = { sw:{lat:number; lng:number}, ne:{lat:number; lng:number} }

export const useMapStore = defineStore('map',() => {
    const zoom = ref(DEFAULT_ZOOM_LEVEL);
    const center = ref(null);
    const currentCells = ref([]);

    const cellCache = reactive(
        new Map<string, { placeIds: Set<string>; fetchedAt: number; }>
    )


    function setZoom(lv: number){ zoom.value = lv };

    function setCenter(lat:number, lng:number){ center.value = { lat,lng }; }

    function setCells(cells: any) { currentCells.value = cells; }

    function cacheCell(cellId:string, placeIds: Set<string>){
        cellCache.set(cellId, { placeIds, fetchedAt: Date.now() });
    }

    return { zoom, center, currentCells, cellCache, setZoom, setCenter, setCells, cacheCell };
})