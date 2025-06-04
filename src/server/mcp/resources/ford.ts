import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export default function fordTools(server: McpServer) {
    server.resource(
        "ford",
        "resource://ford",
        async (uri) => {
            return {
                contents: [{
                    uri: uri.href,
                    text: "As notas da ford sao monitoradas pelo hub, que chama o webhook da plataforma, que por sua vez baixa o xml e salva no diretorio /nfe, onde um job que roda de 20 em 20 segundos, move as notas para a pasta de processando, e inicia os processos, e depois move para a pasta de concluido"
                }]
            }
        }
    )
}