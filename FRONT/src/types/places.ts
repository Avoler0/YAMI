
export type Coords = { lat:number; lng: number; }

export type Place = {
    address_name:string, // EX ) 서울 성동구 송정동 66-263
    category_group_code:string, // EX ) FD6
    category_group_name:string, // EX ) 음식점
    category_name:string, // EX ) 음식점 > 중식 > 중국요리
    distance:string, // EX ) 52
    id:string, // EX ) 7283971
    phone:string, // EX ) 02-123-4567
    place_name:string, // EX ) 홍콩반점
    place_url:string, // EX ) http//place.map.kakao.com/1234656
    road_address_name:string, // EX ) 서울 성동구 광나루로 307
    x:string, // EX ) 127.081729340
    y:string, // EX ( 37.5489283092
};

export type NearbyPlacesResponse = { data: Place[] }


