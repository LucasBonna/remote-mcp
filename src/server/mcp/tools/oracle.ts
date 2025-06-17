import { getClientConfig } from "@/db/mongodb";
import { getProcessInfo, getNFeInvoice, getProcessInfoByNFe } from "@/db/oracle";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";


export default function oracleTools(server: McpServer): void {
    server.tool(
        "get-process-info",
        "Get process information in oracle by processid",
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
        "get-process-info-by-nfe",
        "Get process information in oracle by nfe key",
        {
            clientId: z.string(),
            invoiceKey: z.array(z.string()),
        },
        async ({ invoiceKey, clientId }, _) => {
            const clientConfig = getClientConfig(clientId);
            if (!clientConfig) {
                return { isError: true, content: [{ type: "text", text: "Client config not found." }] };
            }
            const result = await getProcessInfoByNFe(clientConfig.oracleDBName, invoiceKey);
            console.log("Result2", result)
            return {
                content: result.content.map((item) => ({
                    ...item,
                    type: "text"
                })),
                isError: result.isError,
            };
        },
    )

    server.tool(
        "get-nfe-invoice",
        "Get NFe monitored invoice in Oracle",
        {
            clientId: z.string(),
            invoiceKeys: z.array(z.string()),
        },
        async ({ invoiceKeys, clientId }, _) => {
            const clientConfig = getClientConfig(clientId);
            if (!clientConfig) {
                return { isError: true, content: [{ type: "text", text: "Client config not found." }] };
            }
            const result = await getNFeInvoice(clientConfig.oracleDBName, invoiceKeys);
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
