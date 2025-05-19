import express from "express";
import router from "@/server/http/routes/router";

export async function initHTTPServer() {
    const app = express();

    app.use("/", router);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server Running on PORT: ${PORT}`);
    });
};
