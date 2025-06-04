import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fordTools from "./ford";

export function resourcesFactory(server: McpServer): void {
    fordTools(server);
}