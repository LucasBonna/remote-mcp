import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

export async function initOraclePool() {
    try {
        await oracledb.createPool({
            user: process.env.ORACLE_USER || "SYSTEM",
            password: process.env.ORACLE_PASSWORD || "teste123",
            connectString:
                process.env.ORACLE_CONNECTION_STRING || "localhost:1521/FREE",
            stmtCacheSize: 30,
            poolMax: 10,
            poolMin: 2,
            poolTimeout: 60,
            poolPingInterval: 60,
        });
        return true;
    } catch (err: unknown) {
        return false;
    }
}

function successContent(data: any) {
    return [{ type: "json", data: { success: true, data } }];
}

function errorContent(error: string) {
    return [{ type: "json", data: { success: false, error } }];
}

export async function getNFeInvoice(dbName: string, invoiceKeys: string[]) {
    let connection;
    try {
        const binds: Record<string, any> = {};
        const placeholders = invoiceKeys.map((key, index) => {
            const name = `key${index}`;
            binds[name] = key;
            return `:${name}`;
        });

        const inClause = placeholders.join(", ");
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT CHAVE, INVOICE_ID, PROCESSID, DATA_HORA_MONITORAMENTO, STATUS FROM WS_HUB_NFE WHERE CHAVE IN (${inClause})`,
            binds,
            { outFormat: oracledb.OUT_FORMAT_OBJECT },
        );

        const data = result.rows || [];

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        {
                            success: true,
                            data,
                        },
                        null,
                        2,
                    ),
                },
            ],
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        {
                            success: false,
                            error: errorMessage,
                        },
                        null,
                        2,
                    ),
                },
            ],
            isError: true,
        };
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err: unknown) {}
        }
    }
}

export async function getProcessInfo(dbName: string, processId: number) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT * FROM WS_PROCESS_001 WHERE PROCESSID = :id`,
            { id: processId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT },
        );

        const data = result.rows || [];

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        {
                            success: true,
                            data,
                        },
                        null,
                        2,
                    ),
                },
            ],
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        {
                            success: false,
                            error: errorMessage,
                        },
                        null,
                        2,
                    ),
                },
            ],
            isError: true,
        };
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err: unknown) {}
        }
    }
}

export async function getProcessInfoByNFe(dbName: string, invoiceKeys: string[]) {
    let connection;
    try {
        const binds: Record<string, any> = {};
        const placeholders = invoiceKeys.map((key, index) => {
            const name = `key${index}`;
            binds[name] = key;
            return `:${name}`;
        });

        const inClause = placeholders.join(", ");
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `
                SELECT P.PROCESSID, P.TASKNAME
                FROM ${dbName}.WS_PROCESS_001 P
                JOIN ${dbName}.NOTA N ON P.IDXML = N.IDOCS_ID
                WHERE N.CHAVENFE IN (${inClause})
            `,
            binds,
            { 
                outFormat: oracledb.OUT_FORMAT_OBJECT
            },
        );
        console.log("result", result)

        const data = result.rows || [];

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        {
                            success: true,
                            data,
                        },
                        null,
                        2,
                    ),
                },
            ],
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        {
                            success: false,
                            error: errorMessage,
                        },
                        null,
                        2,
                    ),
                },
            ],
            isError: true,
        };
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err: unknown) {}
        }
    }
}
