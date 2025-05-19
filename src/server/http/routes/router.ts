import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { Request, Response } from "express";
import express from "express";
import transports from "@/utils/transports";
import mcpServer from "@/server/mcp/server";

const router = express.Router();

router.get("/connection", async(req: Request, res: Response) => {
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;

    console.log("SSE session started:", transport.sessionId);

    res.on("close", () => {
        console.log("SSE session closed:", transport.sessionId);
        delete transports[transport.sessionId];
    });

    await mcpServer.connect(transport);
    
    console.log("SSE session connected:", transport.sessionId);
    await sendMessages(transport);
});

router.post("/messages", async(req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
        res.status(400).send({ messages: "sessionId is required" });
        return
    }
    const transport = transports[sessionId];
    if (!transport) {
        res.status(404).send({ messages: "No transport found for sessionId" });
        return
    }

    const mockedResponse = "This is a mocked response from the AI";

    await transport.send({
        jsonrpc: "2.0",
        method: "notifications/message",
        params: {
            level: "info",
            data: mockedResponse,
        }
    })
    console.log("Stream started")

    await transport.handlePostMessage(req, res, req.body);
});

async function sendMessages(transport: SSEServerTransport) {
    try {
        await transport.send({
            jsonrpc: "2.0",
            method: "notifications/message",
            params: { 
                level: "info",
                data: "Stream started" 
            }
        })
        console.log("Stream started")


        let messageCount = 0
        const interval = setInterval(
            async () => {
                messageCount++

                const message = `Message ${messageCount} at ${new Date().toISOString()}`

                try {
                    await transport.send({
                        jsonrpc: "2.0",
                        // id: 1,
                        // result: {
                        //     message: "Stream completed"
                        // }
                        method: "notifications/message",
                        params: { 
                            level: "info",
                            data: message
                        }
                    })

                    console.log(`Sent: ${message}`)

                    if (messageCount === 2) {
                        clearInterval(interval)
                        await transport.send({
                            jsonrpc: "2.0",
                            // id: 2,
                            // result: {
                            //     message: "Stream completed"
                            // }
                            method: "notifications/message",
                            params: {
                                level: "info",
                                data: "Stream completed"
                            }
                        })
                        console.log("Stream completed")
                    }

                } catch (error) {
                    console.error("Error sending message:", error)
                    clearInterval(interval)
                }
            }, 1000
        )
    } catch (error) {
      console.error("Error sending message:", error)
    }
}

export default router;