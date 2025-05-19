import type { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const transports: { [sessionId: string]: SSEServerTransport } = {};

export default transports;