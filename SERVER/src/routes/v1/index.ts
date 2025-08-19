import { Router } from "express";
import { router as places } from "./places.js";
import createApp from "../../app.js";


export const v1 = Router();

v1.use("/places",places);

