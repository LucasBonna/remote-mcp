import { getProcessInfo, getNFeInvoice } from "@/db/oracle";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export default function oracleTools(server: McpServer): void {
    server.tool(
        "get-process-info",
        "Get process information",
        {
            processid: z.number(),
        },
        async ({ processid }, _) => {
            const result = await getProcessInfo(processid);
            return {
                content: result.content.map((item) => ({
                    ...item,
                    type: item.type as "text",
                })),
                isError: result.isError,
            };
        },
    );

    server.tool(
        "get-nfe-invoice",
        "Get NFe monitored invoice",
        {
            invoiceKey: z.number(),
        },
        async ({ invoiceKey }, _) => {
            const result = await getNFeInvoice(invoiceKey);
            return {
                content: result.content.map((item) => ({
                    ...item,
                    type: item.type as "text",
                })),
                isError: result.isError,
            };
        },
    );
}
