import { initOraclePool } from "@/db/oracle";
import { initHTTPServer } from "@/server/http/server";

async function main() {
  const oraclePool = await initOraclePool();
  if (!oraclePool) {
    console.error("Failed to initialize Oracle connection pool");
    process.exit(1);
  }

  await initHTTPServer();

  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
  });
  
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
  });
}

main().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});