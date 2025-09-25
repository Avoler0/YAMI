import { Router } from "express";
import axios from "axios";
import pLimit from "p-limit";
import {getCenterAndRadius} from "../../utils/placeCellUtil";

export const router = Router();

const PAGE_SIZE = 15;
const MAX_PAGES = 45;
const CONCURRENCY = 5;

function computePageLimit(pageableCount:number){
    const pagesByCount = Math.ceil((pageableCount ?? 0) / PAGE_SIZE);

    return Math.min(Math.max(pagesByCount, 1), MAX_PAGES);
}

function pushDocs(uniq:Map<string, any>, docs: any[]){
    for (const d of docs) {
        const id = String(d.id ?? d.place_id ?? d.key ?? `${d.x},${d.y}`);
        if(!uniq.has(id)) uniq.set(id, d);
    }
}

async function fetchNearbyKakaoPlacesPage(
    params: {
        lat: number;
        lng: number;
        radius: number;
        page: number;
        size: number;
    }){
    const { lat, lng, radius, page, size } = params;

    const r = await axios.get(
        "https://dapi.kakao.com/v2/local/search/category.json",
        {
            headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_KEY}` },
            params: {
                category_group_code: "FD6",
                x: lng,
                y: lat,
                radius: Math.min(radius, 20000),
                sort:"distance",
                size:size,
                page:page
            },
            timeout: 15000
        }
    );

    return r.data as {
        documents: any[];
        meta: {
            total_count: number;
            pageable_count: number; // 실제 페이징 가능한 개수(최대 45 * size)
            is_end: boolean;
            same_name?: any;
        };
    };
}

async function fetchNearbyKakaoPlacesAll(cell){
    const { center, radius } = getCenterAndRadius(cell);
    let allDocuments:any = [];
    let page = 1;
    let isEnd = false;

    while(!isEnd){
        try {
            const response = await axios.get(
                "https://dapi.kakao.com/v2/local/search/category.json",
                {
                    headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_KEY}` },
                    params: {
                        category_group_code: "FD6",
                        x: center.lng,
                        y: center.lat,
                        radius: Math.min(Math.ceil(radius), 20000), // 반경 올림 처리, 최대 20km
                        sort: "distance",
                        size: 15, // 한 페이지에 가져올 개수
                        page: page,
                    },
                    timeout: 15000
                }
            );

            const { documents, meta } = response.data;
            if (documents.length > 0) {
                allDocuments.push(...documents);
            }

            isEnd = meta.is_end;
            page++;

            // 카카오 API는 최대 45개까지만 제공하므로 3페이지(15*3) 이상은 의미 없음
            if (page > 3) break;

        } catch (error) {
            console.error("카카오 API 호출 중 에러 발생:", error);
            break; // 에러 발생 시 해당 cell 탐색 중단
        }
    }

    return allDocuments;
}

router.post('/nearby', async (req, res) => {
    const { cells } = req.body as { cells: Cell[] };

    console.log('nearby 요청 도착',req)



    if (!cells || cells.length === 0) {
        return res.status(400).json({ message: "셀 정보가 없습니다." });
    }

    // 모든 셀에 대한 API 요청을 병렬로 처리하여 속도 향상
    const promises = cells.map(cell => fetchNearbyKakaoPlacesAll(cell));
    const resultsByCell = await Promise.all(promises);

    // 중복 제거를 위해 Map 사용 (id를 key로 사용)
    const placeMap = new Map<string, KakaoPlace>();

    // 2차원 배열(resultsByCell)을 1차원으로 만들고 Map에 저장하여 중복 제거
    resultsByCell.flat().forEach(place => {
        if (!placeMap.has(place.id)) {
            placeMap.set(place.id, place);
        }
    });

    // Map의 value들만 배열로 변환하여 최종 결과로 사용
    const uniquePlaces = Array.from(placeMap.values());

    console.log('데이터 정렬',uniquePlaces)

    res.json({ results: uniquePlaces });
    
})