import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export default function fordTools(server: McpServer) {
    server.resource(
        "ford",
        "resource://ford",
        async (uri) => {
            return {
                contents: [{
                    uri: uri.href,
                    text: `
                        Descrição do Fluxo de Monitoramento de Notas Fiscais

                        1. Entrada no Hub
                        •⁠ Todas as notas fiscais monitoradas são inicialmente inseridas no Hub (MongoDB).

                        2. Gravação no Oracle
                        •⁠ O Hub então grava os dados das notas em tabelas específicas do ORACLE, conforme o tipo:
                        - NFe → WS_HUB_NFE
                        - NFSe → WS_HUB_NFSE
                        - CTe → WS_HUB_CTE

                        3.Início do Fluxo
                        •⁠ Um job chamado "Start de Fluxo" verifica essas tabelas do ORACLE (WS_HUB_NFE, WS_HUB_NFSE, WS_HUB_CTE) e identifica quais notas ainda não têm processo iniciado na tabela WS_PROCESS_001.

                        4. Criação do Processo
                        •⁠ Para cada nota sem processo:
                        - O job insere o caminho do arquivo XML na tabela WS_PROCESS_DOCS.
                        - Cria um registro da nota em uma das tabelas conforme o tipo:
                            - NFe → NOTA
                            - NFSe → NOTASERVICO
                            - CTe → CTE
                        - Depois, o job cria um registro de processo na tabela WS_PROCESS_001.

                        5. Critério de Integração
                        •⁠ A nota só é considerada integrada quando há um registro correspondente na tabela WS_PROCESS_001.

                        Ford - Gestão de Entradas DFe

                        Existem regras específicas de validação que direcionam os processos para os fluxos corretos, conforme os valores dos campos GATE e CAPS.

                        Resumo dos comportamentos:

                        1. GATE = S, CAPS = S
                        - O processo entra na tarefa "Integração NF500"
                        - Passa automaticamente pela etapa "Aguardando Confirmação GATE"
                        - Segue para "Aguardando Confirmação de Pagamento"

                        2. GATE = N, CAPS = N
                        - O processo entra na tarefa "Integração NF500"
                        - Para na etapa "Aguardando Confirmação GATE"
                        - Após a confirmação, segue para "Manifesto"

                        3. GATE = S, CAPS = N
                        - O processo entra na tarefa "Integração NF500"
                        - Passa automaticamente pela etapa "Aguardando Confirmação GATE"
                        - Segue direto para "Manifesto"

                        4. GATE = N, CAPS = S
                        - O processo entra na tarefa "Integração NF500"
                        - Para na etapa "Aguardando Confirmação GATE"
                        - Após a confirmação, segue para "Aguardando Confirmação de Pagamento"

                        Essas regras garantem o direcionamento adequado do processo, conforme os critérios definidos no fluxo da Ford.
                    `
                }]
            }
        }
    )
}