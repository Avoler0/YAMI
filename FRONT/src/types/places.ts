
export type Coords = { lat:number; lng: number; }

export type Place = {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    distance: number;
};

export type NearbyPlacesResponse = { data: Place[] }