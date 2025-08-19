import { Router } from "express";
import axios from "axios";

export const router = Router();

router.get('/nearby', async (req, res) => {
    console.log("GET /nearby");
    try{
        const lat = Number(req.query.lat);
        const lng = Number(req.query.lng);
        const radius = Math.min(Number(req.query.radius || 500), 20000);

        console.log(req.query)

        if(Number.isNaN(lat) || Number.isNaN(lng)) {
            return res.status(400).json({ error: { message: "lat , lng 필요" } })
        }

        const r = await axios.get(
            "https://dapi.kakao.com/v2/local/search/category.json",
            {
                headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_KEY}` },
                params: {
                    category_group_code: "FD6",
                    x: lng,
                    y: lat,
                    radius: radius,
                    sort:"distance",
                    size:15
                 }
            }
        )

        res.status(r.status).json({ data: r.data })

    } catch(err) {
        console.error(err?.response?.data || err.message);
        res.status(500).json({ error: { message: "카카오 로컬 API 호출 실패" } });
    }
})