import express from "express";
import router from "@/server/http/routes/router";
import authenticate from "./middlewares/authentication";

export async function initHTTPServer() {
  const app = express();

  app.use(authenticate);

  app.use("/", router);

  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`Server Running on PORT: ${PORT}`);
  });
}
