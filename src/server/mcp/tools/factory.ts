import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import oracleTools from "./oracle";
import mongodbTools from "./mongodb";

export function toolsFactory(server: McpServer): void {
    oracleTools(server);
    mongodbTools(server);
};