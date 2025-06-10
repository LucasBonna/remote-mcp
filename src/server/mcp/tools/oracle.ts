import { getClientConfig } from "@/db/mongodb";
import { getProcessInfo, getNFeInvoice } from "@/db/oracle";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export default function oracleTools(server: McpServer): void {
    server.tool(
        "get-process-info",
        "Get process information",
        {
            clientId: z.string(),
            processid: z.number(),
        },
        async ({ processid, clientId }, _) => {
            const clientConfig = getClientConfig(clientId);
            if (!clientConfig) {
                return { isError: true, content: [{ type: "text", text: "Client config not found." }] };
            }
            const result = await getProcessInfo(clientConfig.oracleDBName, processid);
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
            clientId: z.string(),
            invoiceKey: z.number(),
        },
        async ({ invoiceKey, clientId }, _) => {
            const clientConfig = getClientConfig(clientId);
            if (!clientConfig) {
                return { isError: true, content: [{ type: "text", text: "Client config not found." }] };
            }
            const result = await getNFeInvoice(clientConfig.oracleDBName, invoiceKey);
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
