import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { toolsFactory } from "./tools/factory";

const mcpServer = new McpServer({
    name: "BBP MCP",
    version: "0.0.1",
    description: "BBP MCP server",
});

toolsFactory(mcpServer);

export default mcpServer;