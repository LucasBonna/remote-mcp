import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import oracleTools from "./oracle";

export function toolsFactory(server: McpServer): void {
    oracleTools(server);
};