import { http } from "@/lib/http.ts";
import type {NearbyPlacesResponse} from "../types/places.ts";


export async function fetchNearby(lat: number, lng:number, radius = 500, limit:number){
    const q = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        radius: String(radius),
        limit:String(limit)
    })
    
    return http<NearbyPlacesResponse>(`/places/nearby?${q.toString()}`);
}