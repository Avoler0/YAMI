import { Router } from "express";
import axios from "axios";
import pLimit from "p-limit";

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

async function fetchNearbyKakaoPlacesAll(params: {
    lat: number;
    lng: number;
    radius: number;
}){
    const first = await fetchNearbyKakaoPlacesPage({ ...params, page:1 })
    const pageableCount = first.meta.pageable_count ?? first.meta.total_count ?? 0;
    const pageLimit = computePageLimit(pageableCount);

    console.log('페이지 올',pageableCount, first.meta.total_count)

    const uniq = new Map<string, any>();
    pushDocs(uniq,first.documents);

   if(pageLimit === 1 || first.meta.is_end){
       return { count:uniq.size, documents: [...uniq.values()] };
   }

   const limit = pLimit(CONCURRENCY);
   const tasks: Promise<void>[] = [];

   for (let p = 2; p <= pageLimit; p++) {
       tasks.push(
           limit(async () => {
               const pg = await fetchNearbyKakaoPlacesPage({...params, page:p});

               pushDocs(uniq,pg.documents);
           })
       )
   }

    console.log('페이지 리밋',tasks)


   await Promise.all(tasks);

    return { count: uniq.size, documents: [...uniq.values()] };
}

router.get('/nearby', async (req, res) => {
    console.log("GET /nearby");
    try{
        const lat = Number(req.query.lat);
        const lng = Number(req.query.lng);
        const radius = Math.min(Number(req.query.radius || 500), 20000);
        const limit = Math.max(1, Math.min(Number(req.query.limit || 50), 500));

        console.log(req.query)

        if(Number.isNaN(lat) || Number.isNaN(lng)) {
            return res.status(400).json({ error: { message: "lat , lng 필요" } })
        }

        const data = await fetchNearbyKakaoPlacesAll({lat,lng,radius});

        const trimmed = { ...data, documents: data.documents.slice(0, limit) };

        // console.log('데이터!',data)
        res.status(200).json({ data: data })

    } catch(err) {
        console.error(err?.response?.data || err.message);
        res.status(500).json({ error: { message: "카카오 로컬 API 호출 실패" } });
    }
})