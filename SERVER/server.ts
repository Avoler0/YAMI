import dotenv from "dotenv";

dotenv.config();

import createApp from "./src/app.ts";

const PORT = process.env.PORT || 3000;

createApp().listen(PORT, () => {
    console.log("Server started on port: " + PORT);
})