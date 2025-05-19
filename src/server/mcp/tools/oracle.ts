import { executeQuery } from "@/db/oracle";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export default function oracleTools(server: McpServer): void {
    server.tool(
        "get-process-info",
        "Get process information",
        {
            processid: z.number(),
        },
        async ({ processid }) => {
            return await executeQuery(processid);
        }
    );
}
