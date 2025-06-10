export interface ClientConfig {
  clientId: string;
  clientName: string;
  uri: string;
  mongoDBName: string;
  oracleDBName: string;
}

export const CLIENT_CONFIGS: Record<string, ClientConfig> = {
  "ford": {
    clientId: process.env.MONGODB_FORD_CLIENTID!,
    clientName: "ford",
    uri: process.env.MONGODB_FORD_URI!,
    mongoDBName: process.env.MONGODB_FORD_DB!,
    oracleDBName: process.env.ORACLE_FORD_DB!,
  },
  "wheaton": {
    clientId: process.env.MONGODB_WHEATON_CLIENTID!,
    clientName: "wheaton",
    uri: process.env.MONGODB_WHEATON_URI!,
    mongoDBName: process.env.MONGODB_WHEATON_DB!,
    oracleDBName: process.env.ORACLE_WHEATON_DB!,
  },
};