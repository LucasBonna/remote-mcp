import {
    formatErrorResponse,
    formatSuccessResponse,
    getClientDatabase,
} from "@/db/mongodb";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { array, z } from "zod";

export default function mongodbTools(server: McpServer) {
    server.tool(
        "get-invoice-nfe-info",
        "Get monitored invoice information in Hub",
        {
            clientId: z.string().describe("The client identifier"),
            invoiceKeys: z
                .array(z.string())
                .describe("The NFe invoice key to search for"),
        },
        async ({ clientId, invoiceKeys }) => {
            try {
                const db = await getClientDatabase(clientId);
                const collection = db.collection("invoices");
                const result = await collection.find({
                    type: "nfe",
                    "data.chave_acesso": { $in: invoiceKeys },
                }).toArray();
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
