import express from "express";
import axios from "axios";
import cors from "cors";
import helmet from "helmet";
import {v1} from "./routes/v1/index.js";

export const createApp = () => {
    const app = express();

    app.use(helmet({
        contentSecurityPolicy: false // 예: 개발 중에는 CSP 끔
    }));
    app.use(cors({ origin: ["http://localhost:5173"] }));
    app.use(express.json());
    app.get("/health", (_, res) => res.json({ ok: true }));

    app.use((req, res, next) => {
        const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        console.log(`[${req.method}] ${fullUrl}`);

        // 요청 바디도 찍고 싶으면 (POST/PUT 등)
        if (Object.keys(req.body || {}).length > 0) {
            console.log("Body:", req.body);
        }

        next(); // 다음 미들웨어로 넘기기
    });

    app.use("/v1",v1);

    return app;
}



export default createApp;