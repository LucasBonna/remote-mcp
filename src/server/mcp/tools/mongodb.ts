import {
    formatErrorResponse,
    formatSuccessResponse,
    getClientDatabase,
} from "@/db/mongodb";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export default function mongodbTools(server: McpServer) {
    server.tool(
        "get-invoice-nfe-info",
        "Get monitored invoice information",
        {
            clientId: z.string().describe("The client identifier"),
            invoiceKey: z
                .string()
                .describe("The NFe invoice key to search for"),
        },
        async ({ clientId, invoiceKey }) => {
            try {
                const db = await getClientDatabase(clientId);
                const collection = db.collection("invoices");
                const result = await collection.findOne({
                    type: "nfe",
                    "data.chave_acesso": invoiceKey,
                });
                return formatSuccessResponse(
                    result,
                    clientId,
                    "findOne",
                    "invoices",
                );
            } catch (err) {
                return formatErrorResponse(
                    err,
                    clientId,
                    "findOne",
                    "invoices",
                );
            }
        },
    );
}
