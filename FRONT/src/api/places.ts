import http from "@/lib/http.ts";
import type {NearbyPlacesResponse} from "../types/places.ts";


export async function fetchNearby(cells){
    return http<NearbyPlacesResponse>.post(`/places/nearby`,{
        cells:cells
    });

}